import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        // Optional: Check if product is in any active orders before deleting? 
        // For now, simpler DELETE. Postgres foreign keys might block it if cascading isn't set.
        // Assuming soft delete is better but for now hard delete as requested in management.

        const result = await query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
    }
}
