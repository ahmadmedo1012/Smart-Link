import type { Metadata, Viewport } from "next"
import { Bodoni_Moda, Noto_Kufi_Arabic } from "next/font/google"
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
   Sans Arabic (10 woff2 in /public/fonts — 8 Sans Arabic + the 2 live
   mono cuts; r132 deleted the 2 consumer-less serif italics,
   @font-face block at the top of styles.css — refs/madarek-reference.md
   §2/§7). The two first-paint preloads below replace the Cairo preload
   one-for-one: the body text paints in the 400 arabic cut and every
   heading/CTA label in the 700 arabic cut (~86 KB together, same
   preload budget as before). */

/* P12-2a (r160 KODE): the DISPLAY pair — Latin Didone + Arabic Kufi.
 * Bodoni_Moda 700 = the free OT-Brut stand-in (Latin wordmark/numbers);
 * Noto_Kufi_Arabic 700+800 = the Arabic display cuts for the 3-line hero
 * lockup + chapter headers. UI/body stays the self-hosted IBM Plex pair
 * above. Wired as vars — landing.css consumes --font-display-latin /
 * --font-display-arabic; nothing else changes. */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: "700",
  display: "optional", /* P16-W7: no swap event ever — CLS-zero under font-latency */
  variable: "--font-display-latin",
})
const kufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["700", "800"],
  display: "optional", /* P16-W7: no swap event ever — CLS-zero under font-latency */
  variable: "--font-display-arabic",
})

export const metadata: Metadata = {
  title: {
    default: "SmartLink — منصة رقمية متكاملة للأعمال في ليبيا",
    template: "%s | SmartLink",
  },
  description:
    /* r13 (content audit P3): trimmed «خطوة بخطوة» — the description sat
       at 169 chars, past the 140–160 sweet spot; landed at 157.
       r138 (إكمال صدق الأسطول — موجة r137 الفائتة): الوصف الجذري كان
       يعدّ منتجين بينما المنصة تسوّق ثلاثة — أُدرج متجر الطلبات
       الرقمي وبقيت داخل نافذة 140-160 (155). */
    "SmartLink منصة رقمية ليبية متكاملة: المنيو الرقمي التفاعلي للمطاعم، والبوت الذكي لردود فيسبوك الآلية، ومتجر الطلبات الرقمي — ابدأ مجاناً اليوم وطور أعمالك.",
  keywords: ["SmartLink", "منصة رقمية", "الربط الذكي", "منيو رقمي", "بوت فيسبوك", "تسويق إلكتروني"],
  metadataBase: new URL(SITE.url),
  /* r7: home was the ONLY route without a canonical link — the five
     subpages stamp one via pageMetadata(), but the root layout never
     defined alternates, so search engines got no self-reference for
     the most-linked URL of the site (live-verified missing). */
  alternates: { canonical: "/" },
  openGraph: {
    title: "SmartLink — منصة رقمية متكاملة للأعمال في ليبيا",
    /* r138 (إكمال صدق الأسطول): الثلاثة منتجات في وصف الـOG — كان
       منتجين فقط (الجذر وصف الرئيسية في SERP والبطاقات). */
    description: "حلول ذكية للأعمال في ليبيا: المنيو الرقمي التفاعلي، والبوت الذكي لفيسبوك، ومتجر الطلبات الرقمي — ابدأ مجاناً اليوم.",
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
    /* r138 (إكمال صدق الأسطول): مطابقة وصف الـOG أعلاه. */
    description: "حلول ذكية للأعمال في ليبيا: المنيو الرقمي التفاعلي، والبوت الذكي لفيسبوك، ومتجر الطلبات الرقمي — ابدأ مجاناً اليوم.",
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
        {/* r131 (A10 F3/F4 — r130 SO ruling): pre-paint theme boot. Dark
            default; light ONLY when explicitly stored — the same one
            resolution path the ThemeProvider now uses (enableSystem is
            off below), so the class the boot script paints is always
            the class next-themes keeps. Closes the stored-light dark
            flash (next-themes applies the class from its body-position
            script — later than head) and guarantees html.light exists
            before the header parses (the dual-variant logo + theme
            surfaces key off it). Legacy stored "system" values (from
            the enableSystem era) resolve to the dark default here,
            exactly as the provider treats them. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
        {/* m15: first-paint font preloads — the only two faces the hero
            paints with (body 400 + headings/CTA 700, arabic subsets).
            crossorigin is mandatory for font fetches even same-origin. */}
        <link rel="preload" href="/fonts/plex-sans-arabic-400-normal-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plex-sans-arabic-700-normal-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* P18-W2-b (CLS gate closure): the remaining above-fold faces now
            that every @font-face is font-display:optional (the P16-W7
            no-swap law, extended to all Plex faces). optional only uses a
            font that lands inside the ~100ms block window — so the faces
            the first viewport paints with must be preloaded to win that
            race: eyebrow/mono technical chips (mono 400), digits+latin
            runs (sans 400 latin), nav/strong semibold (sans 500/600
            arabic). Without these the cold first visit would fall back to
            Tajawal/system — CLS-zero but typographically wrong. */}
        <link rel="preload" href="/fonts/plex-mono-400-normal-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plex-sans-arabic-400-normal-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plex-sans-arabic-500-normal-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plex-sans-arabic-600-normal-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* m15 → P13-2a re-word: browser bar follows the KODE grounds —
            ink #050507 (dark) / paper #F4F2ED (light); ThemeColorSync
            re-points both metas to the user's resolved theme. */}
        <meta name="theme-color" content="#050507" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#F4F2ED" media="(prefers-color-scheme: light)" />
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
      <body className={`${bodoni.variable} ${kufi.variable} min-h-dvh flex flex-col antialiased overflow-x-clip bg-[var(--background)]`}>
        {/* 15-SL (قبول 14-a P3): حبوبة التخطّي الذهبية انتقلت من هنا إلى
            SiteChrome — هدفها الوحيد <main id="main-content"> يعيش داخل
            SiteChrome نفسه، فعلى ال landing كانت توأمًا ميتًا (هدف بلا
            وجود) تحجبه landing.css بقاعدة display:none. الآن كل سطح
            يحمل رابط تخطّي واحدًا حيًّا: المنتجات عبر SiteChrome،
            والرئيسية عبر حبوبتها الجيرية الكنسية → #main (r129 P2-2).
            (r131 A12 P3: start-4 المنطقية — السمة بقيت كما هي مع النقل.) */}
        {/* r8: the product scroll-progress ribbon moved to SiteChrome
            (r128 F2b) — the landing renders its own imperative --p bar
            instead, so the two never stack. */}
        {/* r131 (A10 F3 — r130 SO ruling; F9b hardening): enableSystem
            OFF, now EXPLICIT — next-themes v0.4.6 defaults enableSystem
            to true, so the F9 edit that dropped the old truthy prop was
            a runtime no-op (OS resolution stayed live: a legacy stored
            "system" value could still flip the class post-hydration,
            contradicting the boot script's dark). With the prop off,
            one resolution path holds for every stored value: boot
            script == provider, both dark-default, OS never consulted. */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ThemeColorSync />
          {children}
          <LazyAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
