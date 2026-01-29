import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        // Fetch Order Details
        const orderRes = await query(`
            SELECT 
                o.id, 
                o.total_amount, 
                o.status, 
                o.created_at, 
                u.name as user_name, 
                u.email as user_email,
                b.name as business_name,
                b.address as business_address,
                b.phone as business_phone
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            JOIN businesses b ON o.business_id = b.id 
            WHERE o.id = $1
        `, [id]);

        if (orderRes.rowCount === 0) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const order = orderRes.rows[0];

        // Fetch Order Items
        const itemsRes = await query(`
            SELECT 
                oi.id, 
                oi.quantity, 
                oi.price, 
                p.name as product_name, 
                p.image_url 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = $1
        `, [id]);

        // Fetch Delivery Updates (if any)
        const deliveryRes = await query(`
            SELECT status, update_time, location 
            FROM delivery_updates 
            WHERE order_id = $1 
            ORDER BY update_time DESC
        `, [id]);

        // Fetch Payment Info
        const paymentRes = await query(`
            SELECT method, status, provider_id, created_at
            FROM payments 
            WHERE order_id = $1
        `, [id]);

        return NextResponse.json({
            ...order,
            items: itemsRes.rows,
            delivery_updates: deliveryRes.rows,
            payment: paymentRes.rows[0] || null
        });

    } catch (error) {
        console.error("Error fetching order details:", error);
        return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
    }
}
