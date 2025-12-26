import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user: any = verifyToken(token);
    if (!user || user.role !== "business_owner") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = await pool.connect();
    try {
        const res = await client.query("SELECT * FROM businesses WHERE owner_id = $1", [user.id]);
        if (res.rows.length === 0) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }
        return NextResponse.json(res.rows[0]);
    } catch (error) {
        console.error("Error fetching business settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PATCH(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user: any = verifyToken(token);
    if (!user || user.role !== "business_owner") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { name, address, phone, description } = await req.json();

        const client = await pool.connect();
        try {
            const res = await client.query(
                `UPDATE businesses 
                 SET name = COALESCE($1, name), 
                     address = COALESCE($2, address), 
                     phone = COALESCE($3, phone),
                     description = COALESCE($4, description)
                 WHERE owner_id = $5 
                 RETURNING *`,
                [name, address, phone, description, user.id]
            );

            if (res.rows.length === 0) {
                return NextResponse.json({ error: "Business not found" }, { status: 404 });
            }

            return NextResponse.json(res.rows[0]);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error updating business settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
