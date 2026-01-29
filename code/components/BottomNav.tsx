"use client";

import {
    Home,
    ShoppingBag,
    ShoppingCart,
    Package,
    User,
    LayoutDashboard,
    Users,
    Store,
    DollarSign,
    Settings,
    MoreHorizontal,
    Grid3X3,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useAuthUser } from "@/hooks/use-auth-user";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    hasBadge?: boolean;
    requiresAuth?: boolean;
    isMenu?: boolean;
}

// Default navigation (main app routes)
const defaultNavItems: NavItem[] = [
    { icon: Home, label: "Home", href: "/" },
    { icon: ShoppingBag, label: "Products", href: "/products" },
    { icon: ShoppingCart, label: "Cart", href: "/cart", hasBadge: true },
    { icon: Package, label: "Orders", href: "/orders", requiresAuth: true },
    { icon: User, label: "Profile", href: "/profile", requiresAuth: true },
];

// Admin dashboard navigation
const adminNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Store, label: "Sellers", href: "/admin/sellers" },
    { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: MoreHorizontal, label: "More", href: "#more", isMenu: true },
];

// Admin overflow menu items
const adminMoreItems = [
    { icon: Grid3X3, label: "Categories", href: "/admin/categories" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: DollarSign, label: "Revenue", href: "/admin/revenue" },
];

// Seller dashboard navigation
const businessNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/business" },
    { icon: Package, label: "Products", href: "/business/products" },
    { icon: ShoppingBag, label: "Orders", href: "/business/orders" },
    { icon: DollarSign, label: "Revenue", href: "/business/revenue" },
    { icon: Settings, label: "Settings", href: "/business/settings" },
];

function CartBadge() {
    const cart = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    if (count === 0) return null;

    return (
        <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[9px] font-bold min-w-[16px]"
        >
            {count > 99 ? "99+" : count}
        </Badge>
    );
}

function AdminMoreMenu({ isActive }: { isActive: boolean }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const isMoreActive = adminMoreItems.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 relative transition-all duration-200 ease-out",
                        "active:scale-95",
                        isMoreActive
                            ? "text-blue-500"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <div className="relative">
                        <MoreHorizontal
                            className={cn(
                                "h-5 w-5 transition-all duration-200",
                                isMoreActive && "drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                            )}
                        />
                    </div>
                    <span
                        className={cn(
                            "text-[10px] font-medium transition-all duration-200",
                            isMoreActive && "font-semibold"
                        )}
                    >
                        More
                    </span>
                    {isMoreActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                    )}
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-8">
                <SheetHeader className="pb-4">
                    <SheetTitle>More Options</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-3 gap-4">
                    {adminMoreItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl transition-all",
                                    active
                                        ? "bg-blue-50 text-blue-600"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-full",
                                    active ? "bg-blue-100" : "bg-muted"
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
                <div className="mt-6 pt-4 border-t">
                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Exit Admin</span>
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export function BottomNav() {
    const pathname = usePathname();
    const { user, loading } = useAuthUser();

    // Route context detection
    const isAdminRoute = pathname.startsWith("/admin");
    const isBusinessRoute = pathname.startsWith("/business");

    // Select navigation items based on context
    const navItems = isAdminRoute
        ? adminNavItems
        : isBusinessRoute
            ? businessNavItems
            : defaultNavItems;

    // Get accent color class based on context
    const getAccentColor = () => {
        if (isAdminRoute) return "text-blue-500";
        if (isBusinessRoute) return "text-emerald-500";
        return "text-primary";
    };

    const getGlowStyle = () => {
        if (isAdminRoute) return "drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]";
        if (isBusinessRoute) return "drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]";
        return "drop-shadow-[0_0_6px_rgba(254,51,10,0.5)]";
    };

    const getDotColor = () => {
        if (isAdminRoute) return "bg-blue-500";
        if (isBusinessRoute) return "bg-emerald-500";
        return "bg-primary";
    };

    // Check if current route matches
    const isActive = (href: string) => {
        if (href === "/" || href === "/admin" || href === "/business") {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(href + "/");
    };

    // Get the actual href based on auth state
    const getHref = (item: NavItem) => {
        if (item.requiresAuth && !user && !loading) {
            return "/login";
        }
        return item.href;
    };

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 bottom-nav-safe"
            suppressHydrationWarning
        >
            <div className="flex items-center justify-around h-16 px-2" suppressHydrationWarning>
                {navItems.map((item) => {
                    // Handle More menu for Admin
                    if (item.isMenu && isAdminRoute) {
                        return <AdminMoreMenu key={item.href} isActive={false} />;
                    }

                    const href = getHref(item);
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 relative transition-all duration-200 ease-out",
                                "active:scale-95",
                                active
                                    ? getAccentColor()
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="relative">
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-all duration-200",
                                        active && getGlowStyle()
                                    )}
                                />
                                {item.hasBadge && <CartBadge />}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-medium transition-all duration-200",
                                    active && "font-semibold"
                                )}
                            >
                                {item.label}
                            </span>
                            {active && (
                                <span className={cn(
                                    "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                                    getDotColor()
                                )} />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
