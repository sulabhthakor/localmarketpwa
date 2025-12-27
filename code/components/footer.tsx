
import Link from "next/link";
import { Store, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InstallPwaButton } from "@/components/InstallPwaButton";

export function Footer() {
    return (
        <footer className="bg-background text-muted-foreground pt-16 pb-8 border-t border-border/50">
            <div className="container mx-auto px-4 md:px-8">

                {/* Main 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Column 1: Brand & Social */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                                <Store className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-foreground">LocalMarket</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            Empowering Gujarat's local businesses. Experience the joy of shopping from your trusted neighborhood stores, delivered fast.
                        </p>
                        <div className="flex items-center gap-2">
                            <SocialButton icon={Facebook} />
                            <SocialButton icon={Twitter} />
                            <SocialButton icon={Instagram} />
                        </div>
                        <div className="pt-2">
                            <InstallPwaButton />
                        </div>
                    </div>

                    {/* Column 2: Shop */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6 text-lg">Shop</h3>
                        <ul className="space-y-4 text-sm">
                            <li><FooterLink href="/products">All Products</FooterLink></li>
                            <li><FooterLink href="/products?category=1">Fresh Vegetables</FooterLink></li>
                            <li><FooterLink href="/products?category=2">Dairy Products</FooterLink></li>
                            <li><FooterLink href="/products?category=3">Snacks & Farsan</FooterLink></li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6 text-lg">Support</h3>
                        <ul className="space-y-4 text-sm">
                            <li><FooterLink href="/contact">Contact Us</FooterLink></li>
                            <li><FooterLink href="/faq">FAQs</FooterLink></li>
                            <li><FooterLink href="/shipping">Shipping Policy</FooterLink></li>
                            <li><FooterLink href="/returns">Returns & Refunds</FooterLink></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6 text-lg">Contact</h3>
                        <ul className="space-y-5 text-sm">
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-card border border-border rounded-lg shrink-0 shadow-sm">
                                    <MapPin className="h-4 w-4 text-primary" />
                                </div>
                                <span className="mt-1">123, CG Road, Navrangpura,<br />Ahmedabad, Gujarat 380009</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-card border border-border rounded-lg shrink-0 shadow-sm">
                                    <Phone className="h-4 w-4 text-primary" />
                                </div>
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-card border border-border rounded-lg shrink-0 shadow-sm">
                                    <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <span>support@localmarket.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LocalMarket PWA. All rights reserved.
                    </p>

                    <Badge variant="outline" className="border-border text-foreground bg-card px-4 py-1.5 flex items-center gap-1.5 font-normal shadow-sm">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Gujarat
                    </Badge>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <FooterLink href="/terms">Terms</FooterLink>
                        <FooterLink href="/privacy">Privacy</FooterLink>
                        <FooterLink href="/cookies">Cookies</FooterLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialButton({ icon: Icon }: { icon: any }) {
    return (
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-card hover:text-primary hover:shadow-md border border-transparent hover:border-border rounded-full transition-all">
            <Icon className="h-4 w-4" />
        </Button>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-muted-foreground hover:text-primary transition-colors block w-fit hover:translate-x-1 duration-200">
            {children}
        </Link>
    )
}
