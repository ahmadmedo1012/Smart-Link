import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import type { Metadata } from "next"
/* r128 F2b: the shared product chrome moved out of the RootLayout
   (the landing owns its own world now) — this page renders it itself. */
import { SiteChrome } from "@/components/site-chrome"

/* r6: real page title for the 404 route (was falling back to the root
   default — tab/history showed the home title on a dead URL).
   r9 (SEO audit P2-1): robots noindex + description. The rendered 404 used
   to carry the ROOT layout's `index, follow` alongside Next's own noindex
   — two contradictory robots directives — plus a canonical to "/" and the
   HOME's OG card on every dead URL. Page-level robots wins the merge, and
   the description replaces the inherited home text.

   r128 F6 (A4 §6): de-gradient — the 90px blur glow is retired (flat token
   ground), the gradient-text numeral becomes flat accent ink in the mono
   machine-voice (numerals = Latin run, §7 typography), and the ghost CTA
   swaps its glass for the flat hairline card. Reveal verbs stay (canonical
   motion family). */
export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  description: "الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى عنوان آخر.",
  robots: { index: false, follow: true },
  /* r10 (SEO audit P1): the ROOT layout's alternates.canonical="/" used to
     be inherited by every dead URL — a 404 telling crawlers "merge me into
     the home page" while robots said noindex: contradictory signals.
     An empty object REPLACES the root's alternates (Next merges metadata
     shallowly), cutting the inherited canonical. The openGraph card below
     replaces the root's home card for the same reason — a shared dead link
     rendered the HOME's og:url/og:title on Facebook/WhatsApp. */
  alternates: {},
  openGraph: {
    title: "الصفحة غير موجودة",
    description: "الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى عنوان آخر.",
  },
  /* r11 (تحقق حي): بطاقة twitter كانت الوحيدة الباقية الموروثة من
     الجذر على رابط ميت بعد قطع canonical وog في r10 — نصف إصلاح
     من نفس النوع. null يمنع التوريث (تحقق متعمد في SEO spec). */
  twitter: null,
}

/* Server component — CSS reveal only. This boundary renders in EVERY route's
   chunk graph, so a framer-motion import here would ship the whole 117 KB
   library to all pages. */
export default function NotFound() {
  return (
    <SiteChrome>
    {/* r130 (W1-D P2-15): pt aligns with the canonical 64px topbar (the
        old md:pt-[72px] compensated the retired 72px desktop height). */}
    <div className="min-h-[80dvh] pt-16 flex items-center justify-center relative overflow-hidden">
      <div className="text-center relative">
        <div className="reveal-blur">
          <h1 className="text-9xl font-bold leading-none mb-2">
            {/* r128 F6: flat accent ink + mono voice (was gradient-text) */}
            <span className="ln-mono text-[var(--primary-text)]">404</span>
          </h1>
        </div>
        <div className="reveal-up reveal-d-2">
          {/* r131 (A3 D1): the title rides the --fs-display-md rung
              clamp(28px→40px) — was raw text-2xl 24px, a step below the
              canonical display scale (W1-I §7). */}
          <h2 className="text-[length:var(--fs-display-md)] font-bold text-[var(--foreground)] mb-2">الصفحة غير موجودة</h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* r132-G4 (A8 F-SL-1): the CTA pair rides the FULL r131
                fleet button canon 40/13/600/r10 (h-10 = 40px, --fs-sm
                13px, rounded-md = 10px, press 0.97 — the SO Button
                twin); was rounded-xl 16px + text-sm 14px + py-3 ≈44px. */}
            <Link
              href="/"
              className="group inline-flex items-center gap-2 h-10 px-5 rounded-md bg-[var(--primary)] text-[var(--primary-fg)] font-semibold text-[length:var(--fs-sm)] hover:bg-[var(--accent-hover)] transition-all duration-160 active:scale-[0.97]"
            >
              <Home className="w-4 h-4" aria-hidden="true" /> العودة للرئيسية
            </Link>
            {/* r132 (A8 F-SL-1 + G4 canon completion): the ghost joins
                the rectangle grammar on the full 40/13/600/r10 canon
                (matches the 500-boundary ghost exactly); the pill is
                landing-hero grammar only. */}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 h-10 px-5 ln-card rounded-md text-[var(--foreground)] font-semibold text-[length:var(--fs-sm)]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" /> تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
    </SiteChrome>
  )
}
