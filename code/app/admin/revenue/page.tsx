"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, DollarSign, TrendingUp, Calendar, ArrowLeft, Download, CreditCard } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn, formatPrice } from "@/lib/utils";

export default function RevenuePage() {
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/orders")
            ]);

            if (statsRes.ok && ordersRes.ok) {
                const statsData = await statsRes.json();
                const ordersData = await ordersRes.json();
                setStats(statsData);
                setOrders(ordersData);
            } else {
                toast.error("Failed to load revenue data");
            }
        } catch (error) {
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

    // Calculate additional metrics locally
    const totalTransactions = orders.length;
    const averageOrderValue = totalTransactions > 0 ? (stats?.totalRevenue / totalTransactions) : 0;
    const today = new Date().toISOString().split('T')[0];
    const todaysRevenue = orders
        .filter(o => o.created_at.startsWith(today))
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

    return (
        <div className="container py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Revenue & Financials</h1>
                    <p className="text-muted-foreground mt-1">Detailed overview of income, transactions, and trends.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Accumulated earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(todaysRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Processed today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTransactions}</div>
                        <p className="text-xs text-muted-foreground mt-1">Completed orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Income over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.revenueChart || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                            />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <RechartsTooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: any) => [formatPrice(value), "Revenue"]}
                                labelFormatter={(label) => new Date(label).toDateString()}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recent Transactions Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest financial activities from orders.</CardDescription>
                    </div>
                    {/* <Button variant="outline" size="sm" className="hidden md:flex">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button> */}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.slice(0, 10).map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">#{order.id}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</TableCell>
                                    <TableCell>{order.customer_name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "capitalize font-normal text-xs",
                                            order.status === 'completed' && "bg-green-50 text-green-700 border-green-200",
                                            order.status === 'pending' && "bg-yellow-50 text-yellow-700 border-yellow-200",
                                            order.status === 'cancelled' && "bg-red-50 text-red-700 border-red-200"
                                        )}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{formatPrice(order.total_amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
