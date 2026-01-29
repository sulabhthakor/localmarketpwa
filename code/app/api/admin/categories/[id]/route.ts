import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// PUT: Update Category
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const { name, image_url, parent_category_id } = await req.json();

        const result = await query(
            "UPDATE categories SET name = $1, image_url = $2, parent_category_id = $3 WHERE id = $4 RETURNING *",
            [name, image_url, parent_category_id || null, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
    }
}

// DELETE: Remove Category
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        // Check for products using this category
        const productCheck = await query("SELECT COUNT(*) as count FROM products WHERE category_id = $1", [id]);
        if (parseInt(productCheck.rows[0].count) > 0) {
            return NextResponse.json(
                { error: "Cannot delete: This category has associated products. Please reassign them first." },
                { status: 400 }
            );
        }

        // Check for child categories
        const childrenCheck = await query("SELECT COUNT(*) as count FROM categories WHERE parent_category_id = $1", [id]);
        if (parseInt(childrenCheck.rows[0].count) > 0) {
            return NextResponse.json(
                { error: "Cannot delete: This category has sub-categories." },
                { status: 400 }
            );
        }

        const result = await query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
    }
}
