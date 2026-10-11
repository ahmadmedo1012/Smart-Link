import Link from "next/link"
import { Sparkles } from "lucide-react"
import Image from "next/image"
import { RevealCssClass } from "@/hooks/useReveal"
import { MagneticGoldLink } from "@/components/landing/MagneticGoldLink"
import { CurrentYear } from "@/components/current-year"
import { SITE } from "@/lib/site"

/* r129 — Chapter 05 «الوصول» (canonical numbering — was 06 before the
 * platforms chapter went unlabelled): the starting point (canonical
 * LandingPage.tsx:698-727 anatomy). Converging orbit rings, magnetic
 * gold CTA (useMagnetic(7)) + ghost. Copy folds the home's shipped CTA
 * section (أكثر من 500 عميل… / ابدأ التجربة / تواصل معنا).
 * r140 (تدقيق A140-SL ‎#6): سنة التوقيع تُرخّ عبر جزيرة CurrentYear —
 * نفس فئة ثغرة r126 (سنة مجمّدة زمن البناء) التي أُغلقت في التذييل
 * الداخلي ولم تُنسخ هنا. */

export function FinaleCta() {
  /* buildYear — يُخبَز في HTML، والجزيرة تُرطّب السنة الحية (r126). */
  const year = new Date().getFullYear()

  return (
    <section className="ln-cta" aria-label="ابدأ رحلتك">
      {/* converging orbits */}
      <div className="ln-cta-orbits" aria-hidden="true">
        <span className="ln-cta-orbit o0" />
        <span className="ln-cta-orbit o1" />
        <span className="ln-cta-orbit o2" />
      </div>
      <div className="ln-cta-inner">
        {/* r141 (task 3-b): the family crest — the three worlds (plate /
         * orb / box) joined by golden threads, the generated family art
         * as the closing emblem. Masked into the ink stage, slow float
         * (reduced-motion stands still). aria-hidden — decorative; the
         * words around it carry the meaning. */}
        <RevealCssClass as="div" className="ln-cta-family">
          <Image
            src="/images/ecosystem/family.webp"
            alt=""
            aria-hidden="true"
            width={520}
            height={520}
            sizes="260px"
            className="ln-cta-family-img"
          />
        </RevealCssClass>
        <span className="ln-label">{"05 — الوصول · ACCESS"}</span>
        <RevealCssClass as="h2" className="ln-cta-title" delay={1}>
          رابطك الأول <em>يبدأ من هنا</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-cta-lede" delay={2}>
          أكثر من 500 عميل يثقون بنا — انضم إليهم وابدأ رحلتك الرقمية مع
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
