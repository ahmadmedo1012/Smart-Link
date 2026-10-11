import Link from "next/link"
import { Sparkles } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { MagneticGoldLink } from "@/components/landing/MagneticGoldLink"
import { CurrentYear } from "@/components/current-year"
import { SITE } from "@/lib/site"

/* r142 «الكوكبة الحية» — Chapter 04 «الوصول»: نقطة البداية.
 * A TYPE-LED finale: the massive two-line display does the work — the
 * r141 family crest image is retired (the words + one converging ring
 * carry the closing). The aria-label «ابدأ رحلتك» is the e2e conversion
 * contract (cta.spec), the gold magnetic pill and the ghost keep their
 * canonical anatomy, and the year rides the CurrentYear island (r140).
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
          <Sparkles size={13} aria-hidden="true" />
          {/* r140: السنة الحية — توأم LandingFooter/footer.tsx (r126). */}
          SmartLink · <CurrentYear buildYear={year} />
        </RevealCssClass>
      </div>
    </section>
  )
}
