"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, ShoppingBag, ShoppingCart, User, UserPlus, Briefcase, LogOut, Settings, LayoutDashboard } from "lucide-react";
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

    // Base routes available to everyone
    const routes = [
        { href: "/", label: "Home", icon: Home },
        { href: "/products", label: "Shop Products", icon: ShoppingBag },
    ];

    // Business routes (only if business owner)
    if (user?.role === "business_owner") {
        routes.push({ href: "/business", label: "Business Dashboard", icon: Briefcase });
    }

    // Admin routes
    if (user?.role === "admin" || user?.role === "super_admin") {
        routes.push({ href: "/admin", label: "Admin Dashboard", icon: ShieldCheck });
    }

    // Cart is always relevant
    routes.push({ href: "/cart", label: "Cart", icon: ShoppingCart });

    const handleLogout = async () => {
        await logout();
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-transparent -ml-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 flex flex-col">
                <div className="p-6 border-b bg-muted/20">
                    <SheetTitle asChild>
                        <Link href="/" onClick={() => setOpen(false)} className="flex items-center space-x-2">
                            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                LocalMarket
                            </span>
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="mt-1 text-xs">
                        Everything your community has to offer.
                    </SheetDescription>
                </div>

                <div className="flex-1 overflow-auto py-4 px-4">
                    {/* User Profile Section (Mobile) */}
                    {loading ? (
                        <div className="flex items-center space-x-4 mb-6 px-2">
                            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                            </div>
                        </div>
                    ) : user ? (
                        <div className="mb-6 px-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <Avatar>
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" asChild className="w-full justify-start mb-2">
                                <Link href="/profile" onClick={() => setOpen(false)}>
                                    <Settings className="mr-2 h-4 w-4" /> Edit Profile
                                </Link>
                            </Button>
                            {user.role === "business_owner" && (
                                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                                    <Link href="/business/settings" onClick={() => setOpen(false)}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Business Settings
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : null}

                    <div className="flex flex-col space-y-1">
                        <h4 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Menu
                        </h4>
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                    pathname === route.href ? "bg-accent/50 text-accent-foreground font-semibold" : "text-muted-foreground"
                                )}
                            >
                                <route.icon className="h-4 w-4" />
                                <span>{route.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t bg-muted/20">
                    {!loading && user ? (
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" asChild>
                                <Link href="/login" onClick={() => setOpen(false)}>
                                    Log In
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register" onClick={() => setOpen(false)}>
                                    Sign Up
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
