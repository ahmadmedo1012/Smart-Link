"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Mail } from "lucide-react"
/* r128 F2b: the shared product chrome moved out of the RootLayout
   (the landing owns its own world now) — this page renders it itself. */
import { SiteChrome } from "@/components/site-chrome"

/* Route-segment error boundary — Arabic UX, brand tokens, no layout re-mount.
   r9 (a11y audit A6): focus moves to the heading when the boundary mounts —
   screen-reader users otherwise had no announcement that the view changed. */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    console.error("[smartlink] route error:", error?.message, error?.digest)
    headingRef.current?.focus()
  }, [error])

  return (
    <SiteChrome>
    <div className="pt-28 pb-16 relative overflow-hidden">
      <div className="container-base relative">
        {/* r130 (W1-D P2-8): the pre-F6 glass diet is retired — the
            boundary card joins every other inner surface on the flat
            ln-card hairline (r128 F6), the icon well goes flat accent
            (like about/pricing), and the ghost CTA swaps its glass
            border/bg for ln-card. */}
        <div className="max-w-xl mx-auto text-center ln-card rounded-2xl p-10 reveal-up">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[var(--accent)]">
            <AlertTriangle className="w-8 h-8 text-[var(--primary)]" aria-hidden="true" />
          </div>
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-foreground mb-3 outline-none">
            حدث خطأ غير متوقع
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            نعتذر عن الإزعاج. حدث خطأ أثناء تحميل هذا القسم — يمكنك المحاولة مرة أخرى،
            وإن استمر الخطأ تواصل معنا وسنصلحه فوراً.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-[var(--primary-fg)] font-semibold text-sm hover:bg-[var(--accent-hover)] transition-all duration-160 active:scale-[0.97]"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              إعادة المحاولة
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl ln-card text-foreground font-semibold text-sm"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
    </SiteChrome>
  )
}
