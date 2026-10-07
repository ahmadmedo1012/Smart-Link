"use client"
import { useEffect } from "react"

/* Root error boundary — replaces <html> itself, so it ships its own markup
   and full-page dark styling (brand fallback) rather than relying on layout. */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[smartlink] global error:", error?.message, error?.digest)
  }, [error])

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          /* m15: Madarek night — ground #070B16, sand ink #F2EFE6 */
          background: "#070B16",
          color: "#F2EFE6",
          fontFamily: "system-ui, 'Segoe UI', Tahoma, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              margin: "0 auto 24px",
              /* m15: gold wash — the dark accent at 15% */
              background: "rgba(233, 180, 76, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
            aria-hidden="true"
          >
            ⚠️
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px" }}>
            حدث خطأ في المنصة
          </h1>
          <p style={{ opacity: 0.75, lineHeight: 1.9, margin: "0 0 32px" }}>
            نعتذر — حدث خطأ تقني غير متوقع. فريقنا يعمل على إصلاحه.
            يمكنك إعادة المحاولة أو العودة لاحقاً.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                /* m15: Madarek .btn.accent dark — gold fill + dark ink
                   (#05070F on #E9B44C ≈ 10.6:1; white was 1.9:1) */
                background: "#E9B44C",
                color: "#05070F",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              إعادة المحاولة
            </button>
            {/* Plain <a> (not <Link>) on purpose: this boundary replaces the
                whole <html> after a catastrophic client failure — a full page
                reload clears the broken client state; client-side nav would
                reuse the very runtime that just crashed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                color: "#f5f5f7",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              العودة للرئيسية
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
