"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Package, MoreHorizontal, CheckCircle, Ban, Store } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SellersPage() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSellers = async () => {
        try {
            const res = await fetch("/api/admin/sellers");
            if (res.ok) {
                const data = await res.json();
                setSellers(data);
            }
        } catch (error) {
            toast.error("Error fetching sellers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const filteredSellers = sellers.filter((seller) =>
        seller.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/admin/sellers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success(`Seller status updated to ${status}`);
                fetchSellers();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    if (loading) return <div className="flex h-[50vh] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

    return (
        <div className="container py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sellers Management</h1>
                    <p className="text-muted-foreground mt-1">Manage registered businesses and their statuses.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[300px]">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search businesses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {filteredSellers.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <Store className="h-12 w-12 opacity-50 mb-4" />
                        <p className="text-lg font-medium mb-4">No sellers found.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <Card className="hidden md:block overflow-hidden border shadow-sm p-0">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30 [&_tr]:border-b">
                                    <TableRow>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs w-[80px]">ID</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Business</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Owner</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Status</TableHead>
                                        <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Joined</TableHead>
                                        <TableHead className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="[&_tr:last-child]:border-0 bg-card">
                                    {filteredSellers.map((seller) => (
                                        <TableRow key={seller.id} className="border-b transition-colors hover:bg-muted/40">
                                            <TableCell className="p-6 font-mono text-xs text-muted-foreground">#{seller.id}</TableCell>
                                            <TableCell className="p-6">
                                                <div className="font-medium">{seller.business_name}</div>
                                                <div className="text-xs text-muted-foreground">{seller.address || "No address provided"}</div>
                                            </TableCell>
                                            <TableCell className="p-6">
                                                <div className="font-medium">{seller.owner_name}</div>
                                                <div className="text-xs text-muted-foreground">{seller.owner_email}</div>
                                            </TableCell>
                                            <TableCell className="p-6">
                                                <Badge variant="outline" className={cn(
                                                    "font-normal capitalize px-2.5 py-0.5",
                                                    seller.subscription_status === 'active' ? "bg-green-50 text-green-700 border-green-200" :
                                                        seller.subscription_status === 'suspended' ? "bg-red-50 text-red-700 border-red-200" :
                                                            "bg-secondary text-secondary-foreground"
                                                )}>
                                                    {seller.subscription_status || 'Unknown'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-6 text-sm text-muted-foreground">
                                                {new Date(seller.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="p-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        {seller.subscription_status !== 'active' && (
                                                            <DropdownMenuItem onClick={() => updateStatus(seller.id, 'active')} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                                                                <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                                            </DropdownMenuItem>
                                                        )}
                                                        {seller.subscription_status !== 'suspended' && (
                                                            <DropdownMenuItem onClick={() => updateStatus(seller.id, 'suspended')} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                                                <Ban className="mr-2 h-4 w-4" /> Suspend
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredSellers.map((seller) => (
                            <Card key={seller.id} className="overflow-hidden p-0">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-base">{seller.business_name}</h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px] px-2 py-0.5 h-5 font-normal",
                                                    seller.subscription_status === 'active' ? "bg-green-50 text-green-700 border-green-200" :
                                                        seller.subscription_status === 'suspended' ? "bg-red-50 text-red-700 border-red-200" :
                                                            "bg-secondary text-secondary-foreground"
                                                )}>
                                                    {seller.subscription_status || 'Unknown'}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground px-1">•</span>
                                                <span className="text-xs text-muted-foreground">Joined {new Date(seller.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1 text-muted-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Manage Seller</DropdownMenuLabel>
                                                {seller.subscription_status !== 'active' && (
                                                    <DropdownMenuItem onClick={() => updateStatus(seller.id, 'active')} className="text-green-600">
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                                    </DropdownMenuItem>
                                                )}
                                                {seller.subscription_status !== 'suspended' && (
                                                    <DropdownMenuItem onClick={() => updateStatus(seller.id, 'suspended')} className="text-red-600">
                                                        <Ban className="mr-2 h-4 w-4" /> Suspend
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t text-sm">
                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">Owner Details</p>
                                            <p className="font-medium">{seller.owner_name}</p>
                                            <p className="text-muted-foreground truncate">{seller.owner_email}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs mb-1">Location</p>
                                            <p className="text-foreground truncate">{seller.address || "No address provided"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
