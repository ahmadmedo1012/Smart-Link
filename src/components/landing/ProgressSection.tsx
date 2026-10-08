"use client"

import { RevealCssClass } from "@/hooks/useReveal"
import { useSectionProgress } from "@/hooks/useSectionProgress"
import { CountUp } from "@/components/ui/CountUp"

/* r128 Stage B (F2b) — Chapter 03 «التقدّم»: the progress story
 * (canonical LandingPage.tsx:498-555 anatomy). A SECOND useSectionProgress
 * instance scrubs the expanding ring system (scale / ring opacity / violet
 * core growth / milestone ignition, all pure CSS on --sp), while CountUp
 * carries the platform's REAL figures — the four values every other
 * surface of this site already publishes (hero stats, about, CTA).
 * NEVER Madarek's numbers. */

/* r129 P0-13: the unit glyph rides the canonical .ln-stat-unit span
 * (24px, cream-dim) — canonical anatomy is CountUp number + unit span
 * (LandingPage.tsx:533-551); whole-string stats rendered the unit at
 * the full 40px cream, one size-class louder than canonical. */
const STATS: Array<{ value: string; unit: string; label: string; note: string }> = [
  { value: "+500", unit: "", label: "عميل نشط", note: "يعتمدون على منصّة SmartLink" },
  { value: "+10K", unit: "", label: "منيو رقمي", note: "عبر خدمة Smart Menu" },
  { value: "+50K", unit: "", label: "رد آلي", note: "أرسلها SmartBot نيابةً عنهم" },
  { value: "99.9", unit: "%", label: "جهوزية المنصّة", note: "التزام تشغيلي معلن" },
]

export function ProgressSection() {
  /* the second --sp — written on #progress, consumed by the ring system. */
  const ref = useSectionProgress<HTMLElement>()

  return (
    <section id="progress" ref={ref} className="ln-chapter ln-progress">
      <div className="ln-progress-grid">
        <div className="ln-progress-visual" aria-hidden="true">
          <div className="ln-progress-orbits">
            {/* expanding orbit system — scale / ring opacity / core growth /
                milestone ignition are all scrubbed by the section's --sp */}
            <span className="ln-progress-ring r0" />
            <span className="ln-progress-ring r1" />
            <span className="ln-progress-ring r2" />
            <span className="ln-progress-ring r3" />
            <span className="ln-progress-core" />
            <span className="ln-progress-milestone m0" />
            <span className="ln-progress-milestone m1" />
            <span className="ln-progress-milestone m2" />
            <span className="ln-progress-milestone m3" />
            <span className="ln-progress-label"><span className="ln-mono">GROW · المنظومة تتّسع</span></span>
          </div>
        </div>

        <div className="ln-progress-copy">
          <span className="ln-label">{"03 — التقدّم"}</span>
          <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
            منصّتك تكبر مع <em>كلّ رابط</em>
          </RevealCssClass>
          <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
            تقارير وإحصائيات دقيقة داخل كل خدمة: طلبات المنيو لحظة بلحظة،
            ردود البوت وتصنيفاتها، وإحصائيات جمهورك — أرقام حقيقية من لوحة
            تحكم عربية، بصياغة تخدم قرارك.
          </RevealCssClass>

          <div className="ln-progress-stats">
            {STATS.map((s, i) => (
              <RevealCssClass as="div" className="ln-stat" key={s.label} delay={(i + 1) as 1 | 2 | 3 | 4}>
                <div className="ln-stat-value">
                  <CountUp value={s.value} />
                  {s.unit && <span className="ln-stat-unit">{s.unit}</span>}
                </div>
                <div className="ln-stat-label">{s.label}</div>
                <div className="ln-stat-note">{s.note}</div>
              </RevealCssClass>
            ))}
          </div>

          <RevealCssClass as="p" className="ln-progress-source" delay={4}>
            أرقام SmartLink الحقيقية — القيم نفسها المعروضة على المنصّة وفي موقعنا.
          </RevealCssClass>
        </div>
      </div>
    </section>
  )
}
