"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShieldCheck, Activity, Package, Store, Loader2 } from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from "sonner";

export default function AdminDashboard() {
    const { user } = useAuthUser();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    toast.error("Failed to load dashboard data");
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
                toast.error("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user?.name} ({user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}).
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Admin Mode Active</span>
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/admin/revenue">
                    <Card className="hover:bg-accent/5 transition-colors cursor-pointer border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/users">
                    <Card className="hover:bg-accent/5 transition-colors cursor-pointer border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/sellers">
                    <Card className="hover:bg-accent/5 transition-colors cursor-pointer border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.activeSellers}</div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/products">
                    <Card className="hover:bg-accent/5 transition-colors cursor-pointer border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.activeProducts}</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.revenueChart || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <RechartsTooltip
                                    formatter={(value: any) => [`₹${value}`, "Revenue"]}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Growth (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.userGrowth || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <RechartsTooltip
                                    formatter={(value: any) => [value, "New Users"]}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats?.recentActivity?.map((activity: any, i: number) => (
                            <div key={i} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                                <div className={`p-2 rounded-full mr-4 ${activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                                    activity.type === 'product' ? 'bg-purple-100 text-purple-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                    <Activity className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(activity.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-auto text-xs font-medium uppercase text-muted-foreground">
                                    {activity.type}
                                </div>
                            </div>
                        ))}
                        {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                            <p className="text-muted-foreground text-sm">No recent activity found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
