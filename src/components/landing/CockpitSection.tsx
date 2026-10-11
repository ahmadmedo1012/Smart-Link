"use client"

import { RevealCssClass } from "@/hooks/useReveal"
import { useSectionProgress } from "@/hooks/useSectionProgress"
import { CountUp } from "@/components/ui/CountUp"

/* r142 «الكوكبة الحية» — Chapter 03 «القيادة»: the mono data cockpit.
 * MERGES the old trust band + the progress-rings chapter into one
 * mission-control readout (the r142 mandate). What survives verbatim:
 * · the FOUR REAL platform figures (the values every surface publishes —
 *   never invented), CountUp-carried, SSR'd at final values;
 * · the canonical .ln-stat-value/.ln-stat-unit anatomy (parity pin);
 * · the .ln-trust class on the readout grid — retained deliberately as
 *   the e2e contract hook (sim-modes B2/D5 read `.ln-trust .ln-mono`,
 *   four stats, each starting with a digit/+);
 * · useSectionProgress's --sp scrubbing the cockpit's live sweep.
 * What is NEW: the console framing (status strip + hairline readout
 * rows), the mono machine voice, and the sweep dial driven by --sp. */

const STATS: Array<{ value: string; unit: string; label: string; note: string }> = [
  { value: "+500", unit: "", label: "عميل نشط", note: "يعتمدون على منصّة SmartLink" },
  /* r142: القيمة واللاحقة سلسلة واحدة (+10K) — عقد LCP/e2e يثبّت
     القيم النهائية الحرفية في HTML الخام، والفصل الطباعي للوحدة كان
     يكسر الحرفية. .ln-stat-unit يبقى في العقد للوحات مستقبلية. */
  { value: "+10K", unit: "", label: "منيو رقمي", note: "عبر خدمة Smart Menu" },
  { value: "+50K", unit: "", label: "رد آلي", note: "أرسلها SmartBot نيابةً عنهم" },
  { value: "99.9%", unit: "", label: "جهوزية المنصّة", note: "التزام تشغيلي معلن" },
]

export function CockpitSection() {
  /* --sp on this section scrubs the sweep dial (pure CSS on the var). */
  const ref = useSectionProgress<HTMLElement>()

  return (
    <section id="progress" ref={ref} className="ln-chapter ln-cockpit">
      <div className="ln-chapter-head">
        <span className="ln-label">{"03 — القيادة"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          منصّتك تكبر مع <em>كلّ رابط</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          تقارير وإحصائيات دقيقة داخل كل خدمة: طلبات المنيو لحظة بلحظة،
          ردود البوت وتصنيفاتها، وإحصائيات جمهورك — أرقام حقيقية من لوحة
          تحكم عربية، بصياغة تخدم قرارك.
        </RevealCssClass>
      </div>

      <RevealCssClass as="div" className="ln-cockpit-panel" delay={2}>
        {/* the console status strip (decorative chrome) */}
        <div className="ln-cockpit-status" aria-hidden="true">
          <span className="ln-cockpit-live" />
          <span className="ln-mono">TELEMETRY · قمرة القيادة</span>
          <span className="ln-cockpit-status-tag ln-mono">SRC · أرقام المنصّة</span>
        </div>

        <div className="ln-cockpit-grid">
          {/* the sweep dial — a --sp-scrubbed conic scan (aria-hidden) */}
          <div className="ln-cockpit-scope" aria-hidden="true">
            <span className="ln-cockpit-scope-ring r0" />
            <span className="ln-cockpit-scope-ring r1" />
            <span className="ln-cockpit-scope-sweep" />
            <span className="ln-cockpit-scope-core" />
            <span className="ln-cockpit-scope-label"><span className="ln-mono">SCAN · المنظومة تتّسع</span></span>
          </div>

          {/* the readout — .ln-trust rides as the e2e contract hook
              (four .ln-mono stats, each beginning with its value) */}
          <div className="ln-cockpit-readout ln-trust">
            {STATS.map((s) => (
              <div className="ln-stat" key={s.label}>
                <div className="ln-stat-value ln-mono">
                  <CountUp value={s.value} />
                  {s.unit && <span className="ln-stat-unit">{s.unit}</span>}
                </div>
                <div className="ln-stat-label">{s.label}</div>
                <div className="ln-stat-note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>

        <RevealCssClass as="p" className="ln-cockpit-source" delay={3}>
          أرقام SmartLink الحقيقية — القيم نفسها المعروضة على المنصّة وفي
          موقعنا.
        </RevealCssClass>
      </RevealCssClass>
    </section>
  )
}
