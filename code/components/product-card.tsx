"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Star, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        useCart.getState().addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="group relative h-full flex flex-col overflow-hidden border-border/40 bg-card transition-all hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 p-0 gap-0">
                {/* Overlay Link making the whole card clickable */}
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-10 focus:outline-none">
                    <span className="sr-only">View {product.name}</span>
                </Link>

                <div className="block relative aspect-[4/3] overflow-hidden bg-muted">
                    <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized={product.image.includes('placehold.co') || product.image.includes('unsplash') || product.image.includes('loremflickr') || product.image.includes('bing.net')} // Optimization often fails for external sources in local dev
                        />
                    </motion.div>
                    <div className="absolute top-2 left-2 z-20">
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-black/60 font-medium">
                            {product.category}
                        </Badge>
                    </div>
                </div>

                <CardContent className="flex-1 p-3 md:p-5 space-y-2 pointer-events-none">
                    <h3 className="line-clamp-1 text-base md:text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span>4.8</span>
                        <span className="text-xs text-muted-foreground/60">(128)</span>
                    </div>

                    <p className="line-clamp-2 text-xs md:text-sm text-muted-foreground/80 leading-relaxed">
                        {product.description}
                    </p>
                </CardContent>

                <CardFooter className="p-3 md:p-5 pt-0 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="flex flex-col">
                        <span className="text-lg md:text-xl font-bold text-foreground">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    {/* Re-enable pointer events for the button wrapper */}
                    <div className="pointer-events-auto relative z-20">
                        <AnimatePresence mode="wait">
                            {isAdded ? (
                                <motion.div
                                    key="added"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 md:h-9 rounded-full px-3 md:px-5 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/20"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    >
                                        <Check className="h-3.5 w-3.5 md:mr-1.5" />
                                        <span className="hidden md:inline font-semibold text-xs uppercase">Added</span>
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="add"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <Button
                                        size="sm"
                                        className="h-8 md:h-9 rounded-full px-3 md:px-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm"
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="h-3.5 w-3.5 md:mr-2" />
                                        <span className="hidden md:inline font-semibold tracking-wide text-xs uppercase">Add</span>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
