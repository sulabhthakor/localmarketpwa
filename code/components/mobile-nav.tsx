"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, ShoppingBag, ShoppingCart, LogOut, Settings, LayoutDashboard, ShieldCheck, Phone, HelpCircle, Store, ChevronRight, Briefcase, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { user, loading, logout } = useAuthUser();

    // Main navigation routes
    const mainRoutes = [
        { href: "/", label: "Home", icon: Home, description: "Back to homepage" },
        { href: "/products", label: "Shop Products", icon: ShoppingBag, description: "Browse our catalog" },
        { href: "/cart", label: "My Cart", icon: ShoppingCart, description: "View your cart" },
    ];

    // Support routes
    const supportRoutes = [
        { href: "/contact", label: "Contact Us", icon: Phone, description: "Get in touch" },
        { href: "/faq", label: "FAQ", icon: HelpCircle, description: "Common questions" },
    ];

    // Dashboard routes based on role
    const dashboardRoutes: { href: string; label: string; icon: typeof Home; description: string }[] = [];

    if (user?.role === "business_owner") {
        dashboardRoutes.push({ href: "/business", label: "Seller Dashboard", icon: Briefcase, description: "Manage your business" });
    }

    if (user?.role === "admin" || user?.role === "super_admin") {
        dashboardRoutes.push({ href: "/admin", label: "Admin Dashboard", icon: ShieldCheck, description: "Platform management" });
    }

    const handleLogout = async () => {
        await logout();
        setOpen(false);
    };

    const renderNavItem = (route: { href: string; label: string; icon: typeof Home; description: string }) => {
        const isActive = pathname === route.href;
        return (
            <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-white active:scale-[0.98]"
                )}
            >
                <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                    isActive
                        ? "bg-white/20"
                        : "bg-muted group-hover:bg-primary/10"
                )}>
                    <route.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                    )} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-sm font-medium truncate",
                        isActive ? "text-primary-foreground" : "text-foreground"
                    )}>
                        {route.label}
                    </p>
                    <p className={cn(
                        "text-xs truncate",
                        isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                        {route.description}
                    </p>
                </div>
                <ChevronRight className={cn(
                    "h-4 w-4 transition-transform group-hover:translate-x-0.5",
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground/50"
                )} />
            </Link>
        );
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-transparent -ml-2" suppressHydrationWarning>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 flex flex-col border-r-0">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-orange-600 px-5 pb-6 pt-5">
                    {/* Decorative circles */}
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-4 top-16 h-20 w-20 rounded-full bg-white/5" />

                    <SheetTitle asChild>
                        <Link href="/" onClick={() => setOpen(false)} className="relative flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg">
                                <Store className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                LocalMarket
                            </span>
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="relative mt-2 text-sm text-white/80">
                        Everything your community has to offer.
                    </SheetDescription>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto">
                    {/* User Profile Section */}
                    <div className="px-4 py-4">
                        {loading ? (
                            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        ) : user ? (
                            <div className="rounded-xl bg-gradient-to-r from-muted/60 to-muted/30 p-3 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                                        <AvatarImage src={user.image} alt={user.name} />
                                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                            {user.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        {user.role && user.role !== "user" && (
                                            <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
                                                {user.role.replace("_", " ")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <Button variant="secondary" size="sm" asChild className="h-9 text-xs font-medium">
                                        <Link href="/profile" onClick={() => setOpen(false)}>
                                            <Settings className="mr-1.5 h-3.5 w-3.5" /> Profile
                                        </Link>
                                    </Button>
                                    <Button variant="secondary" size="sm" asChild className="h-9 text-xs font-medium">
                                        <Link href="/orders" onClick={() => setOpen(false)}>
                                            <Package className="mr-1.5 h-3.5 w-3.5" /> Orders
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-4 border border-primary/20">
                                <p className="text-sm font-medium text-foreground">Welcome to LocalMarket</p>
                                <p className="text-xs text-muted-foreground mt-1">Sign in to access your account</p>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <Button variant="outline" size="sm" asChild className="h-9">
                                        <Link href="/login" onClick={() => setOpen(false)}>
                                            Log In
                                        </Link>
                                    </Button>
                                    <Button size="sm" asChild className="h-9">
                                        <Link href="/register" onClick={() => setOpen(false)}>
                                            Sign Up
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Navigation */}
                    <div className="px-4 pb-2">
                        <h4 className="mb-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Navigation
                        </h4>
                        <div className="space-y-1">
                            {mainRoutes.map(renderNavItem)}
                        </div>
                    </div>

                    {/* Dashboard Section (Conditional) */}
                    {dashboardRoutes.length > 0 && (
                        <div className="px-4 py-2">
                            <h4 className="mb-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Dashboard
                            </h4>
                            <div className="space-y-1">
                                {dashboardRoutes.map(renderNavItem)}
                            </div>
                        </div>
                    )}

                    {/* Support Section */}
                    <div className="px-4 py-2 pb-4">
                        <h4 className="mb-2 px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Support
                        </h4>
                        <div className="space-y-1">
                            {supportRoutes.map(renderNavItem)}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {!loading && user && (
                    <div className="border-t bg-muted/30 p-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl h-11 font-medium"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
