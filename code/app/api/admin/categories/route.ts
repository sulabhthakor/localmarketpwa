import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
    try {
        const result = await query("SELECT * FROM categories ORDER BY id ASC");
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, image_url, parent_category_id } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const result = await query(
            "INSERT INTO categories (name, image_url, parent_category_id) VALUES ($1, $2, $3) RETURNING *",
            [name, image_url, parent_category_id || null]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error: any) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
    }
}
