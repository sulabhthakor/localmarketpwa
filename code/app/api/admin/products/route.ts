import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
    try {
        const result = await query(`
            SELECT 
                p.id, 
                p.name, 
                p.price, 
                p.stock, 
                p.image_url, 
                p.created_at,
                b.name as business_name,
                c.name as category_name
            FROM products p 
            JOIN businesses b ON p.business_id = b.id 
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
