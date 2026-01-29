import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Filter } from "lucide-react";
import pool from "@/lib/db";
import { formatPrice } from "@/lib/utils";

async function getOrdersData(userId: number) {
    const client = await pool.connect();
    try {
        const businessRes = await client.query(`SELECT id FROM businesses WHERE owner_id = $1`, [userId]);
        if (businessRes.rows.length === 0) return null;
        const business = businessRes.rows[0];

        // Fetch all orders
        const ordersRes = await client.query(`
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
                ) as order_total,
                (
                    SELECT COUNT(*)
                    FROM order_items sub_oi
                    JOIN products sub_p ON sub_oi.product_id = sub_p.id
                    WHERE sub_oi.order_id = o.id AND sub_p.business_id = $1
                ) as item_count
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN users u ON o.user_id = u.id
            WHERE p.business_id = $1
            ORDER BY o.id DESC, o.created_at DESC
        `, [business.id]);

        return {
            orders: ordersRes.rows
        };
    } finally {
        client.release();
    }
}

export default async function OrdersPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) redirect("/login");

    const user: any = verifyToken(token);
    if (!user || user.role !== "business_owner") redirect("/");

    const data = await getOrdersData(user.id);
    if (!data) redirect("/business");

    const { orders } = data;

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/business">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Orders</h1>
                        <p className="text-muted-foreground">{orders.length} total orders</p>
                    </div>
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter Status
                </Button>
            </div>

            <div className="flex flex-col gap-6">
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {orders.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                                No orders found.
                            </CardContent>
                        </Card>
                    ) : (
                        orders.map((order: any) => (
                            <Card key={order.id} className="overflow-hidden border shadow-sm">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-lg">#{order.id}</span>
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                                    }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(order.created_at))}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatPrice(order.order_total)}</p>
                                            <p className="text-xs text-muted-foreground">{order.item_count} items</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-xs font-medium text-primary">{order.customer_name.charAt(0)}</span>
                                            </div>
                                            {order.customer_name}
                                        </div>
                                        <Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-primary hover:text-primary hover:bg-primary/10 pl-2 pr-1">
                                            <Link href={`/business/orders/${order.id}`}>
                                                Manage <ArrowLeft className="h-3 w-3 rotate-180" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block">
                    <Card className="overflow-hidden border shadow-sm">
                        <CardContent className="p-0">
                            {orders.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    No orders found.
                                </div>
                            ) : (
                                <div className="w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="bg-muted/30 [&_tr]:border-b">
                                            <tr className="border-b transition-colors">
                                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Order ID</th>
                                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Date</th>
                                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Customer</th>
                                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Items</th>
                                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</th>
                                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Total</th>
                                                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0 bg-card">
                                            {orders.map((order: any) => (
                                                <tr key={order.id} className="border-b transition-colors hover:bg-muted/40 cursor-pointer">
                                                    <td className="p-6 align-middle font-medium">#{order.id}</td>
                                                    <td className="p-6 align-middle text-muted-foreground">
                                                        {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(order.created_at))}
                                                    </td>
                                                    <td className="p-6 align-middle font-medium">{order.customer_name}</td>
                                                    <td className="p-6 align-middle text-muted-foreground">{order.item_count} items</td>
                                                    <td className="p-6 align-middle">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${order.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                                            }`}>
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
        </div>
    );
}
