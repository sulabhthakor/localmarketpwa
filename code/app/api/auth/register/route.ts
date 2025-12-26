import { NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (!['buyer', 'business_owner'].includes(role)) {
            return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
        }

        // Check if user exists
        const userCheck = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        // Hash password & Create user
        const hashed = await hashPassword(password);
        const result = await query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashed, role]
        );
        const user = result.rows[0];

        // If Business Owner, creating a business record might happen here or in a separate flow.
        // For now, we just register the user.

        // Generate JWT
        const token = generateToken({ id: user.id, role: user.role, email: user.email });

        const response = NextResponse.json({ user, message: 'Registered successfully' }, { status: 201 });

        response.cookies.set('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
