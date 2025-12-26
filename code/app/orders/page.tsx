"use client";

import { Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrdersPage() {
    return (
        <div className="container mx-auto px-4 py-10 text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-secondary/30 p-4 rounded-full">
                    <Package className="h-10 w-10 text-primary" />
                </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
            <Button asChild>
                <Link href="/products">Start Shopping</Link>
            </Button>
        </div>
    );
}
