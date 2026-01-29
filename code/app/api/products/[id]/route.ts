import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // In Next.js 15+, params is a Promise
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        const result = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const row = result.rows[0];
        const product = {
            ...row,
            category: row.category_name,
            price: parseFloat(row.price),
            image: row.image_url
        };

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { name, description, price, category_id, image_url, stock } = body;

        // Basic validation
        if (!name || !price || !category_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Ideally check ownership here using token/session
        // For MVP/Consistency with POST: relying on implicit trust or client-side checks (NOT SECURE but matches existing pattern)

        const result = await pool.query(
            `UPDATE products 
             SET name = $1, description = $2, price = $3, category_id = $4, image_url = $5, stock = $6, updated_at = NOW()
             WHERE id = $7
             RETURNING *`,
            [name, description, price, category_id, image_url, stock, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
