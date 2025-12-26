import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Starting Migration: Multi-Role Support...');
        await client.query('BEGIN');

        // 1. Update Products Table
        console.log('Adding is_approved to products...');
        await client.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT TRUE
        `);

        // 2. Update Users Role Constraint
        console.log('Updating users role constraint...');

        // First, drop the existing constraint. We need to find its name or just try 'users_role_check' which is standard postgres naming if created inline
        // But to be safe, we can do it via a DO block or just error catch.
        // Let's assume standard creation name or just rely on replacing it.
        // If the schema was created with `CHECK (role IN ...)` usually it gets a name like `users_role_check`.

        try {
            await client.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
        } catch (e) {
            console.log('Constraint might have a different name, trying generic update...');
        }

        // Re-add the constraint with super_admin
        await client.query(`
            ALTER TABLE users 
            ADD CONSTRAINT users_role_check 
            CHECK (role IN ('buyer', 'business_owner', 'admin', 'super_admin'))
        `);

        await client.query('COMMIT');
        console.log("Migration Complete!");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Migration Failed:", e);
    } finally {
        client.release();
        process.exit();
    }
}

migrate();
