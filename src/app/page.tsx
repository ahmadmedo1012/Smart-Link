/* r128 Stage B (F2b) — the Smart-Link landing rebuilt as the Madarek
   journey (PORT-KIT §5 skeleton, §6 Link column):
   المدار (hero sky) → شريط المنتجات (marquee) → الثقة → مدارات المنتجات
   → رحلة الربط (5 stations + light path) → قصة التقدّم (--sp rings)
   → المنصّات (ground plate) → الأدوار → نقطة البداية (+ compact FAQ).

   The page stays a SERVER component — the h1 and hero sub render inline
   (instant-paint LCP doctrine, r8/r9); client islands are exactly:
   LandingHeader (chrome/spy/menus), HeroDepthLayer (parallax),
   MagneticGoldLink (CTA pull), JourneySection (light path + --sp),
   ProgressSection (--sp + CountUp), and the RevealCssClass observers. */
import "./landing.css"
import { Fragment } from "react"
import { Check, MessageCircle, Languages } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { CountUp } from "@/components/ui/CountUp"
import { SITE } from "@/lib/site"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { HeroDepthLayer } from "@/components/landing/HeroDepthLayer"
import { HeroOrbits } from "@/components/landing/HeroOrbits"
import { MagneticGoldLink } from "@/components/landing/MagneticGoldLink"
import { LandingMarquee } from "@/components/landing/LandingMarquee"
import { ProductsSection } from "@/components/landing/ProductsSection"
import { JourneySection } from "@/components/landing/JourneySection"
import { ProgressSection } from "@/components/landing/ProgressSection"
import { PlatformsSection } from "@/components/landing/PlatformsSection"
import { RolesSection } from "@/components/landing/RolesSection"
import { FinaleCta } from "@/components/landing/FinaleCta"
import { LandingFaq } from "@/components/landing/LandingFaq"
import { LandingFooter } from "@/components/landing/LandingFooter"

/* Marquee vocabulary — the real product/service names from the services
   registry (two live products + their shipped feature list), ×2 by the
   marquee kit for the seamless 42s RTL loop. */
const MARQUEE_ITEMS = [
  "Smart Menu",
  "المنيو الرقمي للمطاعم",
  "طلبات عبر واتساب",
  "QR كود مخصص",
  "لوحة تحكم عربية",
  "برنامج ولاء وإحالات",
  "SmartBot",
  "البوت الذكي لفيسبوك",
  "ردود تلقائية ذكية",
  "تصنيف النوايا",
  "بث جماعي",
  "إدارة الصفحات",
]

/* Trust band — the four REAL platform figures (the values every surface
   of this site publishes; SSR'd final + CountUp on view). */
const TRUST_STATS = [
  { value: "+500", label: "عميل نشط" },
  { value: "+10K", label: "منيو رقمي" },
  { value: "+50K", label: "رد آلي" },
  { value: "99.9%", label: "جهوزية المنصّة" },
]

export default function Home() {
  return (
    <div className="landing">
      <LandingHeader />

      <main id="main-content">
        {/* ═══ الفصل ٠ — المدار: the hero sky ═══ */}
        <section className="ln-hero" aria-label="SmartLink — منصّة الروابط الذكية">
          {/* living sky: starfield depth plane + the products' orbit chart
              (flat SVG grammar — thin 1px cream/lime lines, nodes, horizon) */}
          <div className="ln-hero-sky" aria-hidden="true">
            <HeroDepthLayer />
            <HeroOrbits className="ln-hero-canvas" />
          </div>

          <div className="ln-hero-content">
            <RevealCssClass as="p" className="ln-hero-eyebrow">
              <span className="ln-mono">SmartLink · Smart Menu · SmartBot · ليبيا</span>
            </RevealCssClass>

            {/* h1 + sub paint INSTANTLY — server-rendered inline, no reveal,
                no client gate (LCP doctrine). One lime word: منظومة. */}
            <h1 className="ln-hero-title">
              <span className="ln-hero-line">كلُّ عملٍ يبدأ <em>رابطًا</em></span>
              <span className="ln-hero-line">ويصبح <em className="ln-hero-gold">منظومةً</em></span>
            </h1>

            <p className="ln-hero-sub">
              منصّة ليبية تجمع حلولنا الرقمية في مكانٍ واحد: من المنيو الرقمي
              التفاعلي للمطاعم إلى البوت الذكي لصفحات فيسبوك —{" "}
              <strong>كل ما تحتاجه لتنمية أعمالك خلف رابط واحد.</strong>
            </p>

            <RevealCssClass as="div" className="ln-hero-actions" delay={3}>
              <MagneticGoldLink href={SITE.products.menu.url} external withArrow ariaLabel="ابدأ مجاناً — Smart Menu، رابط خارجي">
                ابدأ مجاناً
              </MagneticGoldLink>
              <a href="#products" className="ln-btn-ghost">اكتشف المنتجات</a>
            </RevealCssClass>

            <RevealCssClass as="ul" className="ln-hero-meta" delay={4}>
              <li><Check size={13} aria-hidden="true" /> بدون بطاقة ائتمان</li>
              <li aria-hidden="true" className="ln-hero-meta-dot" />
              <li><MessageCircle size={13} aria-hidden="true" /> دعم واتساب 24/7</li>
              <li aria-hidden="true" className="ln-hero-meta-dot" />
              <li><Languages size={13} aria-hidden="true" /> واجهة عربية بالكامل</li>
            </RevealCssClass>
          </div>

          {/* scroll invitation */}
          <a href="#trust" className="ln-hero-scroll" aria-label="تابع الرحلة">
            <span className="ln-mono">تابع الرحلة</span>
            <span className="ln-hero-scroll-line" aria-hidden="true" />
          </a>
        </section>

        {/* ═══ شريط المنتجات — مدار واحد تنتظم فيه الأسماء (marquee) ═══ */}
        <LandingMarquee items={MARQUEE_ITEMS} />

        {/* ═══ الفصل ١ — الثقة (quiet mono DATA band, real figures) ═══ */}
        <section id="trust" className="ln-trust" aria-label="أرقام المنصّة">
          <div className="ln-trust-inner">
            {TRUST_STATS.map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 && <span className="ln-trust-sep" aria-hidden="true" />}
                <span className="ln-mono">
                  <CountUp value={s.value} /> {s.label}
                </span>
              </Fragment>
            ))}
          </div>
        </section>

        {/* ═══ الفصل ٢ — مدارات المنتجات ═══ */}
        <ProductsSection />

        {/* ═══ الفصل ٣ — كيف تعمل الروابط الذكية ═══ */}
        <JourneySection />

        {/* ═══ الفصل ٤ — قصّة التقدّم ═══ */}
        <ProgressSection />

        {/* ═══ الفصل ٥ — الأرض: عالم المنصّات ═══ */}
        <PlatformsSection />

        {/* ═══ الفصل ٦ — الأدوار ═══ */}
        <RolesSection />

        {/* ═══ الفصل ٧ — نقطة البداية ═══ */}
        <FinaleCta />

        {/* ═══ الأسئلة الشائعة — compact, ln-styled ═══ */}
        <LandingFaq />
      </main>

      <LandingFooter />

      {/* film-grain texture layer — last child, painted over the whole world */}
      <div className="ln-grain" aria-hidden="true" />
    </div>
  )
}
