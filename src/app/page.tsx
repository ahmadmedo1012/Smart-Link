/* P12-2a (r160 KODE) — «الرابط والمنظومة»: the Smart-Link landing
   re-skinned in the KODE Immersive translation (P12 spec): a 3-line
   Kufi type-block hero with the chain sculpture in the negative-space
   diamond, orange flood chapters, black chapter stages, mono status
   chrome, and the brutalist 3-color discipline (ink/paper/orange). All
   real Arabic content, links, FAQ and footer survive verbatim.
   ════════════════════════════════════════════════════════════════════ */
import "./landing.css"
import { Check, MessageCircle, Languages } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { SITE } from "@/lib/site"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { ChainSculptureMount } from "@/components/landing/ChainSculptureMount"
import { MagneticGoldLink } from "@/components/landing/MagneticGoldLink"
import { LandingMarquee } from "@/components/landing/LandingMarquee"
import { WorldsSection } from "@/components/landing/WorldsSection"
import { JourneySection } from "@/components/landing/JourneySection"
import { CockpitSection } from "@/components/landing/CockpitSection"
import { PlatformsSection } from "@/components/landing/PlatformsSection"
import { FinaleCta } from "@/components/landing/FinaleCta"
import { LandingFaq } from "@/components/landing/LandingFaq"
import { LandingFooter } from "@/components/landing/LandingFooter"

/* Marquee vocabulary — the real product/service names from the services
   registry (three live products + their shipped feature list), ×2 by the
   marquee kit for the seamless 42s RTL loop. r129 (P2-10): 15 entries so
   ONE copy (≈2.7–3.2k px) still fills ≥2200px viewports — the seam math
   assumes copy-1 ≥ viewport. The three additions are the platform's own
   verifiable claims (one account, Arabic-first, a direct WhatsApp line).
   r144 (صدق P4-4SL): «دعم واتساب 24/7» كان ادعاءً بلا عملية دعم خلفه —
   استُبدل بالقناة الحقيقية نفسها بلا وعد ساعات. */
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
  /* r137 (صدق الأسطول): Smart-Order حيّ — مطالباته من واجهته
     المنشورة (متجر يعمل فوراً / طلبات وتوصيل / مدفوعات محلية). */
  "Smart Order",
  "متجر الطلبات الرقمي",
  "طلبات وتوصيل",
  "مدفوعات ليبية",
  "حساب واحد لكل الخدمات",
  "واجهة عربية بالكامل",
  "تواصل واتساب مباشر",
]

export default function Home() {
  return (
    <div className="landing">
      {/* r129 P2-2 (canonical P3-24): the landing's own skip link — lime
          pill, centered, ABOVE the grain veil (z-2100). First Tab stop;
          15-SL: the root layout no longer renders a global #main-content
          pill at all (it moved into SiteChrome where its target lives) —
          this is the route's ONE skip link, no hidden dead twin. */}
      <a href="#main" className="ln-skip-link">تخطَّ إلى المحتوى</a>

      <LandingHeader />

      {/* r129 P0-28: id="main" + tabIndex — the canonical skip-target
          anatomy (LandingPage.tsx:340); the attribute makes programmatic
          focus land cleanly after the skip. */}
      <main id="main" tabIndex={-1}>
        {/* ═══ الفصل ٠ — القفل الطباعي + السلسلة: the KODE type-block hero
             (P12-2a r160). 3-line Kufi lockup, the real headline re-broken
             so the SHORT middle line carves the diamond of negative space
             the chain sculpture occupies (canvas BEHIND text, never holds
             content hostage). No traditional button CTA carries the hero —
             the scroll cue + the object do. */}
        <section className="ln-hero ln-hero--kode" aria-label="SmartLink — منصّة الروابط الذكية">
          {/* the sculpture stage: 7 interlocked torus links, studio-lit,
              drag-rotatable, theme-aware, DPR-capped, RM poster frame */}
          <div className="ln-hero-sky">
            <ChainSculptureMount className="ln-hero-canvas" />
          </div>

          <div className="ln-hero-content">
            <RevealCssClass as="p" className="ln-hero-eyebrow">
              <span className="ln-hero-wordmark" aria-hidden="true">SMART LINK</span>
              <span className="ln-mono">[ SMART LINK — 001 ]</span>
              <span className="ln-mono">[ LIBYA ]</span>
            </RevealCssClass>

            {/* h1 paints INSTANTLY — server-rendered inline, no reveal, no
                client gate (LCP doctrine). 3 lines: كل عملٍ يبدأ / رابطًا /
                ويصبح منظومةً — the middle line is the short one; the one
                orange word is رابطًا (the link → the chain under it). */}
            <h1 className="ln-hero-title">
              <span className="ln-hero-line">كلُّ عملٍ يبدأ</span>
              <span className="ln-hero-line ln-hero-line--mid">
                <em>رابطًا</em>
              </span>
              <span className="ln-hero-line">ويصبح <em>منظومةً</em></span>
            </h1>

            <p className="ln-hero-sub">
              {/* r138 (إكمال صدق الأسطول — موجة r137 الفائتة): العدّ
                  الثلاثي بدل «من… إلى» الثنائي. */}
              منصّة ليبية تجمع حلولنا الرقمية في مكانٍ واحد: المنيو الرقمي
              التفاعلي للمطاعم، والبوت الذكي لصفحات فيسبوك، ومتجر الطلبات
              الرقمي —{" "}
              <strong>كل ما تحتاجه لتنمية أعمالك خلف رابط واحد.</strong>
            </p>

            <RevealCssClass as="div" className="ln-hero-actions" delay={3}>
              <MagneticGoldLink href={SITE.products.menu.url} external withArrow ariaLabel="ابدأ مجاناً — Smart Menu، رابط خارجي">
                ابدأ مجاناً
              </MagneticGoldLink>
              <a href="#products" className="ln-btn-ghost">اكتشف العوالم</a>
            </RevealCssClass>

            <RevealCssClass as="ul" className="ln-hero-meta" delay={5}>
              <li><Check size={12} aria-hidden="true" /> بدون بطاقة ائتمان</li>
              <li aria-hidden="true" className="ln-hero-meta-dot" />
              {/* r144 (صدق P4-4SL): بلا وعد «24/7» — القناة نفسها هي
                  الحقيقة القابلة للتحقق (wa.me بفتّاحة مصدرها، site.ts). */}
              <li><MessageCircle size={12} aria-hidden="true" /> تواصل واتساب مباشر</li>
              <li aria-hidden="true" className="ln-hero-meta-dot" />
              <li><Languages size={12} aria-hidden="true" /> واجهة عربية بالكامل</li>
            </RevealCssClass>
          </div>

          {/* scroll invitation — into the worlds chapter (S5 bilingual cue) */}
          <a href="#products" className="ln-hero-scroll" aria-label="تابع الرحلة">
            <span className="ln-mono">SCROLL — تصفّح</span>
            <span className="ln-hero-scroll-line" aria-hidden="true" />
          </a>
        </section>

        {/* ═══ شريط البث — the data broadcast ═══ */}
        <LandingMarquee items={MARQUEE_ITEMS} />

        {/* ═══ الفصل ١ — العوالم (three editorial worlds; replaces the
             products-constellation + roles-ledger pair) ═══ */}
        <WorldsSection />

        {/* ═══ الفصل ٢ — الرحلة: the winding beam ═══ */}
        <JourneySection />

        {/* ═══ الفصل ٣ — القيادة: the mono data cockpit (the old trust
             band + progress story merged) ═══ */}
        <CockpitSection />

        {/* ═══ المنصّات — ground control (unlabelled, canonical) ═══ */}
        <PlatformsSection />

        {/* ═══ الفصل ٤ — نقطة البداية (massive type; the FAQ merges
             visually below in the same ground) ═══ */}
        <FinaleCta />

        {/* ═══ الأسئلة الشائعة — compact, ln-styled, JSON-LD intact ═══ */}
        <LandingFaq />
      </main>

      <LandingFooter />

      {/* film-grain texture layer — last child, painted over the whole world */}
      <div className="ln-grain" aria-hidden="true" />
    </div>
  )
}
