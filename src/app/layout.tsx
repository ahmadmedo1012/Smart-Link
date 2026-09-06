import type { Metadata } from "next"
import { Cairo, Readex_Pro } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-cairo",
  display: "swap",
  /* r8 LCP fix: Cairo (64 KB across two subsets) was preloaded at the
     highest priority — competing with the LCP element (the h1, rendered
     in Readex Pro). Cairo is the BODY font: body text paints with the
     metric-adjusted fallback first and swaps in AFTER the LCP, so it
     doesn't belong in the preload window. Readex (the LCP font) stays
     preloaded. Verified: CLS stays 0 — the fallback is metric-adjusted. */
  preload: false,
})

/* Brand parity with Smart-Menu/SmartBot: Readex Pro leads --font-heading */
const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-readex-pro",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "SmartLink - منصة رقمية متكاملة",
    template: "%s | SmartLink",
  },
  description: "SmartLink منصة رقمية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي للمطاعم، البوت الذكي لفيسبوك، والمزيد من الخدمات المبتكرة",
  keywords: ["SmartLink", "منصة رقمية", "الربط الذكي", "منيو رقمي", "بوت فيسبوك", "تسويق إلكتروني"],
  metadataBase: new URL("https://smart-link.ly"),
  /* r7: home was the ONLY route without a canonical link — the five
     subpages stamp one via pageMetadata(), but the root layout never
     defined alternates, so search engines got no self-reference for
     the most-linked URL of the site (live-verified missing). */
  alternates: { canonical: "/" },
  openGraph: {
    title: "SmartLink - منصة رقمية متكاملة",
    description: "حلول ذكية للأعمال: المنيو الرقمي، البوت الذكي، والمزيد",
    url: "/",
    siteName: "SmartLink",
    locale: "ar_LY",
    type: "website",
    images: [{
      url: "/og-smartlink.jpg",
      width: 1200,
      height: 630,
      alt: "SmartLink — منصة رقمية متكاملة: المنيو الرقمي والبوت الذكي",
      type: "image/jpeg",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartLink - منصة رقمية متكاملة",
    description: "حلول ذكية للأعمال: المنيو الرقمي، البوت الذكي، والمزيد",
    images: ["/og-smartlink.jpg"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} ${readexPro.variable}`}>
      <head>
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SmartLink" />
        {/* r6: iOS Safari otherwise auto-links bare 10+ digit sequences
            (e.g. the WhatsApp number inside error text) into uncontrolled
            tel: anchors — numbers we WANT clickable are already wrapped in
            real <a href> elements. */}
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SmartLink",
              alternateName: "سمارت لينك",
              url: "https://smart-link.ly",
              logo: {
                "@type": "ImageObject",
                url: "https://smart-link.ly/logo.png",
                width: 600,
                height: 409,
              },
              description:
                "منصة رقمية ليبية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي للمطاعم والبوت الذكي لفيسبوك.",
              foundingDate: "2025-11-20",
              founder: { "@type": "Person", name: "أحمد خيري" },
              contactPoint: {
                "@type": "ContactPoint",
                /* r6: was "ahmad..." — every other surface (API owner inbox,
                   footer, contact page, terms/privacy, the plan doc) uses
                   "ahmed..." and the GitHub login is ahmadmedo1012 — one
                   transposed letter was shipping to crawlers via JSON-LD. */
                email: "ahmedmedo1012@gmail.com",
                contactType: "customer service",
                availableLanguage: ["ar", "en"],
              },
              sameAs: [
                "https://wa.me/218910089975",
                "https://menu.smart-link.ly",
                "https://bot.smart-link.ly",
              ],
              subOrganization: [
                {
                  "@type": "Organization",
                  name: "Smart Menu",
                  url: "https://menu.smart-link.ly",
                  description: "المنيو الرقمي التفاعلي للمطاعم مع طلبات واتساب",
                },
                {
                  "@type": "Organization",
                  name: "SmartBot",
                  url: "https://bot.smart-link.ly",
                  description: "البوت الذكي لأتمتة الردود على صفحات فيسبوك",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SmartLink",
              url: "https://smart-link.ly",
              inLanguage: "ar",
            }),
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col antialiased overflow-x-hidden bg-[var(--background)]">
        <a href="#main-content" className="pointer-events-auto fixed opacity-0 focus:opacity-100 focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[var(--primary)] focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none transition-opacity duration-200">
          تخطى إلى المحتوى الرئيسي
        </a>
        <div className="noise-overlay" />
        {/* r8: scroll progress bar is now a pure CSS scroll-driven
            animation (scroll(root) timeline, see globals.css) — zero JS,
            zero listeners, zero hydration. Browsers without scroll
            timelines keep a static (invisible) bar: decorative, safe. */}
        <div className="scroll-progress" aria-hidden="true" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <MainNav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
