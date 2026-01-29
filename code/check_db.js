
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/localmarket',
});

async function checkData() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
        SELECT b.id, b.name 
        FROM businesses b 
        JOIN products p ON b.id = p.business_id 
        GROUP BY b.id, b.name 
        ORDER BY count(p.id) DESC
    `);
        res.rows.forEach(r => console.log(`ID: ${r.id}, Name: ${r.name}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        pool.end();
    }
}

checkData();
