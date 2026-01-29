"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, MoreHorizontal, Search, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductsClientProps {
    initialProducts: any[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                        <Link href="/business">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                        <p className="text-muted-foreground">{products.length} products listed</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[300px]">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button asChild className="shrink-0 gap-2 shadow-sm">
                        <Link href="/products/new">
                            <Plus className="h-4 w-4" /> Add Product
                        </Link>
                    </Button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <Package className="h-12 w-12 opacity-50 mb-4" />
                        <p className="text-lg font-medium mb-4">No products found.</p>
                        {products.length === 0 && (
                            <Button asChild>
                                <Link href="/products/new">Create Your First Product</Link>
                            </Button>
                        )}
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
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs w-[100px]">Image</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Name</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Category</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Price</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Stock</TableHead>
                                        <TableHead className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="[&_tr:last-child]:border-0 bg-card">
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id} className="border-b transition-colors hover:bg-muted/40 product-row">
                                            <TableCell className="p-6 align-middle">
                                                <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-secondary/20">
                                                    <Image
                                                        src={product.image_url || '/placeholder.png'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-6 align-middle font-medium">
                                                <Link href={`/products/${product.id}`} className="hover:underline">
                                                    {product.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="p-6 align-middle">
                                                <Badge variant="secondary" className="font-normal">{product.category_id || 'General'}</Badge>
                                            </TableCell>
                                            <TableCell className="p-6 align-middle font-mono font-medium">{formatPrice(product.price)}</TableCell>
                                            <TableCell className="p-6 align-middle">
                                                <Badge variant={product.stock > 10 ? "outline" : "destructive"} className={`font-normal ${product.stock > 0 ? "bg-green-50 text-green-700 border-green-200" : ""}`}>
                                                    {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-6 align-middle text-right">
                                                <Button variant="outline" size="sm" asChild className="h-8 hover:bg-primary hover:text-primary-foreground transition-colors">
                                                    <Link href={`/products/${product.id}/edit`}>
                                                        Edit
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-card border rounded-xl p-4 shadow-sm flex gap-4">
                                <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border bg-secondary/10">
                                    <Image
                                        src={product.image_url || '/placeholder.png'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-semibold text-sm truncate pr-2">{product.name}</h3>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1 text-muted-foreground">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/products/${product.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1.5">{product.category_id}</p>
                                        <p className="font-bold text-sm">{formatPrice(product.price)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant={product.stock > 10 ? "outline" : "destructive"} className={`text-[10px] px-1.5 h-5 font-normal ${product.stock > 0 ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50" : ""}`}>
                                            {product.stock > 0 ? `${product.stock} left` : "Out of Stock"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
