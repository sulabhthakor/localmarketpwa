import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react";
import pool from "@/lib/db";
import { formatPrice } from "@/lib/utils";

async function getRevenueData(userId: number) {
    const client = await pool.connect();
    try {
        const businessRes = await client.query(`SELECT id, name FROM businesses WHERE owner_id = $1`, [userId]);
        if (businessRes.rows.length === 0) return null;
        const business = businessRes.rows[0];

        // Fetch detailed revenue transactions (completed orders)
        const revenueRes = await client.query(`
            SELECT 
                o.id,
                o.created_at,
                u.name as customer_name,
                SUM(oi.price * oi.quantity) as amount
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN users u ON o.user_id = u.id
            WHERE p.business_id = $1 AND o.status = 'completed'
            GROUP BY o.id, o.created_at, u.name
            ORDER BY o.created_at DESC
        `, [business.id]);

        // Calculate total
        const totalRevenue = revenueRes.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

        return {
            business,
            transactions: revenueRes.rows,
            totalRevenue
        };
    } finally {
        client.release();
    }
}

export default async function RevenuePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) redirect("/login");

    const user: any = verifyToken(token);
    if (!user || user.role !== "business_owner") redirect("/");

    const data = await getRevenueData(user.id);

    if (!data) redirect("/business");

    const { business, transactions, totalRevenue } = data;

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/business">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider">Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary rounded-full text-primary-foreground">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold">{formatPrice(totalRevenue)}</div>
                                <p className="text-sm text-muted-foreground">Lifetime revenue from completed orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">+0%</div>
                                <p className="text-sm text-muted-foreground">vs last month (Not enough data)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold">Transaction History</h2>
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        {transactions.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                No completed transactions yet.
                            </div>
                        ) : (
                            <div className="w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="bg-muted/30 [&_tr]:border-b">
                                        <tr className="border-b">
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                                            <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Customer</th>
                                            <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0 bg-card">
                                        {transactions.map((tx: any) => (
                                            <tr key={tx.id} className="border-b transition-colors hover:bg-muted/40">
                                                <td className="p-6 align-middle">
                                                    {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(tx.created_at))}
                                                </td>
                                                <td className="p-6 align-middle font-medium">#{tx.id}</td>
                                                <td className="p-6 align-middle">{tx.customer_name}</td>
                                                <td className="p-6 align-middle text-right font-mono font-medium text-green-600">
                                                    +{formatPrice(tx.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
