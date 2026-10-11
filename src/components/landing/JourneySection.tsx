"use client"

import { UserPlus, Smartphone, SlidersHorizontal, Share2, Zap } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { useSectionProgress } from "@/hooks/useSectionProgress"

/* r142 «الكوكبة الحية» — Chapter 02 «الرحلة»: the planetary-winding path.
 * The measured SVG serpentine (JourneyLightPath) is retired for a PURE
 * CSS vertical beam: a hairline spine at the stage's center, a lit
 * segment + a travelling bead scrubbed by the section's --sp
 * (useSectionProgress — native scrolling, no hijacking, reduced-motion
 * pins --sp to 1 = the fully-lit final state). Five stations alternate
 * across the spine on desktop (the winding), stack on the gutter on
 * mobile. The five stations are the page's REAL journey — every desc
 * traces to shipped copy (r128 content truth; r140 station-02 counts
 * the three live products). */

const STATIONS: Array<{
  n: string
  icon: typeof UserPlus
  title: string
  desc: string
  tag: string
}> = [
  {
    n: "01", icon: UserPlus, title: "أنشئ حسابك المجاني",
    desc: "حساب واحد على SmartLink — مجاناً وبدون بطاقة ائتمان. دقائق معدودة تفصلك عن الانطلاق.",
    tag: "مجاناً",
  },
  {
    /* r140 (صدق الثلاثية — تدقيق A140-SL #3): المحطة تعدّ ثلاثة
     * منتجات — الصيغة توازية: لمطعمك/لصفحتك/لأعمالك. */
    n: "02", icon: Smartphone, title: "اختر خدمتك",
    desc: "منيو رقمي لمطعمك، أو بوت ذكي لصفحتك، أو متجر طلبات لأعمالك — كل خدمة تُجهَّز من لوحة تحكم عربية واحدة.",
    tag: "التهيئة",
  },
  {
    n: "03", icon: SlidersHorizontal, title: "الإعداد السريع",
    desc: "أضف قائمتك أو جهّز ردودك عبر خطوات إعداد موجّهة بالعربية — الإعداد كله لا يأخذ وقتاً طويلاً.",
    tag: "الإعداد",
  },
  {
    n: "04", icon: Share2, title: "شارك رابطك",
    desc: "رابط واحد لكل أعمالك: على واتساب وفيسبوك، أو QR كود على الطاولات — عملاؤك يصلون بنقرة.",
    tag: "الانطلاق",
  },
  {
    n: "05", icon: Zap, title: "استقبل وردّ آلياً",
    desc: "طلبات المنيو تصلك على واتساب فوراً، والبوت يردّ على عملاء فيسبوك نيابةً عنك — وأنت تركّز على عملك.",
    tag: "الأتمتة",
  },
]

export function JourneySection() {
  /* --sp on this section scrubs the beam's lit segment + bead. */
  const ref = useSectionProgress<HTMLElement>()

  return (
    <section id="journey" ref={ref} className="ln-chapter ln-journey">
      <div className="ln-chapter-head">
        <span className="ln-label">{"02 — الرحلة"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          من نقرة إلى <em>أتمتة</em> — خمس محطات
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          شعاعٌ واحد يلتوي بين محطاتك؛ كل محطة تبني على ما قبلها حتى
          يكتمل المسار.
        </RevealCssClass>
      </div>

      <div className="ln-journey-stage">
        {/* the winding beam — spine + lit segment + travelling bead,
            all scrubbed by --sp (pure CSS; geometry-free by design) */}
        <div className="ln-beam" aria-hidden="true">
          <span className="ln-beam-line" />
          <span className="ln-beam-lit" />
          <span className="ln-beam-head" />
        </div>

        <ol className="ln-journey-stations">
          {STATIONS.map((s, i) => (
            <RevealCssClass
              as="li"
              key={s.n}
              className={`ln-station${i % 2 === 0 ? " from-start" : " from-end"}`}
              delay={(i + 1) as 1 | 2 | 3 | 4 | 5}
            >
              <span className="ln-station-node" aria-hidden="true">
                <span className="ln-station-node-core" />
              </span>
              <article className="ln-station-card">
                <header className="ln-station-head">
                  <span className="ln-mono ln-station-n">{s.n}</span>
                  <span className="ln-station-ico" aria-hidden="true"><s.icon size={20} /></span>
                  <span className="ln-station-tag">{s.tag}</span>
                </header>
                <h3 className="ln-station-title">{s.title}</h3>
                <p className="ln-station-desc">{s.desc}</p>
              </article>
            </RevealCssClass>
          ))}
        </ol>
      </div>
    </section>
  )
}
