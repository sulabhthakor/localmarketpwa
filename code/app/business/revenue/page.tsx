import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, IndianRupee, TrendingUp, Receipt, Calendar, User } from "lucide-react";
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
        <div className="container mx-auto py-6 px-4 md:py-10 md:px-8 space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="shrink-0">
                    <Link href="/business">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Revenue</h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">Track your earnings and transactions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                                <IndianRupee className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Total Earnings</p>
                                <div className="text-2xl md:text-3xl font-extrabold truncate">{formatPrice(totalRevenue)}</div>
                                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">Lifetime completed orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                                <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Growth</p>
                                <div className="text-2xl md:text-3xl font-bold">+0%</div>
                                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">vs last month</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                        Transactions
                    </h2>
                    <span className="text-sm text-muted-foreground">{transactions.length} total</span>
                </div>

                {transactions.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 md:p-12 text-center text-muted-foreground">
                            <Receipt className="h-10 w-10 mx-auto mb-3 opacity-50" />
                            <p>No completed transactions yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Mobile View: Cards */}
                        <div className="md:hidden space-y-3">
                            {transactions.map((tx: any) => (
                                <Card key={tx.id} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">#{tx.id}</span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(tx.created_at))}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                    <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#efeae3' }}>
                                                        <span className="text-xs font-medium">{tx.customer_name.charAt(0)}</span>
                                                    </div>
                                                    <span className="truncate">{tx.customer_name}</span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="font-bold text-green-600 tabular-nums">
                                                    +{formatPrice(tx.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden md:block">
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="bg-muted/30 [&_tr]:border-b">
                                                <tr className="border-b">
                                                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Date</th>
                                                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Order ID</th>
                                                    <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Customer</th>
                                                    <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0 bg-card">
                                                {transactions.map((tx: any) => (
                                                    <tr key={tx.id} className="border-b transition-colors hover:bg-muted/40">
                                                        <td className="p-4 align-middle text-muted-foreground">
                                                            {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(tx.created_at))}
                                                        </td>
                                                        <td className="p-4 align-middle font-medium">#{tx.id}</td>
                                                        <td className="p-4 align-middle">{tx.customer_name}</td>
                                                        <td className="p-4 align-middle text-right font-mono font-semibold text-green-600">
                                                            +{formatPrice(tx.amount)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

