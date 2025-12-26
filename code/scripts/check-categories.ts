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

async function checkCategories() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM categories');
        console.log("Categories in DB:", res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit();
    }
}

checkCategories();
