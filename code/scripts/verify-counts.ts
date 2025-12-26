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

async function checkCounts() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT 
                u.name as seller_name,
                b.name as business_name,
                COUNT(p.id) as product_count
            FROM users u
            JOIN businesses b ON u.id = b.owner_id
            LEFT JOIN products p ON b.id = p.business_id
            GROUP BY u.name, b.name
            ORDER BY u.name
        `);

        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit();
    }
}

checkCounts();
