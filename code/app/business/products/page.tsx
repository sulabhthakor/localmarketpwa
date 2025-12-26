import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import pool from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function getProductsData(userId: number) {
    const client = await pool.connect();
    try {
        const businessRes = await client.query(`SELECT id FROM businesses WHERE owner_id = $1`, [userId]);
        if (businessRes.rows.length === 0) return null;
        const business = businessRes.rows[0];

        const productsRes = await client.query(`
            SELECT * FROM products 
            WHERE business_id = $1 
            ORDER BY created_at DESC
        `, [business.id]);

        return {
            products: productsRes.rows
        };
    } finally {
        client.release();
    }
}

export default async function ProductsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) redirect("/login");

    const user: any = verifyToken(token);
    if (!user || user.role !== "business_owner") redirect("/");

    const data = await getProductsData(user.id);
    if (!data) redirect("/business");

    const { products } = data;

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/business">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                        <p className="text-muted-foreground">{products.length} products listed</p>
                    </div>
                </div>
                <Button asChild className="gap-2 shadow-sm">
                    <Link href="/products/new">
                        <Plus className="h-4 w-4" /> Add New Product
                    </Link>
                </Button>
            </div>

            <Card className="overflow-hidden border shadow-sm">
                <CardContent className="p-0">
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <p className="text-lg font-medium mb-4">No products listed yet.</p>
                            <Button asChild>
                                <Link href="/products/new">Create Your First Product</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="bg-muted/30 [&_tr]:border-b">
                                    <tr className="border-b transition-colors">
                                        <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs w-[100px]">Image</th>
                                        <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Name</th>
                                        <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Category</th>
                                        <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Price</th>
                                        <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Stock</th>
                                        <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-card">
                                    {products.map((product: any) => (
                                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/40">
                                            <td className="p-4 align-middle">
                                                <div className="relative h-16 w-16 rounded-md overflow-hidden border bg-secondary/50">
                                                    <Image
                                                        src={product.image_url || '/placeholder.png'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-6 align-middle font-medium">
                                                <Link href={`/products/${product.id}`} className="hover:underline">
                                                    {product.name}
                                                </Link>
                                            </td>
                                            <td className="p-6 align-middle text-muted-foreground capitalize">
                                                <Badge variant="secondary">{product.category_id || 'General'}</Badge>
                                            </td>
                                            <td className="p-6 align-middle font-mono font-medium">{formatPrice(product.price)}</td>
                                            <td className="p-6 align-middle">
                                                {product.stock > 0 ? (
                                                    <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                                                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                                        In Stock ({product.stock})
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 flex items-center gap-1 text-xs font-medium">
                                                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6 align-middle text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/products/${product.id}/edit`}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
