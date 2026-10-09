import type { Metadata } from "next"
import { WifiOff } from "lucide-react"
import { SITE } from "@/lib/site"
/* r128 F2b: the shared product chrome moved out of the RootLayout
   (the landing owns its own world now) — this page renders it itself. */
import { SiteChrome } from "@/components/site-chrome"

/* r14 (M7): صفحة أداة لا محتوى — تُخدَم من كاش الـSW عند انقطاع الشبكة
   للتطبيق المثبت (WebAPK/iOS home-screen). سابقة 404 متبعة عن قصد:
   صفحات الأدوات لا تدخل PAGES في fixtures (حلقات seo/axe لا تنطبق
   عقودها هنا) بل تحصل على spec مخصص (e2e/offline.spec.ts) — الغطاء
   أوفى من إدخال PAGES. sitemap يعدّد يدوياً فلن تدخل تلقائياً. */
export const metadata: Metadata = {
  title: "لا يوجد اتصال بالإنترنت",
  description: "يبدو أن الشبكة مقطوعة حالياً — تواصل مع فريق SmartLink عبر واتساب مباشرة.",
  robots: { index: false, follow: false },
  /* نفس عقل 404 (r10): لا canonical موروث لصفحة noindex، وبطاقة OG
     مستقلة حتى لا يرث رابط الأداة بطاقة الرئيسية. */
  alternates: {},
  openGraph: {
    title: "لا يوجد اتصال بالإنترنت",
    description: "تواصل مع فريق SmartLink عبر واتساب مباشرة.",
  },
  twitter: null,
}

export default function OfflinePage() {
  /* r126 (P4-A3 §2.5): was <main> — the root layout already owns the
     <main id="main-content"> landmark; a nested main is invalid HTML
     and duplicated the landmark for every screen reader. */
  return (
    <SiteChrome>
    <section className="min-h-dvh flex flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
      <WifiOff className="w-14 h-14 text-primary mb-6" aria-hidden="true" />
      {/* r132 (A6 §4): the H1 rides the --fs-h1 30px rung — text-3xl is
          the identical value (the r131-F9b swap landed 404 but missed
          this boundary twin). */}
      <h1 className="font-[family-name:var(--font-heading)] text-[length:var(--fs-h1)] font-bold text-foreground mb-3">
        لا يوجد اتصال بالإنترنت
      </h1>
      <p className="text-muted-foreground leading-relaxed max-w-md mb-8">
        يبدو أن الشبكة مقطوعة حالياً. سيعمل الموقع تلقائياً بمجرد عودة
        الاتصال — أو تواصل معنا مباشرة عبر واتساب:
        <span dir="ltr" className="block mt-2 font-semibold text-foreground">
          {SITE.whatsapp.display}
        </span>
      </p>
      <a
        href={SITE.whatsapp.url}
        target="_blank"
        rel="noopener noreferrer"
        /* r130 (W1-D P2-9): the canonical filled-CTA hover — an
           --accent-hover background shift (was: no hover state at all).
           r132-G4 (A8 F-SL-1): the FULL r131 fleet button canon
           40/13/600/r10 (h-10 = 40px, --fs-sm 13px, rounded-md = 10px —
           the SO Button twin); was rounded-xl + text-sm 14px + py-3. */
        className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary font-semibold text-[length:var(--fs-sm)] text-[var(--primary-fg)] transition-all duration-160 hover:bg-[var(--accent-hover)] active:scale-[0.97]"
      >
        تواصل عبر واتساب
      </a>
    </section>
    </SiteChrome>
  )
}
