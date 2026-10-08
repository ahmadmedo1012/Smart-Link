import Link from "next/link"
import { Sparkles } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { MagneticGoldLink } from "@/components/landing/MagneticGoldLink"
import { SITE } from "@/lib/site"

/* r128 Stage B (F2b) — Chapter 06 «الوصول»: the starting point
 * (canonical LandingPage.tsx:698-727 anatomy). Converging orbit rings,
 * magnetic gold CTA (useMagnetic(7)) + ghost. Copy folds the home's
 * shipped CTA section (أكثر من 500 عميل… / ابدأ التجربة / تواصل معنا). */

export function FinaleCta() {
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
        <span className="ln-label">{"06 — الوصول · ACCESS"}</span>
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
          SmartLink · {year}
        </RevealCssClass>
      </div>
    </section>
  )
}
