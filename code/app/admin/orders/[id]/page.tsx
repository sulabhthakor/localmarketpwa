"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Package, Clock, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    toast.error("Order not found");
                }
            } catch (error) {
                toast.error("Error fetching order");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!order) return <div className="p-8 text-center">Order not found</div>;

    return (
        <div className="container py-10 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/orders"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Order #{order.id}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" /> {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
                <div className="ml-auto">
                    <Badge className="text-base px-3 py-1 capitalize" variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Customer Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-lg font-medium">{order.user_name}</div>
                        <div className="text-sm text-muted-foreground">{order.user_email}</div>
                    </CardContent>
                </Card>

                {/* Business Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Merchant</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-lg font-medium">{order.business_name}</div>
                        <div className="text-sm text-muted-foreground">{order.business_phone}</div>
                        <div className="text-sm text-muted-foreground">{order.business_address}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>{order.items.length} items purchased</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10 rounded-none bg-muted">
                                            <AvatarImage src={item.image_url} />
                                            <AvatarFallback><Package className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.product_name}</TableCell>
                                    <TableCell className="text-right">₹{Number(item.price).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold">Total Amount</TableCell>
                                <TableCell className="text-right font-bold text-lg">₹{Number(order.total_amount).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Payment Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" /> Payment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {order.payment ? (
                            <>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Method</span>
                                    <span className="font-medium capitalize">{order.payment.method}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium capitalize">{order.payment.status}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-muted-foreground">Transaction ID</span>
                                    <span className="font-medium text-xs font-mono">{order.payment.provider_id || 'N/A'}</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground">No payment record found (Order might be Pay on Delivery).</p>
                        )}
                    </CardContent>
                </Card>

                {/* Delivery Updates */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" /> Delivery History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.delivery_updates && order.delivery_updates.length > 0 ? (
                                order.delivery_updates.map((update: any, i: number) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                            {i !== order.delivery_updates.length - 1 && <div className="w-px h-full bg-border my-1" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="font-medium text-sm">{update.status}</p>
                                            <p className="text-xs text-muted-foreground">{update.location}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{new Date(update.update_time).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground">No updates available yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
