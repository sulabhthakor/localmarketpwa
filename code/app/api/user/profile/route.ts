import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const payload = verifyToken(token) as any;
        if (!payload || !payload.id) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const address = formData.get('address') as string;
        const file = formData.get('image') as File | null; // Assuming input name is 'image'

        let imageUrl = null;
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadDir = join(process.cwd(), 'public/uploads');

            // Ensure uploads directory exists
            await mkdir(uploadDir, { recursive: true });

            const fileName = `${payload.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const filePath = join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            imageUrl = `/uploads/${fileName}`;
        }

        // Construct query dynamically
        let updateQuery = 'UPDATE users SET name = $1, phone = $2, address = $3';
        let queryParams: any[] = [name, phone, address];

        if (imageUrl) {
            updateQuery += ', image = $4';
            queryParams.push(imageUrl);
        }

        updateQuery += ` WHERE id = $${queryParams.length + 1} RETURNING id, name, email, role, image, phone, address`;
        queryParams.push(payload.id);

        const result = await query(updateQuery, queryParams);
        const updatedUser = result.rows[0];

        // Remove password hash just in case
        delete updatedUser.password_hash;

        return NextResponse.json({ user: updatedUser, message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
