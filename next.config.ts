import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* r9 (security audit P3-8): the two Unsplash remotePatterns were dead
       weight — every image on the site is local (/public). An unused
       remote allowance is an open attack surface for zero benefit. */
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  /* r11 (تدقيق كود): روابط href الداخلية الـ15 تتحقق زمن البناء
     (خطأ إملائي في مسار = فشل build بدل 404 حي). */
  typedRoutes: true,
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
       Vercel already covers /_next/static.
       r9 (perf audit #6): favicon.ico and manifest.webmanifest were the two
       requested-on-every-visit files outside any cache rule — crawlers and
       browsers re-fetch them per page view. og-smartlink.svg deleted (dead
       asset, referenced nowhere). */
    const immutableFiles = [
      "og-smartlink.jpg",
      "logo.png",
      "favicon-32.png",
      "apple-touch-icon.png",
      "icon-96.png",
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
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
    return [
      {
        source: "/(.*)",
        headers: [
          /* r9 (security audit P3-4): + preload — both sibling subdomains
             (menu/bot) already serve HTTPS, the precondition for the flag.
             Actual HSTS preload-list submission stays an owner action. */
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          /* r9 (security audit P3-9): expanded beyond camera/mic/geo to the
             full deny-by-default surface a marketing site never needs.
             r13 (security audit P3): + interest-cohort (FLoC),
             idle-detection, accelerometer and gyroscope — closing the
             remaining API surface a static site exposes for zero value. */
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), browsing-topics=(), interest-cohort=(), idle-detection=(), accelerometer=(), gyroscope=()",
          },
          /* r8: cross-origin hardening. Live comparison (r8) showed the
             sibling site menu.smart-link.ly had already shipped COOP/CORP —
             the umbrella was no longer the strictest in the family. These
             restore that lead: COOP cuts cross-origin window.opener
             attacks, CORP blocks our resources from being embedded by
             arbitrary origins. */
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          /* r13 (security audit): X-DNS-Prefetch-Control removed — "on" is
             the browser default, so the header asserted nothing and did
             nothing (documented as a no-op since r10). Dead signal deleted. */
          /* Round 5 (gstack /cso — OWASP A05): static CSP. A nonce-based policy
             needs middleware; this static profile still kills the dangerous
             default: frame-ancestors + base-uri + form-action + object-src are
             fully enforced, scripts/styles are locked to self + Vercel
             Analytics, and 'unsafe-inline' covers Next's inline bootstrap /
             streaming scripts only (App Router emits self.__next_f inline
             pushes that cannot be nonced on statically-prerendered pages).
             r9: unsplash hosts dropped from img-src — the site serves zero
             remote images. r11 (تدقيق أمن B-B10): blob: سقط من img-src —
             لا يوجد أي createObjectURL في الكود، ومخصص بلا مستهلك
             = سطح هجوم مفتوح للصفر. */
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
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
