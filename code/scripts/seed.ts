import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { mockProducts, mockCategories } from '../lib/mock-data';

dotenv.config({ path: '.env.local' });

async function seed() {
    try {
        // Dynamic import to ensure env vars are loaded first
        const { default: pool } = await import('../lib/db');

        const client = await pool.connect();

        console.log('Seeding database...');
        await client.query('BEGIN');

        // 1. Create a demo user (Buyer)
        const buyerPass = await bcrypt.hash('buyer123', 10);
        const buyerRes = await client.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE SET name=$1
        RETURNING id
    `, ['John Buyer', 'buyer@example.com', buyerPass, 'buyer']);
        const buyerId = buyerRes.rows[0].id;
        console.log(`Created Buyer: ${buyerId}`);

        // 2. Create a demo business owner (Seller)
        const ownerPass = await bcrypt.hash('seller123', 10);
        const ownerRes = await client.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE SET name=$1
        RETURNING id
    `, ['Jane Seller', 'seller@example.com', ownerPass, 'business_owner']);
        const ownerId = ownerRes.rows[0].id;
        console.log(`Created Seller: ${ownerId}`);

        // 3. Create a demo business
        const businessRes = await client.query(`
        INSERT INTO businesses (owner_id, name, address, phone, subscription_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `, [ownerId, 'Local Gadgets & More', '123 Main St, Tech City', '555-0123', 'active']);
        const businessId = businessRes.rows[0].id;
        console.log(`Created Business: ${businessId}`);

        // 4. Create Categories
        const categoryMap = new Map();
        for (const cat of mockCategories) {
            const catRes = await client.query(`
            INSERT INTO categories (name) 
            VALUES ($1)
            RETURNING id, name
        `, [cat.name]);
            categoryMap.set(cat.id, catRes.rows[0].id); // Map mock ID (string) to real ID (int)
        }
        console.log('Created Categories');

        // 5. Create Products
        for (const prod of mockProducts) {
            // Map mock category string to real category ID
            const realApiCategoryId = categoryMap.get(prod.category);

            await client.query(`
            INSERT INTO products (business_id, category_id, name, description, price, stock, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
                businessId,
                realApiCategoryId,
                prod.name,
                prod.description,
                prod.price,
                prod.stock,
                prod.image
            ]);
        }
        console.log(`Created ${mockProducts.length} Products`);

        await client.query('COMMIT');
        console.log('Seeding completed successfully.');
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seed();
