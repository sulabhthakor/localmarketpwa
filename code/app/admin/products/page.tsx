"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Trash2, Package, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatPrice, cn } from "@/lib/utils";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/admin/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            toast.error("Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/admin/products/${deleteId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Product deleted successfully");
                setProducts(products.filter(p => p.id !== deleteId));
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete product");
            }
        } catch (error) {
            toast.error("Error deleting product");
        } finally {
            setDeleteId(null);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

    return (
        <div className="container py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
                    <p className="text-muted-foreground mt-1">View and manage platform catalog.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[300px]">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products, businesses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <Package className="h-12 w-12 opacity-50 mb-4" />
                        <p className="text-lg font-medium mb-4">No products found.</p>
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
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Product</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Category</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Business</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Price</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Stock</TableHead>
                                        <TableHead className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="[&_tr:last-child]:border-0 bg-card">
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id} className="border-b transition-colors hover:bg-muted/40">
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
                                            <TableCell className="p-6 align-middle font-medium">{product.name}</TableCell>
                                            <TableCell className="p-6 align-middle">
                                                <Badge variant="secondary" className="font-normal">{product.category_name || "Uncategorized"}</Badge>
                                            </TableCell>
                                            <TableCell className="p-6 align-middle text-sm text-muted-foreground">{product.business_name}</TableCell>
                                            <TableCell className="p-6 align-middle font-mono font-medium">{formatPrice(product.price)}</TableCell>
                                            <TableCell className="p-6 align-middle">
                                                <Badge variant={product.stock > 10 ? "outline" : "destructive"} className={cn("font-normal", product.stock > 0 && "bg-green-50 text-green-700 border-green-200")}>
                                                    {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-6 align-middle text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteId(product.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently remove "{product.name}" from the catalog.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
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
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(product.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently remove "{product.name}" from the catalog.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1">{product.business_name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-bold text-sm">{formatPrice(product.price)}</span>
                                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal truncate max-w-[80px]">
                                                {product.category_name || "General"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant={product.stock > 10 ? "outline" : "destructive"} className={cn("text-[10px] px-1.5 h-5 font-normal", product.stock > 0 && "bg-green-50 text-green-700 border-green-200")}>
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
