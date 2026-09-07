import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import type { Metadata } from "next"

/* r6: real page title for the 404 route (was falling back to the root
   default — tab/history showed the home title on a dead URL).
   r9 (SEO audit P2-1): robots noindex + description. The rendered 404 used
   to carry the ROOT layout's `index, follow` alongside Next's own noindex
   — two contradictory robots directives — plus a canonical to "/" and the
   HOME's OG card on every dead URL. Page-level robots wins the merge, and
   the description replaces the inherited home text. */
export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  description: "الصفحة التي تبحث عنها غير متوفرة أو تم نقلها إلى عنوان آخر.",
  robots: { index: false, follow: true },
}

/* Server component — CSS reveal only. This boundary renders in EVERY route's
   chunk graph, so a framer-motion import here would ship the whole 117 KB
   library to all pages. */
export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/5 blur-[90px]" aria-hidden="true" />
      </div>
      <div className="text-center relative">
        <div className="reveal-blur">
          <h1 className="text-9xl font-extrabold tracking-tight leading-none mb-2">
            <span className="gradient-text">404</span>
          </h1>
        </div>
        <div className="reveal-up reveal-d2">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">الصفحة غير موجودة</h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 active:scale-[0.98]"
            >
              <Home className="w-4 h-4" aria-hidden="true" /> العودة للرئيسية
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" /> تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
