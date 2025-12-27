import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, User, MapPin, CreditCard, CheckCircle, Clock, Truck } from "lucide-react";
import pool from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function getOrderDetail(orderId: string, businessId: number) {
    const client = await pool.connect();
    try {
        // Fetch order basic info
        const orderRes = await client.query(`
            SELECT 
                o.id, o.created_at, o.status, o.total_amount,
                u.name as customer_name, u.email as customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = $1
        `, [orderId]);

        if (orderRes.rows.length === 0) return null;
        const order = orderRes.rows[0];

        // Fetch items specific to this business
        // Note: In a real multi-seller order, an order might have items from multiple businesses.
        // We only want to show items related to *this* business in the seller dashboard.
        const itemsRes = await client.query(`
            SELECT 
                oi.id, oi.quantity, oi.price,
                p.name as product_name, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1 AND p.business_id = $2
        `, [orderId, businessId]);

        const items = itemsRes.rows;

        // If this business has no items in this order, they shouldn't see it (or it's an error)
        if (items.length === 0) return null;

        // Recalculate total for just this business's items for display
        const businessTotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) * item.quantity), 0);

        return { order, items, businessTotal };
    } finally {
        client.release();
    }
}

async function updateOrderStatus(orderId: string, newStatus: string) {
    "use server";
    const client = await pool.connect();
    try {
        await client.query(`UPDATE orders SET status = $1 WHERE id = $2`, [newStatus, orderId]);
        revalidatePath(`/business/orders/${orderId}`);
        revalidatePath('/business/orders');
    } finally {
        client.release();
    }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) redirect("/login");
    const user: any = verifyToken(token);
    if (!user || user.role !== "business_owner") redirect("/");

    // Get Business ID
    const client = await pool.connect();
    let businessId = null;
    try {
        const res = await client.query(`SELECT id FROM businesses WHERE owner_id = $1`, [user.id]);
        if (res.rows.length > 0) businessId = res.rows[0].id;
    } finally {
        client.release();
    }

    if (!businessId) redirect("/business");

    const data = await getOrderDetail(id, businessId);
    if (!data) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold">Order not found or access denied.</h1>
                <Button asChild className="mt-4">
                    <Link href="/business/orders">Back to Orders</Link>
                </Button>
            </div>
        );
    }

    const { order, items, businessTotal } = data;

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/business/orders">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
                            <Badge className={`uppercase text-[10px] tracking-wide px-2 py-0.5 ${order.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                                order.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                    'bg-slate-500'
                                }`}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Placed on {new Intl.DateTimeFormat('en-IN', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(order.created_at))}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Actions - Server Actions */}
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "pending"); }}>
                        <Button variant="outline" size="sm" disabled={order.status === 'pending'}>
                            <Clock className="w-4 h-4 mr-2" /> Mark Pending
                        </Button>
                    </form>
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "shipped"); }}>
                        <Button variant="outline" size="sm" disabled={order.status === 'shipped'}>
                            <Truck className="w-4 h-4 mr-2" /> Mark Shipped
                        </Button>
                    </form>
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "completed"); }}>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={order.status === 'completed'}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
                        </Button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content - Items */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left font-medium text-muted-foreground py-3">Product</th>
                                            <th className="text-right font-medium text-muted-foreground py-3">Price</th>
                                            <th className="text-center font-medium text-muted-foreground py-3">Qty</th>
                                            <th className="text-right font-medium text-muted-foreground py-3">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item: any) => (
                                            <tr key={item.id} className="border-b last:border-0 border-gray-100">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-lg bg-gray-100 relative overflow-hidden shrink-0">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={item.image_url || "/placeholder.png"} alt={item.product_name} className="object-cover w-full h-full" />
                                                        </div>
                                                        <span className="font-medium text-foreground">{item.product_name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-right py-4">{formatPrice(item.price)}</td>
                                                <td className="text-center py-4">{item.quantity}</td>
                                                <td className="text-right py-4 font-semibold">{formatPrice(item.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={3} className="text-right pt-4 font-medium text-muted-foreground">Order Total</td>
                                            <td className="text-right pt-4 text-xl font-bold text-foreground">{formatPrice(businessTotal)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Customer Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-primary" />
                                Customer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                                <p className="font-medium">{order.customer_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                                <p className="font-medium">{order.customer_email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Contact</p>
                                <p className="font-medium">+91 98765 43210</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPin className="h-4 w-4 text-primary" />
                                Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-muted-foreground">123, Gandhi Road</p>
                            <p className="text-muted-foreground">Near Law Garden</p>
                            <p className="text-muted-foreground">Ahmedabad, Gujarat - 380006</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CreditCard className="h-4 w-4 text-primary" />
                                Payment Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-medium">Cash on Delivery</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Payment Status</span>
                                <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
