import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const { status } = await req.json();

        // Validate status if needed

        const result = await query(
            "UPDATE businesses SET subscription_status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Seller not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating seller:", error);
        return NextResponse.json({ error: "Failed to update seller" }, { status: 500 });
    }
}
