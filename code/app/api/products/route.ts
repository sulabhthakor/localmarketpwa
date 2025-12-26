import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('category'); // This will be the ID (int)

    try {
        let queryText = `
        SELECT p.*, c.name as category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE 1=1
    `;
        const params: any[] = [];
        let paramIndex = 1;

        if (search) {
            queryText += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        if (categoryId) {
            queryText += ` AND p.category_id = $${paramIndex}`;
            params.push(parseInt(categoryId));
            paramIndex++;
        }

        const minPrice = searchParams.get('min_price');
        const maxPrice = searchParams.get('max_price');

        if (minPrice) {
            queryText += ` AND p.price >= $${paramIndex}`;
            params.push(parseFloat(minPrice));
            paramIndex++;
        }

        if (maxPrice) {
            queryText += ` AND p.price <= $${paramIndex}`;
            params.push(parseFloat(maxPrice));
            paramIndex++;
        }

        queryText += ` ORDER BY p.created_at DESC`;

        console.log('--- Product API Debug ---');
        console.log('Search Params:', { search, categoryId, minPrice, maxPrice });
        console.log('Query:', queryText);
        console.log('Params:', params);

        const result = await pool.query(queryText, params);

        // Transform to match the frontend expectations if needed, but the DB structure is close.
        // Frontend expects: category: string (slug or name), currently it's ID in DB.
        // The seed script mapped them.
        // Let's modify the response to return 'category' as the name for compatibility with current UI.
        const products = result.rows.map(row => ({
            ...row,
            category: row.category_name, // Map joined column to 'category' field
            price: parseFloat(row.price), // Ensure number
            image: row.image_url // Map image_url to image
        }));

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, price, category_id, image_url, stock, business_id } = body;

        // Validation (Basic)
        if (!name || !price || !business_id || !category_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await pool.query(`
            INSERT INTO products (business_id, category_id, name, description, price, stock, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [business_id, category_id, name, description, price, stock || 0, image_url]);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
