import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  onDemandEntries: { maxInactiveAge: 60 * 60 * 1000 },
  experimental: {
    /* Round 2: cut duplicate RSC prefetch re-fetches (three identical /about
       prefetches measured on first load) and tree-shake icon barrels.
       (framer-motion removed from the list in r5 — the dependency is gone
       entirely; the repo is now framer-free, not just type-only.) */
    staleTimes: { dynamic: 30 },
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    /* Round 4: immutable caching for public/ assets (screenshots, icons, OG
       image, logo) — browsers would otherwise revalidate them every visit.
       Vercel already covers /_next/static. */
    const immutableFiles = [
      "og-smartlink.jpg",
      "logo.png",
      "favicon-32.png",
      "apple-touch-icon.png",
      "icon-192.png",
      "icon-512.png",
      "icon-512-maskable.png",
    ];
    const immutable = [
      ...immutableFiles.map((f) => ({
        source: `/${f}`,
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      })),
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          /* Round 5 (gstack /cso — OWASP A05): static CSP. A nonce-based policy
             needs middleware; this static profile still kills the dangerous
             default: frame-ancestors + base-uri + form-action + object-src are
             fully enforced, scripts/styles are locked to self + the two hosts
             we actually use (Vercel Analytics, Unsplash), and 'unsafe-inline'
             covers Next's inline bootstrap/ styles only. */
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com",
              "font-src 'self' data:",
              "connect-src 'self' https://va.vercel-scripts.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      ...immutable,
    ];
  },
};

export default nextConfig;
