"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, ShoppingBag, Truck, CheckCircle2, Clock, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: string;
    image_url: string;
}

interface Order {
    id: number;
    business_name: string;
    total_amount: string;
    status: string;
    items: OrderItem[];
    created_at?: string;
}

const statusColorMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    processing: "default",
    shipped: "default",
    completed: "default", // Using default (primary color) for success/completed
    cancelled: "destructive",
};

const statusIconMap: Record<string, any> = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    completed: CheckCircle2,
    cancelled: HelpCircle,
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Artificial delay for smooth skeleton demo
                await new Promise(resolve => setTimeout(resolve, 800));

                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 md:px-6 max-w-4xl space-y-6">
                <div className="h-10 w-48 bg-secondary/50 rounded-md animate-pulse mb-8" />
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="bg-secondary/5 pb-4">
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-full" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <Skeleton className="h-16 w-full rounded-md" />
                            <Skeleton className="h-16 w-full rounded-md" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-primary/10 p-6 rounded-full mb-6 animate-in zoom-in duration-500">
                    <ShoppingBag className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-3 tracking-tight">No Orders Yet</h1>
                <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                    Looks like you haven't discovered our amazing products yet.
                </p>
                <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">My Orders</h1>
            <p className="text-muted-foreground mb-8">Manage and track your recent purchases.</p>

            <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {orders.map((order) => {
                    const StatusIcon = statusIconMap[order.status.toLowerCase()] || Package;

                    return (
                        <motion.div key={order.id} variants={itemVariants}>
                            <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow group">
                                <CardHeader className="bg-secondary/5 border-b border-border/50 pb-4">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                                <span className="text-muted-foreground text-sm">• {new Date().toLocaleDateString()}</span>
                                            </div>
                                            <CardDescription className="flex items-center gap-1.5 text-foreground/80 font-medium">
                                                <StoreIcon className="w-3.5 h-3.5" />
                                                {order.business_name}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                            <Badge variant={statusColorMap[order.status.toLowerCase()] || "outline"} className="px-3 py-1 flex items-center gap-1.5 capitalize text-sm font-medium pl-2">
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {order.status}
                                            </Badge>
                                            <span className="font-bold text-lg tabular-nums">
                                                {formatPrice(parseFloat(order.total_amount))}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="group/item flex items-start gap-4 p-2 -mx-2 rounded-lg hover:bg-secondary/30 transition-colors">
                                                <div className="h-16 w-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0 border border-border/50 relative">
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.product_name}
                                                        className="object-cover h-full w-full transition-transform duration-300 group-hover/item:scale-105"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className="font-semibold text-sm truncate pr-2">{item.product_name}</p>
                                                        <p className="text-sm font-medium tabular-nums whitespace-nowrap">
                                                            {formatPrice(parseFloat(item.price) * item.quantity)}
                                                        </p>
                                                    </div>
                                                    <p className="text-muted-foreground text-xs mt-1">
                                                        {formatPrice(parseFloat(item.price))} × {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <Separator className="bg-border/50" />
                                <CardFooter className="bg-secondary/5 py-3 px-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs h-9 gap-2">
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        Need Help?
                                    </Button>
                                    <Button size="sm" className="w-full sm:w-auto text-xs h-9 gap-2 shadow-sm">
                                        Track Order
                                        <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}

function StoreIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
        </svg>
    )
}
