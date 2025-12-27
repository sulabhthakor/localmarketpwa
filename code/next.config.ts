import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  // Enable PWA in dev mode for testing (CAUTION: This may cause aggressive caching during development)
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  // @ts-ignore - Turbopack type might not be in the definition yet depending on version, generic ignore to be safe or just standard property
  turbopack: {},
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "*.bing.net",
      },
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
      },
    ],
  },
  experimental: {
    // serverActions: true, // simplified
  },
};

export default withPWA(nextConfig);
