import { NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
        }

        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const user = result.rows[0];
        const isValid = await comparePassword(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT
        const token = generateToken({ id: user.id, role: user.role, email: user.email });

        const response = NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            message: 'Logged in successfully'
        });

        response.cookies.set('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
