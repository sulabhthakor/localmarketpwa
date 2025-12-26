import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign, Plus, Settings } from "lucide-react";
import pool from "@/lib/db";
import { formatPrice } from "@/lib/utils";

async function getBusinessData(userId: number) {
    const client = await pool.connect();
    try {
        // 1. Get Business Details
        const businessRes = await client.query(`SELECT * FROM businesses WHERE owner_id = $1`, [userId]);
        if (businessRes.rows.length === 0) return null;
        const business = businessRes.rows[0];

        // 2. Get Stats
        const productRes = await client.query(`SELECT COUNT(*) as count FROM products WHERE business_id = $1`, [business.id]);

        // Revenue & Order Count
        const statsRes = await client.query(`
            SELECT 
                COUNT(DISTINCT o.id) as order_count,
                COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.business_id = $1
        `, [business.id]);

        // 3. Recent Orders
        const recentOrdersRes = await client.query(`
            SELECT DISTINCT ON (o.id)
                o.id,
                o.created_at,
                o.status,
                u.name as customer_name,
                (
                    SELECT SUM(sub_oi.price * sub_oi.quantity)
                    FROM order_items sub_oi
                    JOIN products sub_p ON sub_oi.product_id = sub_p.id
                    WHERE sub_oi.order_id = o.id AND sub_p.business_id = $1
                ) as order_total
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN users u ON o.user_id = u.id
            WHERE p.business_id = $1
            ORDER BY o.id, o.created_at DESC
            LIMIT 5
        `, [business.id]);

        return {
            business,
            productCount: parseInt(productRes.rows[0].count),
            orderCount: parseInt(statsRes.rows[0].order_count),
            totalRevenue: parseFloat(statsRes.rows[0].total_revenue),
            recentOrders: recentOrdersRes.rows
        };
    } finally {
        client.release();
    }
}

export default async function BusinessDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
        redirect("/login");
    }

    const user: any = verifyToken(token);
    if (!user || user.role !== "business_owner") {
        // If user is logged in but not a seller, maybe redirect or show error
        // For now, redirect to home
        redirect("/");
    }

    const data = await getBusinessData(user.id);

    if (!data) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
                <p className="text-muted-foreground mb-8">You haven't set up your business profile yet.</p>
                <Button asChild>
                    <Link href="/business/register">Register Your Business</Link>
                </Button>
            </div>
        );
    }

    const { business, productCount, orderCount, totalRevenue, recentOrders } = data;

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        {business.name}
                    </h1>
                    <div className="flex items-center text-muted-foreground mt-2">
                        <Package className="mr-2 h-4 w-4" />
                        <span>{business.address || 'No address set'}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button asChild size="lg" className="shadow-sm hover:shadow-md transition-all">
                        <Link href="/products/new">
                            <Plus className="mr-2 h-5 w-5" /> Add Product
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="hover:bg-secondary/50">
                        <Link href="/business/settings">
                            <Settings className="mr-2 h-5 w-5" /> Settings
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Link href="/business/revenue" className="block">
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/80 h-full cursor-pointer group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">Total Revenue</CardTitle>
                            <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                <DollarSign className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatPrice(totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Lifetime earnings across all orders</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/business/orders" className="block">
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 h-full cursor-pointer group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider group-hover:text-blue-600 transition-colors">Total Orders</CardTitle>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{orderCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Orders received and processed</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/business/products" className="block">
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 h-full cursor-pointer group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider group-hover:text-green-600 transition-colors">Products</CardTitle>
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{productCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active products currently listed</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Orders Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Recent Orders</h2>
                    <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                        <Link href="/business/orders">View All Orders &rarr;</Link>
                    </Button>
                </div>

                <Card className="overflow-hidden border shadow-sm">
                    <CardContent className="p-0">
                        {recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">No orders yet</p>
                                <p className="text-sm">Your recent orders will appear here.</p>
                            </div>
                        ) : (
                            <div className="w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="bg-muted/30 [&_tr]:border-b">
                                        <tr className="border-b transition-colors">
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Order ID</th>
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Customer</th>
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Total</th>
                                            <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0 bg-card">
                                        {recentOrders.map((order: any) => (
                                            <tr key={order.id} className="border-b transition-colors hover:bg-muted/40 cursor-pointer">
                                                <td className="p-6 align-middle font-medium text-primary">#{order.id}</td>
                                                <td className="p-6 align-middle font-medium">{order.customer_name}</td>
                                                <td className="p-6 align-middle">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${order.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                            'bg-gray-100 text-gray-700 border border-gray-200'
                                                        }`}>
                                                        {order.status === 'completed' && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600" />}
                                                        {order.status === 'pending' && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-yellow-600" />}
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="p-6 align-middle font-mono font-medium">{formatPrice(order.order_total)}</td>
                                                <td className="p-6 align-middle text-right">
                                                    <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
                                                        <Link href={`/business/orders/${order.id}`}>Manage</Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
