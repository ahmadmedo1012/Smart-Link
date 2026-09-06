"use client"
import { useEffect } from "react"
import Link from "next/link"

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
          background: "#0d0d14",
          color: "#f5f5f7",
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
              background: "rgba(188, 71, 0, 0.15)",
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
                background: "#bc4700",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              إعادة المحاولة
            </button>
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
