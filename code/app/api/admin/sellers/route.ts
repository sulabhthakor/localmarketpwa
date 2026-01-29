import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
    try {
        const result = await query(`
            SELECT 
                b.id, 
                b.name as business_name, 
                b.address, 
                b.phone, 
                b.subscription_status, 
                b.created_at,
                u.name as owner_name, 
                u.email as owner_email 
            FROM businesses b 
            JOIN users u ON b.owner_id = u.id 
            ORDER BY b.created_at DESC
        `);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching sellers:", error);
        return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 });
    }
}
