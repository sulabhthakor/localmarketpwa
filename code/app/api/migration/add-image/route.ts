import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT;`);
        return NextResponse.json({ message: 'Migration successful: Added image column to users table' });
    } catch (error) {
        console.error('Migration Error:', error);
        return NextResponse.json({ message: 'Migration failed', error: String(error) }, { status: 500 });
    }
}
