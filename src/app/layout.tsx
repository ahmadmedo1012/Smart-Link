import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeColorSync } from "@/components/theme-color-sync"
import { LazyAnalytics } from "@/components/lazy-analytics"
import { organizationJsonLd, websiteJsonLd, servicesJsonLd } from "@/lib/schema"
import { OG_IMAGE } from "@/lib/seo"
import { SITE } from "@/lib/site"
/* r11 — إعادة تسمية من globals.css: بناء Vercel خدّم تشكيلاً متقادماً
   من كاش Turbopack للمسار القديم رغم تغيّر المحتوى (الـHTML الجديد صدر
   مع CSS قديم — 137 بايت من قواعد r11 غابت). مسار ملف جديد = لا مدخل
   كاش له إطلاقاً في أي طبقة. التفاصيل في الفصل 16 من التقرير. */
import "./styles.css"

/* m15 (Madarek parity): the next/font/google Cairo (preloaded!) +
   Readex Pro pair is RETIRED. Typography is the self-hosted IBM Plex
   Sans Arabic (12 woff2 in /public/fonts, @font-face block at the top
   of styles.css — refs/madarek-reference.md §2/§7). The two first-paint
   preloads below replace the Cairo preload one-for-one: the body text
   paints in the 400 arabic cut and every heading/CTA label in the 700
   arabic cut (~86 KB together, same preload budget as before). */

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

/* r14 (M7): viewport-fit cover — the web view must extend under the
   iOS home-indicator / Dynamic Island so env(safe-area-inset-*)
   resolves to real values. Without this, .safe-area-pb and any
   calc() using env() was a no-op reading 0 on every iPhone with a
   bottom gesture area. Paired with the CSS utilities in styles.css.
   (m15: moved to the dedicated Viewport export — Next 16 warns when
   viewport rides inside the metadata object.) */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* m15: first-paint font preloads — the only two faces the hero
            paints with (body 400 + headings/CTA 700, arabic subsets).
            crossorigin is mandatory for font fetches even same-origin. */}
        <link rel="preload" href="/fonts/plex-sans-arabic-400-normal-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plex-sans-arabic-700-normal-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* m15: browser bar follows the Madarek grounds — night-indigo
            #070B16 (dark) / warm cream #FBFAF9 (light); ThemeColorSync
            re-points both metas to the user's resolved theme. */}
        <meta name="theme-color" content="#070B16" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#FBFAF9" media="(prefers-color-scheme: light)" />
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
            الشبكة) — سكربت inline بنمط JSON-LD نفسه: صفر حزم، صفر ترطيب.
            r14-post: التسجيل أُجّل إلى idle (سقف 3s) — التثبيت يجلب /offline
            ويكتب الكاش فور load، فكان ينافس نافذة القياس الحساسة وزوار
            3G الباردة على الشبكة/CPU بلا داعٍ؛ الحماية تصل خلال ثوانٍ
            قبل أي سيناريو انقطاع+إعادة فتح واقعي. .catch يبتلع أي فشل
            (Playwright يحجب SW في سياقات الاختبار بلا ضوضاء). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker" in navigator){window.addEventListener("load",function(){var r=function(){navigator.serviceWorker.register("/sw.js").catch(function(){})};if("requestIdleCallback" in window){requestIdleCallback(r,{timeout:3000})}else{setTimeout(r,1500)}},{once:true})}`,
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
        <a href="#main-content" className="pointer-events-auto fixed opacity-0 focus:opacity-100 focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[var(--primary)] focus:text-[var(--primary-fg)] focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none transition-opacity duration-160">
          تخطَّ إلى المحتوى الرئيسي
        </a>
        {/* r8: the product scroll-progress ribbon moved to SiteChrome
            (r128 F2b) — the landing renders its own imperative --p bar
            instead, so the two never stack. */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ThemeColorSync />
          {children}
          <LazyAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
