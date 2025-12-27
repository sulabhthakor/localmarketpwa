import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
        const { name, email, role } = body;
        const { id: userId } = await params;

        // Validation
        if (!name || !email || !role) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // Check if email is taken by another user
        const existingInfo = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
        if (existingInfo.rows.length > 0) {
            return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
        }

        // Fetch target user to check permissions (Optional: Prevent Admin from demoting Super Admin)
        const targetUserRes = await query('SELECT role FROM users WHERE id = $1', [userId]);
        if (targetUserRes.rows.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const targetUser = targetUserRes.rows[0];

        // RBAC: Standard Admin cannot modify Super Admin or other Admins (policy choice)
        // User requested: "Admins can edit accounts of seller and buyers... Super admin can reset credentials of all"
        // Let's assume standard Admin can only edit Buyer/Business Owner.
        if (decoded.role === 'admin') {
            if (targetUser.role === 'admin' || targetUser.role === 'super_admin') {
                return NextResponse.json({ message: 'You cannot modify other administrators.' }, { status: 403 });
            }
            // Also prevent promoting someone to Admin/Super Admin
            if (role === 'admin' || role === 'super_admin') {
                return NextResponse.json({ message: 'You cannot promote users to Admin.' }, { status: 403 });
            }
        }

        await query('UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4', [name, email, role, userId]);

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
