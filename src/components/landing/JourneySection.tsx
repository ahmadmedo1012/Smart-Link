"use client"

import { RevealCssClass } from "@/hooks/useReveal"
import { useSectionProgress } from "@/hooks/useSectionProgress"

/* P12-2a (r160 KODE) — Chapter 002 «الرحلة» re-cast as the ORANGE FLOOD
 * (the spec's S4): flat #FF4C00 ground, black text, mono indices 001–005,
 * hairline rules. The winding beam + station cards retire; the five
 * stations become editorial type-rows (index / title / desc / tag), each
 * real copy verbatim (r128 content truth; r140 station-02 counts the
 * three live products). useSectionProgress's --sp survives: it lights
 * the rows' rule sequentially as the chapter scrubs. */

const STATIONS: Array<{ n: string; title: string; desc: string; tag: string }> = [
  {
    /* W2-A1 (صدق الحساب — تدقيق W2-R1): «حساب واحد على SmartLink»
     * ادعاء بلا مصدر — المظلة بلا تسجيل، ولكل منتج حسابه المستقل.
     * المحطة تسجّل الآن في الخدمة نفسها. */
    n: "001", title: "أنشئ حسابك المجاني",
    desc: "سجّل مجاناً في الخدمة التي تريدها — بدون بطاقة ائتمان. دقائق معدودة تفصلك عن الانطلاق.",
    tag: "مجاناً",
  },
  {
    /* r140 (صدق الثلاثية — تدقيق A140-SL #3): المحطة تعدّ ثلاثة
     * منتجات — الصيغة توازية: لمطعمك/لصفحتك/لأعمالك. */
    n: "002", title: "اختر خدمتك",
    desc: "منيو رقمي لمطعمك، أو بوت ذكي لصفحتك، أو متجر طلبات لأعمالك — كل خدمة تُجهَّز من لوحة تحكم عربية خاصة بها.",
    tag: "التهيئة",
  },
  {
    n: "003", title: "الإعداد السريع",
    desc: "أضف قائمتك أو جهّز ردودك عبر خطوات إعداد موجّهة بالعربية — الإعداد كله لا يأخذ وقتاً طويلاً.",
    tag: "الإعداد",
  },
  {
    n: "004", title: "شارك رابطك",
    desc: "رابط واحد لكل أعمالك: على واتساب وفيسبوك، أو QR كود على الطاولات — عملاؤك يصلون بنقرة.",
    tag: "الانطلاق",
  },
  {
    n: "005", title: "استقبل وردّ آلياً",
    desc: "طلبات المنيو تصلك على واتساب فوراً، والبوت يردّ على عملاء فيسبوك نيابةً عنك — وأنت تركّز على عملك.",
    tag: "الأتمتة",
  },
]

export function JourneySection() {
  /* --sp on this section lights the rows' rules as the flood scrubs. */
  const ref = useSectionProgress<HTMLElement>()

  return (
    <section id="journey" ref={ref} className="ln-chapter ln-journey ln-journey--kode">
      <header className="ln-chapter-head ln-chapter-head--flood">
        <span className="ln-label ln-mono">{"002 — الرحلة"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title ln-chapter-title--kode" delay={1}>
          من نقرة إلى <em>أتمتة</em> — خمس محطات
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          خمس محطات متتالية؛ كل محطة تبني على ما قبلها حتى يكتمل المسار.
        </RevealCssClass>
      </header>

      <ol className="ln-journey-rows">
        {STATIONS.map((s, i) => (
          <RevealCssClass
            as="li"
            key={s.n}
            className="ln-journey-row"
            style={{ ["--row" as string]: i }}
            delay={(i + 1) as 1 | 2 | 3 | 4 | 5}
          >
            <span className="ln-journey-row-n ln-mono">{s.n}</span>
            <h3 className="ln-journey-row-title">{s.title}</h3>
            <p className="ln-journey-row-desc">{s.desc}</p>
            <span className="ln-journey-row-tag ln-mono">{s.tag}</span>
          </RevealCssClass>
        ))}
      </ol>
    </section>
  )
}
