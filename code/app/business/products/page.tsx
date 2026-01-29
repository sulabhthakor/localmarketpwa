import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import ProductsClient from "./client";

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

async function ProductsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) redirect("/login");

    const user: any = verifyToken(token);
    if (!user || user.role !== "business_owner") redirect("/");

    const data = await getProductsData(user.id);
    if (!data) redirect("/business");

    const { products } = data;

    return <ProductsClient initialProducts={products} />;
}

export default ProductsPage;
