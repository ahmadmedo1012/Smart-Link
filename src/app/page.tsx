/* ════════════════════════════════════════════════════════════════════
   r142 «الكوكبة الحية» — the Smart-Link landing REBUILT as one living
   organism (the radical redesign: the owner rejected the incremental
   r141 pass; this is a new visual experience from the first screen to
   the last chapter, inspired by immersive-interactive references
   WITHOUT copying any identity).

   The r128 Orbit-Ink layer stays the GROUND (R4 isolation intact — the
   product token pins in styles.css are never touched; every --ln-*
   declaration lives inside .landing). What changes is the anatomy:
   المدار (the LIVING CONSTELLATION hero — real canvas, tappable worlds)
   → شريط البث (data broadcast) → العوالم (editorial world panels)
   → الرحلة (the winding beam) → القيادة (mono data cockpit)
   → المنصّات (ground control console) → نقطة البداية (massive type
   + merged FAQ).

   New world hues enter ONLY as tokens in §0a2: --ln-ember (Smart Menu),
   --ln-cyan (SmartBot), --ln-lime (Smart Order, the existing accent).
   The canvas engine resolves them at runtime via getComputedStyle —
   zero hex in any landing TSX (parity-enforced).

   The page stays a SERVER component — the h1 and hero sub render inline
   (instant-paint LCP doctrine, r8/r9); client islands are exactly:
   LandingHeader (chrome/spy/menus), EcosystemConstellation (the living
   canvas), ConstellationDock (world chips + glass preview card),
   MagneticGoldLink (CTA pull), JourneySection (beam + --sp),
   CockpitSection (--sp + CountUp), and the RevealCssClass observers.
   ════════════════════════════════════════════════════════════════════ */
import "./landing.css"
import { Check, MessageCircle, Languages } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { SITE } from "@/lib/site"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { EcosystemConstellation, ConstellationDock } from "@/components/landing/EcosystemConstellation"
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
        {/* ═══ الفصل ٠ — الكوكبة الحية: the living constellation ═══ */}
        <section className="ln-hero" aria-label="SmartLink — منصّة الروابط الذكية">
          {/* the living sky: the REAL EcosystemConstellation engine —
              a SmartLink core orbited by the three product worlds on
              pulsing data links (r142 evolution of the r129 OrbitScene
              craft: DPR cap, IO pause, RM static frame). It fails safe
              to the CSS sky gradients below it.
              r144 (P4-4SL، دلالة QA): الكانفس لم يعد aria-hidden صامتًا —
              يحمل role="img" وتسمية عربية تشرح المشهد؛ التفاعل كله يبقى
              في الرصيف المتاح أسفله (chips + بطاقة زجاجية) والتلميح نفسه
              aria-hidden (توأم نصي لأسماء الرصيف). */}
          <div className="ln-hero-sky">
            <EcosystemConstellation className="ln-hero-canvas" biasX={-0.35} />
          </div>

          <div className="ln-hero-content">
            <RevealCssClass as="p" className="ln-hero-eyebrow">
              <span className="ln-mono">SmartLink · Smart Menu · SmartBot · Smart Order · ليبيا</span>
            </RevealCssClass>

            {/* h1 + sub paint INSTANTLY — server-rendered inline, no reveal,
                no client gate (LCP doctrine). One lime word: منظومةً. */}
            <h1 className="ln-hero-title">
              <span className="ln-hero-line">كلُّ عملٍ يبدأ <em>رابطًا</em></span>
              <span className="ln-hero-line">ويصبح <em className="ln-hero-gold">منظومةً</em></span>
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

            {/* the tappable worlds — the constellation's dock: on desktop
                the chips mirror the canvas nodes (hover either one, the
                other glows; click opens the glass preview card with the
                product's real facts + its live domain). On mobile these
                chips ARE the nodes. */}
            <RevealCssClass as="div" className="ln-eco-dock" delay={4}>
              <ConstellationDock />
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

          {/* scroll invitation — into the worlds chapter */}
          <a href="#products" className="ln-hero-scroll" aria-label="تابع الرحلة">
            <span className="ln-mono">تابع الرحلة</span>
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
