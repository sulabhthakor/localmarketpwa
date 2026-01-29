"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Key, Loader2, ShieldAlert, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuthUser } from "@/hooks/use-auth-user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type User = {
    id: number;
    name: string;
    email: string;
    role: "buyer" | "business_owner" | "admin" | "super_admin";
    created_at: string;
};

export default function AdminUsersPage() {
    const { user: currentUser } = useAuthUser();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState<string>("");
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Password Reset State
    const [resettingUser, setResettingUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [isResetOpen, setIsResetOpen] = useState(false);

    // Process State
    const [processing, setProcessing] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            toast.error("Error fetching users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openEdit = (user: User) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditRole(user.role);
        setIsEditOpen(true);
    };

    const handleSaveUser = async () => {
        if (!editingUser) return;
        setProcessing(true);
        try {
            const res = await fetch(`/api/admin/users/${editingUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, email: editEmail, role: editRole }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update user");

            toast.success("User updated successfully");
            setIsEditOpen(false);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setProcessing(false);
        }
    };

    const openReset = (user: User) => {
        setResettingUser(user);
        setNewPassword("");
        setIsResetOpen(true);
    };

    const handleResetPassword = async () => {
        if (!resettingUser) return;
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setProcessing(true);
        try {
            const res = await fetch(`/api/admin/users/${resettingUser.id}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to reset password");

            toast.success("Password reset successfully");
            setIsResetOpen(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex h-[50vh] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

    return (
        <div className="container py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage accounts, roles, and system access.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[300px]">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9"
                            onChange={(e) => {
                                const term = e.target.value.toLowerCase();
                                const rows = document.querySelectorAll('.user-row');
                                rows.forEach(row => {
                                    const text = row.textContent?.toLowerCase() || "";
                                    (row as HTMLElement).style.display = text.includes(term) ? "" : "none";
                                });
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block border rounded-lg bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30 [&_tr]:border-b">
                        <TableRow>
                            <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs w-[80px]">ID</TableHead>
                            <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">User</TableHead>
                            <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Role</TableHead>
                            <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Email</TableHead>
                            <TableHead className="h-12 px-6 text-left align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Joined</TableHead>
                            <TableHead className="h-12 px-6 text-right align-middle font-medium text-muted-foreground uppercase tracking-wider text-xs">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&_tr:last-child]:border-0 bg-card">
                        {users.map((user) => (
                            <TableRow key={user.id} className="user-row border-b transition-colors hover:bg-muted/40">
                                <TableCell className="p-6 font-mono text-xs text-muted-foreground">#{user.id}</TableCell>
                                <TableCell className="p-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarFallback className={cn(
                                                "text-xs font-semibold",
                                                user.role === 'admin' ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                                            )}>
                                                {user.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium text-sm">{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-6">
                                    <Badge variant="outline" className={cn(
                                        "font-normal capitalize px-2.5 py-0.5",
                                        user.role === 'super_admin' && "border-red-200 bg-red-50 text-red-700",
                                        user.role === 'admin' && "border-blue-200 bg-blue-50 text-blue-700",
                                        user.role === 'business_owner' && "border-orange-200 bg-orange-50 text-orange-700",
                                        user.role === 'buyer' && "border-slate-200 bg-slate-50 text-slate-700"
                                    )}>
                                        {user.role.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="p-6 text-sm text-muted-foreground">{user.email}</TableCell>
                                <TableCell className="p-6 text-sm text-muted-foreground">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="p-6 text-right space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(user)} className="h-8 w-8 p-0">
                                        <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openReset(user)} className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
                                        <Key className="h-4 w-4" />
                                        <span className="sr-only">Reset Password</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {users.map((user) => (
                    <div key={user.id} className="user-row bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarFallback className={cn(
                                        "font-medium",
                                        user.role === 'admin' ? "bg-primary/10 text-primary" : "bg-muted"
                                    )}>
                                        {user.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm">{user.name}</h3>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(user)} className="h-8 w-8 -mr-2 -mt-1">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className={cn(
                                "capitalize text-[10px] px-2 py-0.5 h-6",
                                user.role === 'super_admin' && "border-red-200 bg-red-50 text-red-700",
                                user.role === 'admin' && "border-blue-200 bg-blue-50 text-blue-700",
                                user.role === 'business_owner' && "border-orange-200 bg-orange-50 text-orange-700",
                                user.role === 'buyer' && "border-slate-200 bg-slate-50 text-slate-700"
                            )}>
                                {user.role.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                            <Button variant="outline" size="sm" className="w-full text-xs h-9" onClick={() => openEdit(user)}>
                                Edit Details
                            </Button>
                            <Button variant="outline" size="sm" className="w-full text-xs h-9 border-destructive/20 text-destructive hover:text-destructive hover:bg-destructive/5" onClick={() => openReset(user)}>
                                <Key className="mr-2 h-3.5 w-3.5" />
                                Reset Password
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to account details for <span className="font-medium text-foreground">#{editingUser?.id}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role Permission</Label>
                            <Select value={editRole} onValueChange={setEditRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="buyer">Buyer</SelectItem>
                                    <SelectItem value="business_owner">Business Owner</SelectItem>
                                    {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                                        <SelectItem value="admin">Admin</SelectItem>
                                    )}
                                    {currentUser?.role === 'super_admin' && (
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveUser} disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5" />
                            Reset Password
                        </DialogTitle>
                        <DialogDescription>
                            This will manually override the password for <span className="font-semibold text-foreground">{resettingUser?.name}</span>.
                            This action is immediate.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">New Temporary Password</Label>
                            <Input
                                id="new-password"
                                type="text"
                                className="font-mono text-center tracking-wider bg-muted/50"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter characters..."
                            />
                            <p className="text-xs text-muted-foreground">Type a secure temporary password. Copy it before saving.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleResetPassword} disabled={processing || newPassword.length < 6}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
