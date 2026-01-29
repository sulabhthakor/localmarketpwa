"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";

// Types
interface Category {
  id: number;
  name: string;
  image_url: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Changed to number
  image_url: string;
  image?: string;
  stock: number;
  category: string;
  business_id: number;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products?limit=8") // Assuming API supports limit, or just slice it
        ]);

        if (catRes.ok) {
          const data = await catRes.json();
          console.log("Categories fetched:", data);
          setCategories(Array.isArray(data) ? data : []);
        } else {
          console.error("Categories fetch failed", catRes.status);
        }
        if (prodRes.ok) {
          const data = await prodRes.json();
          const mappedProducts = Array.isArray(data) ? data.slice(0, 8).map((p: any) => ({
            ...p,
            price: parseFloat(p.price), // Ensure number
            stock: p.stock || 0
          })) : [];
          setFeaturedProducts(mappedProducts);
        }
      } catch (e) {
        console.error("Failed to fetch home data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Featured Sellers (Static for curated feel)
  const sellers = [
    { id: 7, name: "Amul Parlour", image: "https://tse2.mm.bing.net/th?q=Amul+Store+India&w=500&h=300&c=7", rating: 4.8, type: "Dairy" },
    { id: 6, name: "Mohan Sweets", image: "https://tse2.mm.bing.net/th?q=Indian+Sweets+Shop&w=500&h=300&c=7", rating: 4.9, type: "Sweets" },
    { id: 5, name: "Raju Vegetables", image: "https://tse2.mm.bing.net/th?q=Vegetable+Vendor+India&w=500&h=300&c=7", rating: 4.7, type: "Vegetables" },
    { id: 8, name: "Vijay General", image: "https://tse2.mm.bing.net/th?q=Indian+Kirana+Store&w=500&h=300&c=7", rating: 4.5, type: "Grocery" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative min-h-[75dvh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-background py-0">
        {/* Background with Theme Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.jpg"
            alt="Gujarat Market"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background z-10" />
        </div>

        <div className="container relative z-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6 md:space-y-8"
          >
            <Badge variant="outline" className="px-4 py-1.5 text-sm bg-card/50 text-foreground border-border backdrop-blur-md shadow-sm">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              Live in Gujarat
            </Badge>

            <h1 className="text-4xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1]">
              Local Shopping, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground/70">
                Delivered to You.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Support your favorite local sellers. Order fresh vegetables, dairy, sweets, and groceries directly from shops near you.
            </p>

            <div className="flex w-full max-w-lg mx-auto items-center space-x-2 bg-card p-2 rounded-full border border-border shadow-xl shadow-primary/5">
              <Input
                type="text"
                placeholder="Search for 'Amul Butter'..."
                className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 h-10 px-4 text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/products?search=${e.currentTarget.value}`
                  }
                }}
              />
              <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 shrink-0">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                Shop by <span className="text-primary">Category</span>
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full mt-3 opacity-90" />
            </div>
            <Button variant="outline" className="hidden md:inline-flex rounded-full border-2 border-border/60 hover:border-primary hover:bg-primary hover:text-primary-foreground font-bold px-6 transition-all duration-300" asChild>
              <Link href="/products" className="flex items-center justify-center">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground bg-white/50 rounded-xl border border-dashed">
              <p>Loading categories or no categories found...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <Link href={`/products?category=${cat.id}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm hover:shadow-xl transition-all duration-300">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <span className="text-lg font-bold text-white tracking-wide group-hover:translate-x-1 transition-transform">{cat.name}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full rounded-full border-2 border-border/60 hover:border-primary hover:bg-primary hover:text-primary-foreground font-bold px-6 transition-all duration-300" asChild>
              <Link href="/products" className="flex items-center justify-center">
                View All Categories <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mb-12 text-center md:text-left relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10" />
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Trusted <span className="text-primary">Local Sellers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0">
              Connect with the best neighborhood shops and businesses in Gujarat.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellers.map((seller, i) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/products?business_id=${seller.id}`} className="block group">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-3">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                    <img src={seller.image} alt={seller.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded flex items-center shadow-sm z-20">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                      {seller.rating}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{seller.name}</h3>
                  <p className="text-sm text-muted-foreground">{seller.type}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl shadow-sm">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Fresh <span className="text-primary">Recommendations</span>
                </h2>
                <p className="text-muted-foreground font-medium mt-1">Handpicked daily essentials just for you.</p>
              </div>
            </div>

            <Button variant="outline" className="hidden md:inline-flex rounded-full border-2 border-border/60 hover:border-primary hover:bg-primary hover:text-primary-foreground font-bold px-6 transition-all duration-300" asChild>
              <Link href="/products">Explore All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={{ ...product, image: product.image_url }} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features / Trust */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "30-Min Delivery",
                desc: "Superfast delivery for eligible local orders within Gujarat city limits.",
              },
              {
                icon: Shield,
                title: "Genuine Products",
                desc: "100% authentic items sourced directly from verified local business owners.",
              },
              {
                icon: TrendingUp,
                title: "Best Prices",
                desc: "Get competitive local market rates without the hassle of going out.",
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm text-center"
              >
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
