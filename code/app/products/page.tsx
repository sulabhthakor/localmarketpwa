"use client";

import { useState, Suspense, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Filter, Search, Loader2, ChevronRight, Home } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface SidebarFiltersProps {
    search: string;
    setSearch: (value: string) => void;
    categories: any[];
    categoryParam: string | null;
    handleCategoryClick: (id: number | null) => void;
    priceRange: number[];
    handlePriceChange: (value: number[]) => void;
    applyPriceFilter: () => void;
}

const SidebarFilters = ({
    search,
    setSearch,
    categories,
    categoryParam,
    handleCategoryClick,
    priceRange,
    handlePriceChange,
    applyPriceFilter
}: SidebarFiltersProps) => (
    <div className="space-y-6">
        {/* Categories Section */}
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</h3>
            <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start font-medium text-sm h-9 px-3 transition-all duration-200 ${!categoryParam
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                    onClick={() => handleCategoryClick(null)}
                >
                    All Products
                </Button>
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant="ghost"
                        size="sm"
                        className={`justify-start font-medium text-sm h-9 px-3 transition-all duration-200 ${categoryParam === cat.id.toString()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                        onClick={() => handleCategoryClick(cat.id)}
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60" />

        {/* Price Section */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Range</h3>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </span>
            </div>

            <div className="px-1">
                <Slider
                    defaultValue={[0, 1000]}
                    value={priceRange}
                    max={1000}
                    step={10}
                    onValueChange={handlePriceChange}
                    onValueCommit={applyPriceFilter}
                    className="py-4"
                />
            </div>

            <Button
                onClick={applyPriceFilter}
                size="sm"
                className="w-full h-9 font-medium"
            >
                Apply Price Filter
            </Button>
        </div>
    </div>
);

function ProductListContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search") || "";

    const [search, setSearch] = useState(searchParam);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setLoading(true);
        // Build query string
        const params = new URLSearchParams();
        if (categoryParam) {
            // We need to find the category ID by name/ID. 
            // The API expects ID. The UI currently uses ID from the seed (which matches mock).
            // However, the categories fetched from API have real IDs.
            // Let's assume the UI passes ID.
            params.append('category', categoryParam);
        }
        if (search) params.append('search', search);

        const minPrice = searchParams.get('min_price');
        const maxPrice = searchParams.get('max_price');
        const businessId = searchParams.get('business_id');

        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        if (businessId) params.append('business_id', businessId);

        fetch(`/api/products?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [categoryParam, search, searchParams.get('min_price'), searchParams.get('max_price'), searchParams.get('business_id')]); // Re-fetch when filters change


    const handleCategoryClick = (catId: number | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (catId) {
            params.set("category", catId.toString());
        } else {
            params.delete("category");
        }
        router.push(`/products?${params.toString()}`);
    };

    const [priceRange, setPriceRange] = useState([0, 1000]);

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("min_price", priceRange[0].toString());
        params.set("max_price", priceRange[1].toString());
        router.push(`/products?${params.toString()}`);
    };

    useEffect(() => {
        const min = searchParams.get("min_price");
        const max = searchParams.get("max_price");
        if (min && max) {
            setPriceRange([parseInt(min), parseInt(max)]);
        }
    }, [searchParams.get("min_price"), searchParams.get("max_price")]);

    useEffect(() => {
        console.log("ProductListContent MOUNTED");
        return () => console.log("ProductListContent UNMOUNTED");
    }, []);



    return (
        <div className="container mx-auto px-4 py-6 md:px-6">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <nav className="flex items-center text-sm">
                    <Link
                        href="/"
                        className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        <span className="ml-1.5 hidden sm:inline">Home</span>
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                    <span className="font-medium text-foreground">Products</span>
                </nav>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="md:hidden border-2 rounded-full font-bold">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0 flex flex-col h-full">
                        <SheetHeader className="px-5 pt-5 pb-4 border-b bg-muted/30 shrink-0">
                            <SheetTitle className="text-lg font-bold">Filters</SheetTitle>
                            <SheetDescription className="text-sm">Refine your product search.</SheetDescription>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-5 py-5">
                            <SidebarFilters
                                search={search}
                                setSearch={setSearch}
                                categories={categories}
                                categoryParam={categoryParam}
                                handleCategoryClick={handleCategoryClick}
                                priceRange={priceRange}
                                handlePriceChange={handlePriceChange}
                                applyPriceFilter={applyPriceFilter}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Mobile Search Bar - Always visible on mobile */}
            <div className="md:hidden mb-6">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10 h-12 bg-card border-2 border-border/50 focus-visible:border-primary focus-visible:ring-0 rounded-xl shadow-sm transition-all hover:border-primary/50 w-full text-base"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block">
                    <SidebarFilters
                        search={search}
                        setSearch={setSearch}
                        categories={categories}
                        categoryParam={categoryParam}
                        handleCategoryClick={handleCategoryClick}
                        priceRange={priceRange}
                        handlePriceChange={handlePriceChange}
                        applyPriceFilter={applyPriceFilter}
                    />
                </aside>

                {/* Product Grid */}
                <div className="md:col-span-3">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-lg text-muted-foreground">No products found.</p>
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearch("");
                                    handleCategoryClick(null);
                                }}
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <ProductListContent />
        </Suspense>
    );
}
