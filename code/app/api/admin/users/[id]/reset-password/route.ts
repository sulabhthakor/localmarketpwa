import { NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = verifyToken(token);
        if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super_admin')) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { newPassword } = body;
        const { id: userId } = await params;

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Fetch target user
        const targetUserRes = await query('SELECT role FROM users WHERE id = $1', [userId]);
        if (targetUserRes.rows.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const targetUser = targetUserRes.rows[0];

        // RBAC Logic
        // Admin: Can reset Buyer & Business Owner. Cannot reset Admin or Super Admin.
        // Super Admin: Can reset EVERYONE.
        if (decoded.role === 'admin') {
            if (targetUser.role === 'admin' || targetUser.role === 'super_admin') {
                return NextResponse.json({ message: 'Permission Denied: Only Super Admin can reset Admin passwords.' }, { status: 403 });
            }
        }

        const hashedPassword = await hashPassword(newPassword);
        await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);

        return NextResponse.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
