"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Home } from "lucide-react";

export default function CartPage() {
    const cart = useCart();

    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax mock
    const total = subtotal + tax;
    const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    if (cart.items.length === 0) {
        return (
            <div className="container px-4 py-6 md:px-6">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm mb-8">
                    <Link
                        href="/"
                        className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        <span className="ml-1.5 hidden sm:inline">Home</span>
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                    <span className="font-medium text-foreground">Cart</span>
                </nav>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/60" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-3 text-center">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-8 text-center max-w-sm">
                        Looks like you haven't added anything yet. Explore our products and find something you love!
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:px-6 pb-44 md:pb-6">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm mb-6">
                <Link
                    href="/"
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                    <Home className="h-4 w-4" />
                    <span className="ml-1.5 hidden sm:inline">Home</span>
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                <span className="font-medium text-foreground">Cart</span>
            </nav>

            {/* Header with item count */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                {/* Mobile Layout (stacked) */}
                                <div className="flex flex-col sm:flex-row">
                                    {/* Image */}
                                    <div className="relative w-full sm:w-32 h-40 sm:h-32 overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 flex flex-col">
                                        {/* Title and Price Row */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 pr-4">
                                                <h3 className="font-semibold text-base line-clamp-2">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground capitalize mt-0.5">{item.category}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {formatPrice(item.price)} each
                                                </p>
                                            </div>
                                            <p className="font-bold text-lg text-primary">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>

                                        {/* Actions Row */}
                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full hover:bg-background"
                                                    onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full hover:bg-background"
                                                    onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-3"
                                                onClick={() => cart.removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="ml-2 hidden sm:inline">Remove</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Continue Shopping Link */}
                    <div className="pt-4">
                        <Link
                            href="/products"
                            className="text-sm text-primary hover:underline inline-flex items-center"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Order Summary - Desktop */}
                <div className="hidden md:block">
                    <Card className="sticky top-20">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-lg font-bold">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax (10%)</span>
                                    <span className="font-medium">{formatPrice(tax)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>
                            <Button className="w-full h-12 text-base font-semibold" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Secure checkout powered by Stripe
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Mobile Sticky Checkout Bar - positioned above bottom nav */}
            <div className="fixed bottom-16 left-0 right-0 bg-background border-t shadow-lg p-4 md:hidden z-40">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-xs text-muted-foreground">Total ({itemCount} items)</p>
                            <p className="text-xl font-bold text-primary">{formatPrice(total)}</p>
                        </div>
                        <Button className="h-12 px-8 rounded-full font-semibold" asChild>
                            <Link href="/checkout">Checkout</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
