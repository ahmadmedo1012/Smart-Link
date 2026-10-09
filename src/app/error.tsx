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
          {/* r132 (A6 §4): the H1 rides the --fs-h1 30px rung — text-3xl
              is the identical value; this closes the r131-F9b gap (it
              consumed 404's title but missed the 500 boundary). */}
          <h1 ref={headingRef} tabIndex={-1} className="text-[length:var(--fs-h1)] font-bold text-foreground mb-3 outline-none">
            حدث خطأ غير متوقع
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            نعتذر عن الإزعاج. حدث خطأ أثناء تحميل هذا القسم — يمكنك المحاولة مرة أخرى،
            وإن استمر الخطأ تواصل معنا وسنصلحه فوراً.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* r132-G4 (A8 F-SL-1): the CTA pair rides the FULL r131
                fleet button canon 40/13/600/r10 (h-10 = 40px,
                --fs-sm 13px, rounded-md = 10px — the SO Button twin);
                was rounded-xl 16px + text-sm 14px + py-3 ≈44px. */}
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-[var(--primary-fg)] font-semibold text-[length:var(--fs-sm)] hover:bg-[var(--accent-hover)] transition-all duration-160 active:scale-[0.97]"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              إعادة المحاولة
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-md ln-card text-foreground font-semibold text-[length:var(--fs-sm)]"
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
