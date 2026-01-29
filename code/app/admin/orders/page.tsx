"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Package, MoreHorizontal, Eye, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            toast.error("Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) =>
        order.id.toString().includes(searchTerm) ||
        order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.business_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'default'; // dark/black usually
            case 'delivered': return 'success'; // if we had a success variant, else default or outline greenish
            case 'pending': return 'warning'; // yellow-ish ideally, secondary works
            case 'cancelled': return 'destructive';
            case 'processing': return 'outline';
            default: return 'outline';
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'delivered' || s === 'completed') return 'default';
        if (s === 'cancelled') return 'destructive';
        if (s === 'pending') return 'secondary';
        return 'outline';
    };

    const getStatusStyle = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'delivered' || s === 'completed') return "bg-green-50 text-green-700 border-green-200 hover:bg-green-50";
        if (s === 'pending') return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50";
        if (s === 'cancelled') return ""; // destructive handles it
        return "";
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

    return (
        <div className="container py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
                    <p className="text-muted-foreground mt-1">{orders.length} total transactions</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[300px]">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders, customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    {/* Placeholder for filter button if implemented later */}
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <Package className="h-12 w-12 opacity-50 mb-4" />
                        <p className="text-lg font-medium mb-4">No orders found.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <Card className="hidden md:block overflow-hidden border shadow-sm p-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30 [&_tr]:border-b">
                                    <TableRow>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Order ID</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Customer</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Business</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Items</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Amount</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Date</TableHead>
                                        <TableHead className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="[&_tr:last-child]:border-0 bg-card">
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id} className="border-b transition-colors hover:bg-muted/40">
                                            <TableCell className="p-6 font-mono font-medium">#{order.id}</TableCell>
                                            <TableCell className="p-6 font-medium">{order.user_name}</TableCell>
                                            <TableCell className="p-6 text-muted-foreground">{order.business_name}</TableCell>
                                            <TableCell className="p-6">{order.item_count}</TableCell>
                                            <TableCell className="p-6 font-mono font-medium">{formatPrice(order.total_amount)}</TableCell>
                                            <TableCell className="p-6">
                                                <Badge variant={getStatusBadgeVariant(order.status) as any} className={`font-normal ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-6 text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="p-6 text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredOrders.map((order) => (
                            <Card key={order.id} className="overflow-hidden p-0">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-lg">#{order.id}</span>
                                                <Badge variant={getStatusBadgeVariant(order.status) as any} className={`text-[10px] h-5 px-1.5 font-normal ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-0.5">{new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild className="h-8">
                                            <Link href={`/admin/orders/${order.id}`}>View</Link>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                                        <div>
                                            <p className="text-muted-foreground text-xs">Customer</p>
                                            <p className="font-medium truncate">{order.user_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Business</p>
                                            <p className="font-medium truncate">{order.business_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Items</p>
                                            <p className="font-medium">{order.item_count}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Total Amount</p>
                                            <p className="font-bold">{formatPrice(order.total_amount)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
