import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
    try {
        const [
            revenueRes,
            usersRes,
            sellersRes,
            productsRes,
            recentUsersRes,
            recentProductsRes,
            recentOrdersRes,
            revenueChartRes,
            userGrowthRes
        ] = await Promise.all([
            query("SELECT SUM(total_amount) as total FROM orders"),
            query("SELECT COUNT(*) as count FROM users"),
            query("SELECT COUNT(*) as count FROM businesses"),
            query("SELECT COUNT(*) as count FROM products"),
            query("SELECT name, created_at FROM users ORDER BY created_at DESC LIMIT 5"),
            query("SELECT name, created_at FROM products ORDER BY created_at DESC LIMIT 5"),
            query("SELECT id, total_amount, created_at FROM orders ORDER BY created_at DESC LIMIT 5"),
            query(`
                SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, SUM(total_amount) as amount 
                FROM orders 
                WHERE created_at > NOW() - INTERVAL '30 days' 
                GROUP BY date 
                ORDER BY date
            `),
            query(`
                SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count 
                FROM users 
                WHERE created_at > NOW() - INTERVAL '30 days' 
                GROUP BY date 
                ORDER BY date
            `)
        ]);

        const totalRevenue = parseFloat(revenueRes.rows[0]?.total || "0");
        const totalUsers = parseInt(usersRes.rows[0]?.count || "0");
        const activeSellers = parseInt(sellersRes.rows[0]?.count || "0");
        const activeProducts = parseInt(productsRes.rows[0]?.count || "0");

        // Format recent activity
        const recentActivity = [
            ...recentUsersRes.rows.map(u => ({ type: "user", message: `New user joined: ${u.name}`, date: u.created_at })),
            ...recentProductsRes.rows.map(p => ({ type: "product", message: `New product added: ${p.name}`, date: p.created_at })),
            ...recentOrdersRes.rows.map(o => ({ type: "order", message: `New order #${o.id} for ₹${o.total_amount}`, date: o.created_at }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

        return NextResponse.json({
            totalRevenue,
            totalUsers,
            activeSellers,
            activeProducts,
            recentActivity,
            revenueChart: revenueChartRes.rows,
            userGrowth: userGrowthRes.rows
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
