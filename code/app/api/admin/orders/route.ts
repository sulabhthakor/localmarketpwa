import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
    try {
        const result = await query(`
            SELECT 
                o.id, 
                o.total_amount, 
                o.status, 
                o.created_at, 
                u.name as user_name, 
                b.name as business_name,
                (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            JOIN businesses b ON o.business_id = b.id 
            ORDER BY o.created_at DESC
        `);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
