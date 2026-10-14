"use client"
import { useEffect, useRef } from "react"

/* Root error boundary — replaces <html> itself, so it ships its own markup
   and full-page dark styling (brand fallback) rather than relying on layout. */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    console.error("[smartlink] global error:", error?.message, error?.digest)
    /* r150: the focus-to-h1 contract — the segment twin ships it
       (error.tsx:20-25); the root boundary now announces the swap and
       lands keyboard focus on the heading the same way. */
    headingRef.current?.focus()
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
          /* P13-2a KODE retirement — KODE ink ground + paper text
             (was Madarek night #070B16 + sand #F2EFE6) */
          background: "#050507",
          color: "#F4F2ED",
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
              /* P13-2a KODE retirement: the orange wash — the dark
                 accent at 15% (was the Madarek gold wash) */
              background: "rgba(255, 76, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden="true"
          >
            {/* P10-1c (تقاعد الإيموجي — توأم SO P9-3-d): رمز ⚠️ النصي
                كان آخر إيموجي في واجهة المستودع؛ أيقونات الواجهة SVG
                (عائلة lucide) هنا. مخطط alert-triangle مُضمَّن حرفياً
                (هذا الحدّ يُبحر بلا حزمة CSS/بلا قطعة lucide — مذهب
                «قيم فقط» الحدودي نفسه). P13-2a KODE retirement: الحبر
                = برتقال كود #FF4C00 (≈5.5:1 على الغسيل الممزوج
                بأرض الحبر الداكنة). */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF4C00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          {/* r132 (A6 §7-8): weight 700 — the brand tops at 700 (Plex has
              no 800 cut; the parity gate bans 800-weight utilities in TSX,
              and this inline 800 had escaped it). */}
          <h1
            ref={headingRef}
            tabIndex={-1}
            style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", outline: "none" }}
          >
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
                height: 44,
                padding: "0 20px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 10,
                border: "none",
                /* P13-2a KODE retirement — the KODE accent recipe:
                   safety-orange fill + ink #050507 on it (≈6.3:1;
                   was Madarek gold #E9B44C + #05070F) */
                background: "#FF4C00",
                color: "#050507",
                /* r150 (20-IDEAL-CTA completion): the full fleet
                   button canon 44/13/600/r10 as INLINE values
                   (no CSS bundle on this boundary — A6: "values only");
                   was the r131 height-40 rung retired by the family
                   44/48/52 canon. */
                fontWeight: 600,
                fontSize: 13,
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
                height: 44,
                padding: "0 20px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                /* P13-2a KODE retirement: paper text on the ghost twin
                   (was sand #F2EFE6) */
                color: "#F4F2ED",
                /* r150 (20-IDEAL-CTA completion): 44/13/600/r10 —
                   the ghost twin of the orange button above (inline
                   values only on this boundary). */
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
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
