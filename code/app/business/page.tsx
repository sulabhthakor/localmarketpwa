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
        <div className="container mx-auto py-6 px-4 md:py-10 md:px-8 space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-b pb-6">
                <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight truncate">
                        {business.name}
                    </h1>
                    <div className="flex items-center text-muted-foreground mt-1 text-sm">
                        <Package className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{business.address || 'No address set'}</span>
                    </div>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button asChild size="sm" className="flex-1 md:flex-none shadow-sm">
                        <Link href="/products/new">
                            <Plus className="mr-1.5 h-4 w-4" /> Add Product
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="shrink-0">
                        <Link href="/business/settings">
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline ml-1.5">Settings</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3">
                <Link href="/business/revenue" className="block col-span-2 md:col-span-1">
                    <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/80 h-full cursor-pointer group">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">Revenue</span>
                                <div className="p-1.5 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                    <DollarSign className="h-3.5 w-3.5 text-primary" />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-bold">{formatPrice(totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Lifetime earnings</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/business/orders" className="block">
                    <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500 h-full cursor-pointer group">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-blue-600 transition-colors">Orders</span>
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <ShoppingBag className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-bold">{orderCount}</div>
                            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Total orders</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/business/products" className="block">
                    <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500 h-full cursor-pointer group">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-green-600 transition-colors">Products</span>
                                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                    <Package className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="text-2xl md:text-3xl font-bold">{productCount}</div>
                            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">Active listings</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent Orders Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold tracking-tight">Recent Orders</h2>
                    <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 text-xs h-8 px-2">
                        <Link href="/business/orders">View All &rarr;</Link>
                    </Button>
                </div>

                {recentOrders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 text-center text-muted-foreground">
                            <ShoppingBag className="h-10 w-10 mb-3 opacity-30" />
                            <p className="font-medium">No orders yet</p>
                            <p className="text-sm">Your recent orders will appear here.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Mobile View: Cards */}
                        <div className="md:hidden space-y-3">
                            {recentOrders.map((order: any) => (
                                <Card key={order.id} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-primary">#{order.id}</span>
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            'bg-gray-50 text-gray-700 border-gray-200'
                                                        }`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                    <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#efeae3' }}>
                                                        <span className="text-[10px] font-medium">{order.customer_name.charAt(0)}</span>
                                                    </div>
                                                    <span className="truncate">{order.customer_name}</span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="font-bold tabular-nums">{formatPrice(order.order_total)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-border/50 flex justify-end">
                                            <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-primary hover:bg-primary/10">
                                                <Link href={`/business/orders/${order.id}`}>Manage &rarr;</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden md:block">
                            <Card className="overflow-hidden border shadow-sm">
                                <CardContent className="p-0">
                                    <div className="w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="bg-muted/30 [&_tr]:border-b">
                                                <tr className="border-b transition-colors">
                                                    <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Order ID</th>
                                                    <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Customer</th>
                                                    <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                                                    <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Total</th>
                                                    <th className="h-11 px-4 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0 bg-card">
                                                {recentOrders.map((order: any) => (
                                                    <tr key={order.id} className="border-b transition-colors hover:bg-muted/40 cursor-pointer">
                                                        <td className="p-4 align-middle font-medium text-primary">#{order.id}</td>
                                                        <td className="p-4 align-middle font-medium">{order.customer_name}</td>
                                                        <td className="p-4 align-middle">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${order.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                                    'bg-gray-100 text-gray-700 border border-gray-200'
                                                                }`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-middle font-mono font-medium">{formatPrice(order.order_total)}</td>
                                                        <td className="p-4 align-middle text-right">
                                                            <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
                                                                <Link href={`/business/orders/${order.id}`}>Manage</Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

