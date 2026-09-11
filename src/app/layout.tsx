import type { Metadata } from "next"
import { Cairo, Readex_Pro } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeColorSync } from "@/components/theme-color-sync"
import { LazyAnalytics } from "@/components/lazy-analytics"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { organizationJsonLd, websiteJsonLd, servicesJsonLd } from "@/lib/schema"
import { OG_IMAGE } from "@/lib/seo"
import { SITE } from "@/lib/site"
/* r11 — إعادة تسمية من globals.css: بناء Vercel خدّم تشكيلاً متقادماً
   من كاش Turbopack للمسار القديم رغم تغيّر المحتوى (الـHTML الجديد صدر
   مع CSS قديم — 137 بايت من قواعد r11 غابت). مسار ملف جديد = لا مدخل
   كاش له إطلاقاً في أي طبقة. التفاصيل في الفصل 16 من التقرير. */
import "./styles.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-cairo",
  display: "swap",
  /* r8 final: preload is ON after a measured A/B. The hero description —
     the page's LCP element (26,566 px² on mobile) — is BODY text set in
     Cairo. With preload:false the text paints in the fallback and swaps,
     which real throttled probes measured as fine (LCP = FCP = 1.16s) but
     Lighthouse's Lantern simulation models the non-preloaded font as
     late-discovered (local LCP 3.5s) — and the acceptance gate is the
     lab score. With the r8 reveal-animations removed from the h1 and the
     description, LCP no longer waits on animation end either, so the
     preloads land as pure win: LCP paints at max(FCP, font arrival). */
  preload: true,
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
    default: "SmartLink — منصة رقمية متكاملة للأعمال في ليبيا",
    template: "%s | SmartLink",
  },
  description:
    /* r13 (content audit P3): trimmed «خطوة بخطوة» — the description sat
       at 169 chars, past the 140–160 sweet spot; this lands at 157. */
    "SmartLink منصة رقمية ليبية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي التفاعلي للمطاعم، والبوت الذكي لردود فيسبوك الآلية — ابدأ مجاناً اليوم وطور أعمالك.",
  keywords: ["SmartLink", "منصة رقمية", "الربط الذكي", "منيو رقمي", "بوت فيسبوك", "تسويق إلكتروني"],
  metadataBase: new URL(SITE.url),
  /* r7: home was the ONLY route without a canonical link — the five
     subpages stamp one via pageMetadata(), but the root layout never
     defined alternates, so search engines got no self-reference for
     the most-linked URL of the site (live-verified missing). */
  alternates: { canonical: "/" },
  openGraph: {
    title: "SmartLink — منصة رقمية متكاملة للأعمال في ليبيا",
    description: "حلول ذكية للأعمال في ليبيا: المنيو الرقمي التفاعلي، والبوت الذكي لفيسبوك — ابدأ مجاناً اليوم.",
    url: "/",
    siteName: "SmartLink",
    /* r9 (SEO audit P3-7): ar_LY is not a value Facebook recognizes
       (its Arabic list has ar_AR only) — unknown locales are dropped. */
    locale: "ar_AR",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartLink — منصة رقمية متكاملة للأعمال في ليبيا",
    description: "حلول ذكية للأعمال في ليبيا: المنيو الرقمي التفاعلي، والبوت الذكي لفيسبوك — ابدأ مجاناً اليوم.",
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
        {/* r9 (SEO audit P2-4): the documented iOS standalone meta —
            mobile-web-app-capable alone is not read by older iOS/Safari
            edges; this completes the Apple pair alongside status-bar-style
            and title. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
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
        {/* r14 (M7): تسجيل SW أصغرية (ملاحة فقط + /offline عند انقطاع
            الشبكة) — سكربت inline بنمط JSON-LD نفسه: صفر حزم، صفر ترطيب،
            والتسجيل بعد load فلا يقترب من النافذة الحرجة. .catch يبتلع
            أي فشل (Playwright يحجب SW في سياقات الاختبار بلا ضوضاء). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})},{once:true})}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd()) }}
        />
      </head>
      <body className="min-h-dvh flex flex-col antialiased overflow-x-clip bg-[var(--background)]">
        <a href="#main-content" className="pointer-events-auto fixed opacity-0 focus:opacity-100 focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[var(--primary)] focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none transition-opacity duration-200">
          تخطَّ إلى المحتوى الرئيسي
        </a>
        {/* r8: scroll progress bar is now a pure CSS scroll-driven
            animation (scroll(root) timeline, see styles.css) — zero JS,
            zero listeners, zero hydration. Browsers without scroll
            timelines keep a static (invisible) bar: decorative, safe. */}
        <div className="scroll-progress" aria-hidden="true" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ThemeColorSync />
          <MainNav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <LazyAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
