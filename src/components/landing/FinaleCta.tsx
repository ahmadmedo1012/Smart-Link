import Link from "next/link"
import { Sparkles } from "lucide-react"
import Image from "next/image"
import { RevealCssClass } from "@/hooks/useReveal"
import { MagneticGoldLink } from "@/components/landing/MagneticGoldLink"
import { CurrentYear } from "@/components/current-year"
import { SITE } from "@/lib/site"

/* r142 «الكوكبة الحية» — Chapter 04 «الوصول»: نقطة البداية.
 * A type-led finale: the massive two-line display does the work, and the
 * r141 family crest closes the chapter above it. (The r142 rewrite had
 * retired the crest image — a unilateral deviation from the r142 spec,
 * which promised «شعار العائلة الختامي (family.webp float)» and left a
 * ~1200px dead void before the footer; the production QA flagged the
 * contradiction as P1 and r144 (P4-4SL) restores the crest verbatim in
 * the new anatomy: masked circular art, slow float, reduced-motion
 * stands still, lazy below-fold image — LCP untouched.)
 * The aria-label «ابدأ رحلتك» is the e2e conversion contract (cta.spec),
 * the gold magnetic pill and the ghost keep their canonical anatomy, and
 * the year rides the CurrentYear island (r140).
 * The FAQ chapter merges visually below (same ground, shared seam) —
 * its six real Q&As + FAQPage JSON-LD are untouched. */

export function FinaleCta() {
  /* buildYear — يُخبَز في HTML، والجزيرة تُرطّب السنة الحية (r126). */
  const year = new Date().getFullYear()

  return (
    <section className="ln-cta" aria-label="ابدأ رحلتك">
      {/* the converging ring — one quiet verb, no spin */}
      <div className="ln-cta-orbits" aria-hidden="true">
        <span className="ln-cta-orbit o0" />
        <span className="ln-cta-orbit o2" />
      </div>
      <div className="ln-cta-inner">
        {/* r144 (P4-4SL، قرار P1): شعار العائلة الختامي يعود — فنّ العائلة
            المولّد (طبق + كرة روبوت + صندوق بخيوط ذهبية) يتوّج فصل الوصول
            كشعار عائم ببطء (masked دائرياً، float 9s يتوقف كاملة تحت
            reduced-motion). aria-hidden — ديكوري؛ الكلمات حوله تحمل المعنى،
            والصورة lazy تحت الطية فلا تمس LCP.
            15-SL (قبول 14-a P3): الخانة تصيّر min(240px,52vw) وsizes كانت
            «260px» — على DPR1 يكفي ذلك مرشّح 384 (1.6× فقط، دون الريتينا).
            sizes الآن «480px» = ضِعف الخانة: أصغر مرشّح ≥480 هو 640 (2.67×)
            حتى على شاشات 1×، و2× يطلب 960 فيلتقط 1080 (المُحسِّن يقصّه عند
            عرض المصدر 1024²) — لا تصعيد لاحق، والمصدر يتحمل. width/height
            تُضبط 480 لتوافق قصة الكثافة نفسها (نسبة 1:1 بلا تغيّر). */}
        <RevealCssClass as="div" className="ln-cta-family">
          <Image
            src="/images/ecosystem/family.webp"
            alt=""
            aria-hidden="true"
            width={480}
            height={480}
            sizes="480px"
            className="ln-cta-family-img"
          />
        </RevealCssClass>
        <span className="ln-label">{"04 — الوصول · ACCESS"}</span>
        <RevealCssClass as="h2" className="ln-cta-title" delay={1}>
          رابطك الأول{" "}
          <span className="ln-cta-line">يبدأ <em>من هنا</em></span>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-cta-lede" delay={2}>
          {/* r143 (الصدق): «أكثر من 500 عميل يثقون بنا» كان ادعاءً بلا
              مصدر — يحذف ولا يُبرَّر. السطر الجديد يروي الحقيقة
              القابلة للتحقق: المنتجات الثلاثة نفسها بلا بطاقة ائتمان. */}
          منيو وبوت ومتجر طلبات في رباط واحد — ابدأ رحلتك الرقمية مع
          SmartLink، مجاناً وبدون بطاقة ائتمان.
        </RevealCssClass>
        <RevealCssClass as="div" className="ln-cta-actions" delay={3}>
          <MagneticGoldLink href={SITE.products.menu.url} external xl withArrow ariaLabel="ابدأ التجربة — Smart Menu، رابط خارجي">
            ابدأ التجربة
          </MagneticGoldLink>
          <Link href="/contact" className="ln-btn-ghost xl">تواصل معنا</Link>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-cta-meta" delay={4}>
          <Sparkles size={12} aria-hidden="true" />
          {/* r140: السنة الحية — توأم LandingFooter/footer.tsx (r126). */}
          SmartLink · <CurrentYear buildYear={year} />
        </RevealCssClass>
      </div>
    </section>
  )
}
