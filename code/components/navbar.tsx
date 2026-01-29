"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User, Store, ShoppingBag, Briefcase, LayoutDashboard, ShieldCheck } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";

import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserCircle, Settings } from "lucide-react";

function UserMenu() {
    const { user, loading, logout } = useAuthUser();

    if (loading) return (
        <Button variant="ghost" size="icon" className="hover:bg-white rounded-full">
            <User className="h-5 w-5 opacity-50" />
        </Button>
    );

    if (!user) {
        return (
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white hover:text-primary transition-colors">
                <Link href="/login">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                </Link>
            </Button>
        );
    }

    const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="group relative h-8 w-8 rounded-full hover:bg-white hover:text-primary transition-colors" suppressHydrationWarning>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="group-hover:bg-[#fe330a] group-hover:text-white transition-colors">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                    <Link href="/orders">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        My Orders
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                    <Link href="/profile">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Link>
                </DropdownMenuItem>
                {(user.role === 'admin' || user.role === 'super_admin') && (
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                        <Link href="/admin">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Admin Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                {user.role === 'business_owner' && (
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                        <Link href="/business">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Seller Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                {user.role === 'business_owner' && (
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                        <Link href="/business/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Business Settings
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function CountBadge() {
    const cart = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (cart.items.length === 0) return null;

    return (
        <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
        >
            {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
        </Badge>
    );
}

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border/40 transition-all duration-300">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12 relative">

                {/* Left: Mobile Nav (Mobile) / Logo (Desktop) */}
                <div className="flex items-center gap-3 lg:gap-4 md:min-w-fit flex-1 md:flex-none">
                    <MobileNav />

                    {/* Desktop Logo */}
                    <Link href="/" className="hidden md:flex items-center space-x-2.5 transition-transform hover:scale-[1.02] active:scale-95 duration-200">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                            <Store className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            LocalMarket
                        </span>
                    </Link>
                </div>

                {/* Center: Logo (Mobile Only) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                            <Store className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">LM</span>
                    </Link>
                </div>

                {/* Center: Nav & Search (Desktop Only) */}
                <div className="hidden md:flex flex-1 items-center justify-center gap-6 xl:gap-10 mx-6">
                    <nav className="flex items-center gap-1">
                        {[
                            { href: "/products", label: "Shop" },
                            { href: "/contact", label: "Contact" },
                            { href: "/faq", label: "FAQ" },
                        ].map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Button
                                    key={link.href}
                                    variant="ghost"
                                    asChild
                                    size="sm"
                                    className={cn(
                                        "rounded-full px-4 h-9 font-medium text-sm transition-all duration-200",
                                        "hover:bg-white hover:text-primary",
                                        isActive
                                            ? "bg-primary text-primary-foreground hover:bg-white hover:text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    <Link href={link.href}>{link.label}</Link>
                                </Button>
                            );
                        })}
                    </nav>

                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full bg-secondary/50 pl-10 h-10 rounded-full border-none shadow-sm ring-offset-0 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-300 ease-out hover:bg-secondary/70"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    const query = e.currentTarget.value;
                                    if (query) {
                                        window.location.href = `/products?search=${encodeURIComponent(query)}`;
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1 md:flex-none md:min-w-fit">
                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>

                    <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />

                    <Button variant="ghost" size="icon" asChild className="relative rounded-full h-10 w-10 transition-all hover:bg-white hover:text-primary">
                        <Link href="/cart">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Cart</span>
                            <CountBadge />
                        </Link>
                    </Button>

                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
