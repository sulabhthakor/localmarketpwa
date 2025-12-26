import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function resetDb() {
    try {
        // Dynamic import to ensure env vars are loaded first
        const { default: pool } = await import('../lib/db');

        console.log('Dropping all tables...');
        const client = await pool.connect();
        await client.query(`
      DROP TABLE IF EXISTS translations CASCADE;
      DROP TABLE IF EXISTS languages CASCADE;
      DROP TABLE IF EXISTS delivery_updates CASCADE;
      DROP TABLE IF EXISTS subscriptions CASCADE;
      DROP TABLE IF EXISTS payments CASCADE;
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS carts CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS businesses CASCADE;
      DROP TABLE IF EXISTS admin_users CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
        client.release();
        console.log('All tables dropped.');
    } catch (err) {
        console.error('Error dropping tables:', err);
        process.exit(1);
    }
    // Allow process to exit cleanly
    process.exit(0);
}

resetDb();
