"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    // In Next.js 15, params is a Promise. We need to unwrap it using `use` hook or async.
    // Since this is "use client", we can use `use(params)` if React 19, or just `useParams()` from next/navigation.
    // Using `useParams()` is safer for Client Components.
    const router = useRouter();
    const routeParams = useParams();
    const productId = routeParams?.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        stock: "",
        image_url: ""
    });

    useEffect(() => {
        // Fetch Categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error);

        // Fetch User (Authentication Check)
        fetch('/api/auth/me')
            .then(res => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then(data => {
                const user = data.user;
                if (user.role !== 'business_owner') {
                    router.push('/');
                }
            })
            .catch(() => router.push('/login'));

        // Fetch Product Details
        if (productId) {
            fetch(`/api/products/${productId}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch product");
                    return res.json();
                })
                .then(data => {
                    setFormData({
                        name: data.name,
                        description: data.description || "",
                        price: data.price.toString(),
                        category_id: data.category_id.toString(),
                        stock: data.stock.toString(),
                        image_url: data.image_url || ""
                    });
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Error loading product");
                    router.push('/business');
                })
                .finally(() => setFetching(false));
        }
    }, [productId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, category_id: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    category_id: parseInt(formData.category_id)
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update product");
            }

            toast.success("Product updated successfully");
            router.push('/business');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const isImageValid = (url: string) => {
        try {
            new URL(url);
            return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || url.startsWith('http');
        } catch (_) {
            return false;
        }
    };

    if (fetching) {
        return <div className="flex h-[50vh] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-muted-foreground">Update the details of your product listing.</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/business">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Cancel & Return
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>Enter the core information for your item.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Handmade Soap" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                                        <Input id="price" name="price" className="pl-7" type="number" step="0.01" required value={formData.price} onChange={handleChange} placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity</Label>
                                    <Input id="stock" name="stock" type="number" required value={formData.stock} onChange={handleChange} placeholder="10" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={handleSelectChange} value={formData.category_id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" className="min-h-[120px]" required value={formData.description} onChange={handleChange} placeholder="Describe your product features, material, size, etc..." />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                            <CardDescription>Add a visually appealing image.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                            </div>

                            <div className="border rounded-lg overflow-hidden bg-muted/30 aspect-square relative flex items-center justify-center">
                                {formData.image_url && isImageValid(formData.image_url) ? (
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).parentElement?.classList.add('image-error');
                                        }}
                                        onLoad={(e) => {
                                            (e.target as HTMLImageElement).parentElement?.classList.remove('image-error');
                                        }}
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground p-4">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                        </div>
                                        <p className="text-sm">Enter a valid URL to see a preview</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/business">Discard Changes</Link>
                        </Button>
                        <Button type="submit" form="edit-product-form" disabled={loading} className="px-8">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
