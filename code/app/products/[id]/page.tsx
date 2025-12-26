"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Star, Truck, RefreshCw, Loader2, ChevronRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${params.id}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) return null;
                    throw new Error("Failed to fetch product");
                }
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading product:", err);
                setLoading(false);
            });
    }, [params.id]);

    const handleAddToCart = () => {
        if (!product) return;
        useCart.getState().addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-20 text-center flex flex-col items-center gap-4">
                <h1 className="text-3xl font-bold">Product not found</h1>
                <p className="text-muted-foreground">The product you are looking for does not exist.</p>
                <Button asChild>
                    <Link href="/products">Back to Shop</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:px-8 max-w-7xl animate-fade-in-up">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
                {/* Visual Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative aspect-square overflow-hidden rounded-3xl bg-white border border-border/50 shadow-sm md:sticky md:top-24"
                >
                    <Image
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-primary font-bold px-3 py-1 shadow-sm border-0 capitalize">
                            {product.category}
                        </Badge>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col space-y-8 py-4"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-1 bg-white border border-border px-3 py-1 rounded-full shadow-sm">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-sm">4.8</span>
                            </div>
                            <span className="text-sm text-muted-foreground border-l pl-4 border-border">
                                128 verified reviews
                            </span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-bold text-foreground">
                            {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-md">
                            In Stock
                        </span>
                    </div>

                    <div className="prose prose-slate text-muted-foreground leading-relaxed max-w-none">
                        <p>{product.description}</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border">
                        <div className="grid grid-cols-2 gap-4">
                            <AnimatePresence mode="wait">
                                {isAdded ? (
                                    <motion.div
                                        key="added"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="col-span-2"
                                    >
                                        <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 text-lg h-14 rounded-xl">
                                            <Check className="mr-2 h-5 w-5" />
                                            Added to Cart
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="add"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="col-span-2 flex flex-col sm:grid sm:grid-cols-2 gap-4"
                                    >
                                        <Button
                                            size="lg"
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 text-lg h-14 rounded-xl transition-all hover:scale-[1.02]"
                                            onClick={handleAddToCart}
                                        >
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Cart
                                        </Button>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="w-full h-14 rounded-xl border-2 hover:bg-secondary/50 text-foreground font-semibold"
                                        >
                                            Buy Now
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-start p-3 md:p-4 bg-white border border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2 bg-primary/10 rounded-xl mr-3 shrink-0">
                                    <Truck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <span className="block font-semibold text-foreground text-sm mb-0.5">Free Delivery</span>
                                    <span className="text-xs text-muted-foreground leading-tight">Orders over ₹499 in Gujarat</span>
                                </div>
                            </div>
                            <div className="flex items-start p-3 md:p-4 bg-white border border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2 bg-primary/10 rounded-xl mr-3 shrink-0">
                                    <RefreshCw className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <span className="block font-semibold text-foreground text-sm mb-0.5">Easy Returns</span>
                                    <span className="text-xs text-muted-foreground leading-tight">Fast & free local returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
