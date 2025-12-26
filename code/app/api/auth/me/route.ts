import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const payload = verifyToken(token);

        if (!payload || typeof payload !== 'object' || !('id' in payload)) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const result = await query('SELECT * FROM users WHERE id = $1', [(payload as any).id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const user = result.rows[0];

        // Remove sensitive data
        const { password_hash, ...safeUser } = user;

        return NextResponse.json({ user: safeUser }, { status: 200 });

    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
