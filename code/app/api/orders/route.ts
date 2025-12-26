import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, shippingDetails, paymentMethod, totalAmount } = body;

        if (!items || !shippingDetails || !paymentMethod) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Create Order
            // For now, we assume a guest user or use a hardcoded user ID (e.g., mock buyer ID 1) 
            // since we haven't fully integrated Auth provider on the client side yet (using basic cookies).
            // Let's assume User ID 1 for now if no auth header found, or simple token check.
            // For this demo, lets hardcode userID = 1 (John Buyer).
            const userId = 1;
            // Business ID? Orders might contain products from multiple businesses.
            // Our schema links Order to Business. If an order has multiple business items, 
            // we should conceptually split it into sub-orders or the schema enforces 1 business per order.
            // Schema: order -> business_id (NOT NULL).
            // This implies logic: "An order belongs to ONE business".
            // If cart has multiple business items, we need to split orders.
            // For simplicity, let's assume all items are from same business or pick the first one.
            // Let's group items by business_id. (Wait, Product seed used Business ID 1).
            // Let's look up product's business ID.

            // Fetch products to get business IDs and verify prices
            const productIds = items.map((i: any) => i.id);
            const productsRes = await client.query(
                'SELECT id, business_id, price FROM products WHERE id = ANY($1)',
                [productIds]
            );
            const dbProducts = new Map(productsRes.rows.map(row => [row.id, row]));

            // Group items by business
            const ordersByBusiness = new Map();

            for (const item of items) {
                const dbProd = dbProducts.get(item.id);
                if (!dbProd) throw new Error(`Product ${item.id} not found`);

                const bid = dbProd.business_id;
                if (!ordersByBusiness.has(bid)) {
                    ordersByBusiness.set(bid, { items: [], total: 0 });
                }
                const group = ordersByBusiness.get(bid);
                group.items.push({ ...item, price: parseFloat(dbProd.price) });
                group.total += parseFloat(dbProd.price) * item.quantity;
            }

            // Create an order for each business
            const createdOrderIds = [];

            for (const [bid, data] of ordersByBusiness) {
                const orderRes = await client.query(`
                INSERT INTO orders (user_id, business_id, status, total_amount)
                VALUES ($1, $2, 'pending', $3)
                RETURNING id
             `, [userId, bid, data.total]);
                const orderId = orderRes.rows[0].id;
                createdOrderIds.push(orderId);

                // Create Order Items
                for (const item of data.items) {
                    await client.query(`
                    INSERT INTO order_items (order_id, product_id, quantity, price)
                    VALUES ($1, $2, $3, $4)
                 `, [orderId, item.id, item.quantity, item.price]);
                }

                // Create Payment Record (Simulated)
                await client.query(`
                INSERT INTO payments (order_id, amount, method, status)
                VALUES ($1, $2, $3, 'completed')
             `, [orderId, data.total, paymentMethod]);
            }

            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                orderIds: createdOrderIds,
                message: 'Order(s) placed successfully'
            });

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
