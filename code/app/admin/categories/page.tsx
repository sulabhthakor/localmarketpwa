"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Trash2, Edit, Plus, FolderTree } from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: "", image_url: "", parent_category_id: "null" });

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            toast.error("Error fetching categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!formData.name) return toast.error("Category name is required");
        setProcessing(true);

        const payload = {
            ...formData,
            parent_category_id: formData.parent_category_id === "null" ? null : parseInt(formData.parent_category_id)
        };

        try {
            const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? "Category updated" : "Category created");
                fetchCategories();
                setIsDialogOpen(false);
                resetForm();
            } else {
                const data = await res.json();
                toast.error(data.error || "Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Category deleted");
                fetchCategories();
            } else {
                const data = await res.json();
                toast.error(data.error || "Delete failed");
            }
        } catch (error) {
            toast.error("Error deleting category");
        }
    };

    const openCreate = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEdit = (cat: any) => {
        setEditingId(cat.id);
        setFormData({
            name: cat.name,
            image_url: cat.image_url || "",
            parent_category_id: cat.parent_category_id ? String(cat.parent_category_id) : "null"
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ name: "", image_url: "", parent_category_id: "null" });
    };

    const getParentName = (parentId: number) => {
        if (!parentId) return null;
        return categories.find(c => c.id === parentId)?.name || "Unknown";
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container py-10 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
                    <p className="text-muted-foreground mt-1">Organize products into categories.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin">Back to Dashboard</Link>
                    </Button>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Parent Category</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell>
                                    {cat.image_url ? (
                                        <img src={cat.image_url} alt="" className="h-8 w-8 rounded object-cover bg-muted" />
                                    ) : (
                                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                            <FolderTree className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell>
                                    {cat.parent_category_id ? (
                                        <Badge variant="secondary">{getParentName(cat.parent_category_id)}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-xs italic">Top Level</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-xs font-mono text-muted-foreground">{cat.id}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="icon" variant="ghost" onClick={() => openEdit(cat)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(cat.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
                        <DialogDescription>
                            Configure category details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Category Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Electronics"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Image URL (Optional)</Label>
                            <Input
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Parent Category (Optional)</Label>
                            <Select
                                value={formData.parent_category_id}
                                onValueChange={(val) => setFormData({ ...formData, parent_category_id: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">None (Top Level)</SelectItem>
                                    {categories.filter(c => c.id !== editingId).map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
