"use client"

import { RevealCssClass } from "@/hooks/useReveal"
import { useSectionProgress } from "@/hooks/useSectionProgress"
import { CountUp } from "@/components/ui/CountUp"

/* r142 «الكوكبة الحية» — Chapter 03 «القيادة»: the mono data cockpit.
 * MERGES the old trust band + the progress-rings chapter into one
 * mission-control readout (the r142 mandate). What survives verbatim:
 * · the canonical .ln-stat-value/.ln-stat-unit anatomy (parity pin);
 * · the .ln-trust class on the readout grid — retained deliberately as
 *   the e2e contract hook (sim-modes B2/D5 read `.ln-trust .ln-mono`,
 *   four stats, each starting with a digit/+);
 * · useSectionProgress's --sp settling the gauge ring's presence.
 * What is NEW: the console framing (status strip + hairline readout
 * rows), the mono machine voice, and the completed gauge dial whose
 * presence settles with --sp (P32: the conic sweep retired).
 *
 * r143 (الصدق): القيم الأربع القديمة (+500 عميل نشط، +10K منيو،
 * +50K رد آلي، 99.9% جهوزية) كانت أرقامًا بلا مصدر — منشورة كنص
 * ثابت في الكود لا من أي API، وتناقضت مع السطح الحيّ للأخت
 * SmartBot الذي يعرض أرقام /api/public/stats الحقيقية (4 صفحات،
 * 2 رد) للزائر نفسه. استُبدلت بأربع قيم منشورة قابلة للتحقق من
 * المنظومة نفسها في دقيقة: ثلاثة منتجات حيّة (المواقع الثلاث تعمل)،
 * أقل باقة SmartBot مدفوعة 19 د.ل شهريًا (صفحة الأسعار الحية
 * وواجهة /api/plans)، باقة Smart Order الأساسية 0 د.ل للأبد
 * (كتالوجها المنشور)، وواجهة عربية 100% (RTL كامل عبر المواقع
 * الأربعة). لا رقم إلا له دليل يعود إليه الزائر. */

const STATS: Array<{ value: string; unit: string; label: string; note: string }> = [
  { value: "3", unit: "", label: "منتجات حيّة", note: "منيو وبوت ومتجر طلبات تعمل اليوم" },
  /* r143: القيمة واللاحقة منفصلتان طبعاعيًا (19 + د.ل عبر
     .ln-stat-unit) — العقد الطباعي كما صُمم، والقيمة النهائية
     الحرفية محفوظة في HTML الخام للعدّاد نفسه. */
  { value: "19", unit: "د.ل", label: "أقل باقة SmartBot", note: "شهريًا — والمجانية 100 رد في الشهر" },
  { value: "0", unit: "د.ل", label: "باقة Smart Order الأساسية", note: "مجانية للأبد — بلا رسوم دخول" },
  { value: "100%", unit: "", label: "واجهة عربية", note: "RTL كامل عبر المنظومة" },
]

export function CockpitSection() {
  /* --sp on this section scrubs the sweep dial (pure CSS on the var). */
  const ref = useSectionProgress<HTMLElement>()

  return (
    <section id="progress" ref={ref} className="ln-chapter ln-cockpit">
      <div className="ln-chapter-head">
        <span className="ln-label ln-mono">{"003 — القيادة"}</span>
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
          {/* P32: the dial is a COMPLETED status gauge — a full gold ring
              (never a partial wedge) stating its own verifiable datum:
              3/3 services live (the three product sites — same evidence
              class as the readout's r143 stats). The r142 conic sweep
              retired: independent review (P31-V residue + a fresh VLM
              pass) read its static 90° wedge as a frozen loading spinner,
              and the dial carried no labeled data of its own. */}
          <div className="ln-cockpit-scope" aria-hidden="true">
            <span className="ln-cockpit-scope-ring r0" />
            <span className="ln-cockpit-scope-ring r1" />
            <span className="ln-cockpit-scope-arc" />
            <span className="ln-cockpit-scope-core" />
            <span className="ln-cockpit-scope-label"><span className="ln-mono">STATUS · 3/3 خدمات حيّة</span></span>
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
          قيم منشورة من المنظومة نفسها — تتحقق منها بنفسك في دقيقة.
        </RevealCssClass>
      </RevealCssClass>
    </section>
  )
}
