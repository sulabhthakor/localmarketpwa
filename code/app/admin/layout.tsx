"use client";

import { useAuthUser } from "@/hooks/use-auth-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuthUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
                router.push("/");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col">
            {children}
        </div>
    );
}
