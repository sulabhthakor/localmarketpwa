"use client";

import { useState, useRef, useEffect } from "react";
import { UserCircle, Camera, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthUser } from "@/hooks/use-auth-user";
import { toast } from "sonner"; // Assuming sonner is installed or will use basic alert if not
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuthUser();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || "");
            setAddress(user.address || "");
            setImagePreview(user.image || null);
        }
    }, [user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("address", address);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                body: formData,
            });

            if (res.ok) {
                // Determine toast or alert
                // toast.success("Profile updated successfully");
                alert("Profile updated successfully! Reloading...");
                window.location.reload(); // Reload to update auth headers across app
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) return (
        <div className="flex justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );

    if (!user) return <div className="p-10 text-center">Please log in to view this page.</div>;

    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
        : "U";

    return (
        <div className="container mx-auto px-4 py-10 max-w-lg">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
                <p className="text-muted-foreground mt-2">Manage your public profile details.</p>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                                    <AvatarImage src={imagePreview || ""} className="object-cover" />
                                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                Change Picture
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={email} disabled className="bg-muted text-muted-foreground" />
                                <p className="text-[11px] text-muted-foreground">Email cannot be changed.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Delivery Address</Label>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Flat/House No, Area, City"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" size="lg" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
