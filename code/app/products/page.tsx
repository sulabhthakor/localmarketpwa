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
import { Filter, Search, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
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
    <div className="space-y-8">
        <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Search</h3>
            <div className="space-y-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10 h-11 bg-card border-2 border-border/50 focus-visible:border-primary focus-visible:ring-0 rounded-xl shadow-sm transition-all hover:border-primary/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Categories</h3>
            <div className="flex flex-col space-y-1">
                <Button
                    variant="ghost"
                    className={`justify-start font-medium transition-all duration-200 ${!categoryParam
                        ? "bg-primary text-primary-foreground hover:bg-white hover:text-primary hover:border hover:border-primary shadow-md"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                        }`}
                    onClick={() => handleCategoryClick(null)}
                >
                    All Products
                </Button>
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant="ghost"
                        className={`justify-start font-medium transition-all duration-200 ${categoryParam === cat.id.toString()
                            ? "bg-primary text-primary-foreground hover:bg-white hover:text-primary hover:border hover:border-primary shadow-md"
                            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                            }`}
                        onClick={() => handleCategoryClick(cat.id)}
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Price Limit</h3>
                <span className="text-xs font-medium text-muted-foreground">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </span>
            </div>

            <div className="px-2">
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

        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);

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
    }, [categoryParam, search, searchParams.toString()]); // Re-fetch when filters change


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
    }, [searchParams]);



    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            {/* Header / Backdrop */}
            {/* Header / Backdrop */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        Local <span className="text-primary">Marketplace</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
                        Explore our curated collection of authentic goods from Gujarat's best sellers.
                    </p>
                    <div className="h-1.5 w-24 bg-primary rounded-full mt-4 opacity-90" />
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="md:hidden border-2 rounded-full font-bold">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                            <SheetDescription>Refine your product search.</SheetDescription>
                        </SheetHeader>
                        <div className="py-6">
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
