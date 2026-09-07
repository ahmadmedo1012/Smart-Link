"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Mail } from "lucide-react"

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
    <div className="pt-28 pb-16 relative overflow-hidden">
      <div className="container-base relative">
        <div className="max-w-xl mx-auto text-center glass rounded-2xl p-10 reveal-up">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-[var(--glass-border)]" style={{ background: "var(--accent)" }}>
            <AlertTriangle className="w-8 h-8 text-[var(--primary)]" aria-hidden="true" />
          </div>
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold tracking-tight text-foreground mb-3 outline-none">
            حدث خطأ غير متوقع
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            نعتذر عن الإزعاج. حدث خطأ أثناء تحميل هذا القسم — يمكنك المحاولة مرة أخرى،
            وإن استمر الخطأ تواصل معنا وسنصلحه فوراً.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              إعادة المحاولة
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-foreground font-semibold text-sm hover:border-[var(--ring)]/40 transition-all duration-200"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
