import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local if present
dotenv.config({ path: '.env.local' });

async function initDb() {
    try {
        // Dynamic import to ensure env vars are loaded first
        const { default: pool } = await import('../lib/db');

        const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Running schema initialization...');
        await client.query(schemaSql);

        client.release();
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
    // Note: We can't easily close the pool here if it's imported dynamically 
    // without potentially messing up type inference, but for a script it's fine 
    // to let the process exit handle it, or we can cast it.
    // For simplicity in this script:
    process.exit(0);
}

initDb();
