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

async function debugAmul() {
    const client = await pool.connect();
    try {
        console.log("--- DEBUGGING AMUL DATA ---");

        // 1. Get User
        const userRes = await client.query("SELECT * FROM users WHERE email = 'amul@market.com'");
        if (userRes.rows.length === 0) {
            console.log("User 'amul@market.com' NOT FOUND");
            return;
        }
        const user = userRes.rows[0];
        console.log("User:", { id: user.id, name: user.name, role: user.role });

        // 2. Get Business
        const busRes = await client.query("SELECT * FROM businesses WHERE owner_id = $1", [user.id]);
        if (busRes.rows.length === 0) {
            console.log("No Business found for owner_id:", user.id);
            return;
        }
        const business = busRes.rows[0];
        console.log("Business:", { id: business.id, name: business.name, owner_id: business.owner_id });

        // 3. Get Products
        const prodRes = await client.query("SELECT id, name, business_id FROM products WHERE business_id = $1", [business.id]);
        console.log(`Found ${prodRes.rows.length} products for business_id ${business.id}:`);
        prodRes.rows.forEach(p => console.log(` - [${p.id}] ${p.name} (bus_id: ${p.business_id})`));

    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        process.exit();
    }
}

debugAmul();
