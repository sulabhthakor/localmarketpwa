import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/BottomNav";
import I18nProvider from "@/components/i18n-provider";
import { PwaRegister } from "@/components/PwaRegister";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalMarket PWA",
  description: "A multilingual progressive web app marketplace",
};

export const viewport = {
  themeColor: "#fe330a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <I18nProvider>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </I18nProvider>
        <PwaRegister />
        <Toaster />
      </body>
    </html>
  );
}
