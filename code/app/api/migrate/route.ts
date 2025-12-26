import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    const client = await pool.connect();
    try {
        console.log('Running migration from API...');

        // Add phone
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN 
                    ALTER TABLE users ADD COLUMN phone VARCHAR(20); 
                END IF; 
            END $$;
        `);

        // Add address
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='address') THEN 
                    ALTER TABLE users ADD COLUMN address TEXT; 
                END IF; 
            END $$;
        `);

        // Add image
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='image') THEN 
                    ALTER TABLE users ADD COLUMN image TEXT; 
                END IF; 
            END $$;
        `);

        return NextResponse.json({ message: 'Migration successful' });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    } finally {
        client.release();
    }
}
