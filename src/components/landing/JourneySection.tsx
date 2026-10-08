"use client"

import { UserPlus, Smartphone, SlidersHorizontal, Share2, Zap } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { useSectionProgress } from "@/hooks/useSectionProgress"
import { JourneyLightPath } from "@/components/landing/JourneyLightPath"

/* r128 Stage B (F2b) — Chapter 02 «الربط»: the 5-station journey
 * (canonical LandingPage.tsx:456-494 anatomy). The stations fold the
 * home's real how-it-works/FAQ content (3 steps + quick-setup answer)
 * into Madarek's 5-station rhythm — every desc traces to shipped copy,
 * nothing invented. Client component: useSectionProgress writes --sp on
 * the section, JourneyLightPath's lit thread scrubs with it
 * (stroke-dashoffset: calc(1 - var(--sp))) — pure CSS scrub, native
 * scrolling, no hijacking. */

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
    n: "02", icon: Smartphone, title: "اختر خدمتك",
    desc: "منيو رقمي لمطعمك، أو بوت ذكي لصفحتك على فيسبوك — كل خدمة تُجهَّز من لوحة تحكم عربية واحدة.",
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
  /* --sp on this section scrubs the light path (and the chapter wash). */
  const ref = useSectionProgress<HTMLElement>()

  return (
    <section id="journey" ref={ref} className="ln-chapter ln-journey">
      <div className="ln-chapter-head">
        <span className="ln-label">{"02 — الربط"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          من نقرة إلى <em>أتمتة</em> — خمس محطات
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          خطّ ضوءٍ واحد يربط محطاتك؛ كل محطة تبني على ما قبلها.
        </RevealCssClass>
      </div>

      <div className="ln-journey-stage">
        {/* the light path — computed from the real station-node layout */}
        <JourneyLightPath />

        <ol className="ln-journey-stations">
          {STATIONS.map((s, i) => (
            <RevealCssClass
              as="li"
              key={s.n}
              className={`ln-station${i % 2 === 0 ? " from-start" : " from-end"}`}
              delay={(i + 1) as 1 | 2 | 3 | 4 | 5}
            >
              <article className="ln-station-card">
                <span className="ln-station-node" aria-hidden="true">
                  <span className="ln-station-node-core" />
                </span>
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
