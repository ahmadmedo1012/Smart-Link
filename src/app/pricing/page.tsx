import { Check, Smartphone, Bot, ShoppingBag, ChevronLeft } from "lucide-react"
import { SITE } from "@/lib/site"
import { formatLyd } from "@/lib/money"
import { GenArtBackground } from "@/components/gen-art-background"
/* r128 F2b: the shared product chrome moved out of the RootLayout
   (the landing owns its own world now) — this page renders it itself. */
import { SiteChrome } from "@/components/site-chrome"
import { FaqAccordion } from "@/components/faq-accordion"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/schema"
// Server component — the FAQ accordion is the only client island;
// entrance motion is CSS reveal (paints pre-JS). Zero framer-motion.
//
// r128 F6 (A4 §6): flat-diet on the plan cards — the gradient washes,
// the gradient top-accent line and the glow hover are gone; cards are
// hairline + border-shift (.ln-card), the price speaks in the mono
// machine-voice (.ln-mono), the eyebrow is the ln-label technical label.
// §0a2-promotion (phase6, P6-2-a2): the pastel icon wells are retired —
// the wells + motifs + check bullets ride the per-product foreshadow
// identities promoted into styles.css (see the plans array note).
//
// P13-2a (T2 — ecosystem truth, F1): the «قريباً/قادمة» paid-plans story
// is RETIRED — the siblings' paid ladders are LIVE (verified from the
// siblings' own sources at this HEAD). The coming-soon chapter became
// the live ecosystem pricing chapter: per-product mini-tables rendered
// through formatLyd, each linking to the sibling's pricing page. The
// three FREE ecosystem cards stay (the Smart-Link hub itself sells the
// free tier); only the paid-plans story changed.
//
// r150 (20-IDEAL-CTA completion): the plan CTAs ride the r150 fleet
// button canon — rectangles 44/13/600/r10 (h-11 = 44px, --fs-sm 13px,
// weight 600, rounded-md = 10px; the pill is the landing hero's
// 48px gold-pill grammar only).
//
// r131 (A3 D1/D4): the page's section-head grammars unify on the
// ln-chapter-head anatomy (label + title + lede) with the title on the
// --fs-h2 rung; plan card H2s consume --fs-h3; the price rides the
// metric ladder (--fs-metric-lg 30px, mono tnum).

export const metadata = pageMetadata({
  /* r10 (SEO audit P2): expanded toward the SERP window with the
     strongest commercial keywords (مجاناً، بلا بطاقة ائتمان).
     r137 (صدق الأسطول): Smart-Order انضم — المنتج الثالث الحي.
     P13-2a: «خطط مدفوعة قادمة» → الباقات المدفوعة حيّة فعلاً (من
     19 د.ل على منصات المنتجات — المبلغ يمر عبر formatLyd نفسه؛ لا
     تهجّيل يدوي ثانٍ لعملة أبدًا، قانون r137). */
  title: "الخطط والأسعار — ابدأ مجاناً اليوم",
  description:
    `خطط وأسعار منظومة Smart Link: خطة مجانية لكل منتج بلا بطاقة ائتمان، وباقات مدفوعة حيّة بالدينار الليبي تبدأ من ${formatLyd(19)} شهريًا — منيو رقمي للمطاعم، وبوت ذكي لفيسبوك، ومتجر طلبات رقمي.`,
  canonical: "/pricing",
  ogDescription:
    `خطة مجانية لكل منتجات المنظومة، والباقات المدفوعة حيّة بالدينار الليبي من ${formatLyd(19)} شهريًا — ابدأ مجاناً اليوم`,
})

/* r137 (ليبي أولاً — قرار الدينار): كل مبلغ ليبي على هذه الصفحة
   يُصاغ بالدينار ويُعرض حصراً عبر formatLyd من lib/money.ts — أرقام
   غربية + تجميع نقاط ar-LY (1.234.567) + لاحقة « د.ل»، سياسة الأسطول
   الواحدة. P13-2a: أول أسعار حقيقية تصل هذه الصفحة (سلالم المنتجات
   الحيّة أدناه) — تُؤلَّف بالدينار الصحيح (19) ولا تهجّيل يدوي. */
const plans = [
  {
    title: "Smart Menu",
    subtitle: "المنيو الرقمي للمطاعم",
    href: SITE.products.menu.url,
    icon: Smartphone,
    price: "مجاني",
    period: "الخطة الأساسية",
    /* §0a2-promotion (phase6, P6-2-a2): the pastel wells are RETIRED —
       each plan card wears its product's OWN foreshadow identity (the
       styles.css promotion): LIT icon ink on the well + the TRUE-hex
       motif beside the title + LIT check bullets. Grade law: lit ink
       ≥ 4.5:1 on the well in BOTH themes; the motif paints the true hex
       (non-text ≥ 3:1). The identity is the only difference between the
       cards, and the CTA keeps the family canon: the hub sells in the
       family accent, the siblings deliver in their own worlds.
       P13-2a (صدق الطبقة المجانية): ميزات المنيو المجاني من كتالوج
       الخطة نفسها (smart-menu default-plans.json Free: منيو واحد ·
       10 أصناف · 100 طلب شهريًا) — لا «غير محدود» بعد اليوم. */
    well: "ln-well--menu",
    motif: "ln-motif--plate",
    features: [
      "منيو رقمي تفاعلي",
      "منيو واحد و10 أصناف",
      "100 طلب شهريًا",
      "طلبات عبر واتساب",
      "إحصائيات أساسية",
    ],
  },
  {
    title: "SmartBot",
    subtitle: "البوت الذكي لفيسبوك",
    href: SITE.products.bot.url,
    icon: Bot,
    price: "مجاني",
    period: "الخطة الأساسية",
    well: "ln-well--bot",
    motif: "ln-motif--circuit",
    features: [
      "ردود تلقائية ذكية",
      "تصنيف النوايا الأساسي",
      "لوحة تحكم متكاملة",
      "تقارير أساسية",
      "إدارة صفحة واحدة",
      "دعم فني عبر البريد",
    ],
  },
  /* r137 (صدق الأسطول): Smart-Order حيّ وباقته الأساسية «مجانية
     للأبد» (order.smart-link.ly/pricing) — «مجاني» هنا صدق لا
     تسويق. الميزات من كتالوج باقته المنشورة (api/plans: متجر
     يعمل فوراً، 15 منتجاً و3 أقسام، 100 طلب شهرياً، منطقة توصيل
     واحدة، طرق دفع محلية). */
  {
    title: "Smart Order",
    subtitle: "متجر الطلبات الرقمي للأعمال",
    href: SITE.products.order.url,
    icon: ShoppingBag,
    price: "مجاني",
    period: "الخطة الأساسية",
    well: "ln-well--order",
    motif: "ln-motif--route",
    features: [
      "متجر رقمي يعمل فوراً",
      "15 منتجاً و3 أقسام",
      "100 طلب شهرياً",
      "منطقة توصيل واحدة",
      "طرق دفع محلية",
    ],
  },
]

/* P13-2a (T2) — أسعار المنظومة الحيّة: البيانات الموثوقة من مصادر
   المنتجات نفسها عند هذا الرأس (كل مستودع شقيق نظيف ومنشور):
   · SmartBot — fb_dashboard/frontend/src/lib/default-plans.ts
     (0/19/29/129/299 د.ل) + backend seed startup.py («مؤسسي» = 299 —
     رقم 29 في موجز المهمة سهو قلم؛ المصدر الشقيق وتدقيق P13-1c
     كلاهما يقرأ 299).
   · Smart Menu — سلّم قاعدة البيانات (zz_round92/round120):
     مجاني/أساسي/بريميوم/احترافي/شركات، دورة 30 يومًا.
   · Smart Order — src/app/api/plans/route.ts FAMILY_PLANS:
     مجاني/أساسي/بريميوم/احترافي، دورة شهرية.
   القيم تُعرض هنا كمرآة صادقة وتُدار عند كل منتج — الرابط تحت كل
   جدول يقود لصفحة أسعار المنتج نفسه (المصدر الحي الوحيد). */
const ecosystemPricing = [
  {
    title: "SmartBot",
    subtitle: "البوت الذكي لفيسبوك",
    href: `${SITE.products.bot.url}/pricing`,
    motif: "ln-motif--circuit",
    period: "د.ل / شهريًا",
    plans: [
      { name: "مجاني", price: 0 },
      { name: "أساسي", price: 19 },
      { name: "مميز", price: 29 },
      { name: "احترافي", price: 129 },
      { name: "مؤسسي", price: 299 },
    ],
  },
  {
    title: "Smart Menu",
    subtitle: "المنيو الرقمي للمطاعم",
    href: `${SITE.products.menu.url}/pricing`,
    motif: "ln-motif--plate",
    period: "د.ل / 30 يومًا",
    plans: [
      { name: "مجاني", price: 0 },
      { name: "أساسي", price: 19 },
      { name: "بريميوم", price: 29 },
      { name: "احترافي", price: 129 },
      { name: "شركات", price: 299 },
    ],
  },
  {
    title: "Smart Order",
    subtitle: "متجر الطلبات الرقمي للأعمال",
    href: `${SITE.products.order.url}/pricing`,
    motif: "ln-motif--route",
    period: "د.ل / شهريًا",
    plans: [
      { name: "مجاني", price: 0 },
      { name: "أساسي", price: 19 },
      { name: "بريميوم", price: 29 },
      { name: "احترافي", price: 129 },
    ],
  },
]

const faqs = [
  { q: "هل الخدمة مجانية حقاً؟", a: "نعم، لكل منتج خطة مجانية حقيقية تُفعَّل فورًا بلا بطاقة ائتمان — مثلًا خطة Smart Menu المجانية تتيح منيوًا واحدًا بعشرة أصناف و100 طلب شهريًا." },
  { q: "ما الفرق بين الخطة المجانية والمدفوعة؟", a: `الباقات المدفوعة متاحة الآن على منصات المنتجات الثلاثة بالدينار الليبي (تبدأ من ${formatLyd(19)}): ترفع حدود الاستخدام وتضيف ميزات متقدمة مثل التحليلات الأعمق، أعضاء الفريق، والدعم ذي الأولوية — والاشتراك والإدارة يتمّان من لوحة تحكم كل منتج.` },
  { q: "هل هناك حد أقصى لعدد المستخدمين؟", a: "الخطط المجانية لاستخدام فردي. الباقات الأعلى تضيف أعضاء الفريق — مثلًا باقة بريميوم في Smart Order تتيح 3 أعضاء واحترافيًا فريقًا غير محدود." },
  { q: "كيف يمكنني الترقية؟", a: "الترقية تتم مباشرة من لوحة تحكم المنتج الذي تستخدمه (Smart Menu أو SmartBot أو Smart Order) — اختر الباقة وادفع بالدينار الليبي، ولا يلزم المرور عبر موقع المنصة إطلاقًا." },
  { q: "هل يمكن إلغاء الاشتراك في أي وقت؟", a: "نعم، يمكنك إلغاء حسابك أو إيقاف الخدمة في أي وقت بدون أي رسوم." },
]

/* Rich results: FAQPage + BreadcrumbList structured data (Google eligibility)
   — r10: shared builders from lib/schema (was a copy of the home FAQ map).
   P13-2a: الأسئلة والأجوبة أعيدت صياغتها على الواقع الحي (لا «قريباً»)
   — الـJSON-LD يرثها تلقائيًا. */
const jsonLd = [
  faqJsonLd(faqs),
  breadcrumbJsonLd([
    { name: "الرئيسية", path: "" },
    { name: "الخطط والأسعار", path: "/pricing" },
  ]),
]

export default function PricingPage() {
  return (
    <SiteChrome>
    {/* phase6 (P6-2-a2): chapter rhythm + full-width composition — the
        three plan cards compose at the 1200px container (one row, no
        max-w-4xl void), the ecosystem tables span it, the FAQ keeps
        a measured 3xl column (answers are prose). Chapters ride the
        .ln-chapter fluid rhythm + the accent hairline. */}
    <div className="pt-28 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GenArtBackground seed={77} variant="blobs" />
      <div className="container-base relative">
        {/* r130 (W1-D P1-2): the page head unifies on the canonical
            ln-chapter-head anatomy (label / title / lede, like /about).
            phase6: the --head chapter, full container width. */}
        <header className="ln-chapter ln-chapter--head">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">الأسعار</span>
            <h1 className="ln-page-title"><em>الخطط</em> والأسعار</h1>
            <p className="ln-chapter-lede">
              ابدأ مجاناً وطور خدماتك معنا — ولكل منتج سلّم باقاته الحيّ على منصّته
            </p>
          </div>
        </header>

        {/* Pricing cards — CSS reveal (LCP element, paints pre-JS).
            r128 F6: flat hairline cards, border-shift only.
            r137: three cards — lg:grid-cols-3 keeps them on one row on
            desktop; md keeps the 2-col grammar (the third wraps).
            phase6: the row composes at the FULL container width.
            P13-2a: هذه هي بطاقات المنظومة المجانية الثلاث (الرابط
            الذكي نفسه مجاني) — القصة المدفوعة انتقلت للفصل الحي أدناه. */}
        <section className="ln-chapter" aria-label="خطط المنتجات">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.title}
                className={`reveal-up reveal-d-${Math.min(i + 1, 4)} ln-card group relative rounded-2xl p-7 md:p-8 flex flex-col`}
              >
                {/* the per-product identity well (§0a2-promotion): LIT
                    icon ink on the well ground — the classes carry both,
                    theme-graded in styles.css. */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${plan.well}`}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                {/* the foreshadow motif opens the card head (the landing
                    eco-card grammar): the sibling's own mark in its true
                    identity hex, decorative + aria-hidden. phase6 fix
                    (P6-2-a4): the BASE .ln-motif class is composed in
                    here — the modifier alone left the span unpositioned. */}
                <div className="flex items-center gap-2.5 mb-1">
                  <span className={`ln-motif ${plan.motif}`} aria-hidden="true" />
                  <h2 className="text-[length:var(--fs-h3)] font-bold text-foreground">{plan.title}</h2>
                </div>
                {/* r133 (A7 §2.2 / R16): the plan card's prose trio — subtitle,
                    period and features — rides --fs-body 15px. */}
                <p className="text-[length:var(--fs-body)] text-[var(--primary-text)] font-medium mb-2">{plan.subtitle}</p>
                <div className="mb-6">
                  {/* mono machine-voice price (ln-mono pattern) — r131 D4:
                      the --fs-metric-lg 30px rung; ln-mono carries the
                      tabular-nums. */}
                  <span className="ln-mono text-[length:var(--fs-metric-lg)] font-bold text-foreground">{plan.price}</span>
                  <span className="text-[length:var(--fs-body)] text-muted-foreground ms-2">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-[length:var(--fs-body)] text-muted-foreground">
                      {/* §0a2-promotion: the value list rides the same
                          per-product well — quiet identity. The Check
                          inherits the lit ink. */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.well}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  /* r134 (R134-W1-SL P3): the external-link announcement
                     convention (footer.tsx:106, main-nav.tsx:303). */
                  aria-label={`ابدأ الآن — ${plan.title}، رابط خارجي`}
                  className="group inline-flex items-center justify-center gap-2 w-full h-11 px-5 rounded-md bg-primary text-[var(--primary-fg)] font-semibold text-[length:var(--fs-sm)] hover:bg-[var(--accent-hover)] transition-all duration-[var(--t-fast)] active:scale-[0.97]"
                >
                  ابدأ الآن <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                </a>
              </div>
            )
          })}
          </div>
        </section>

        {/* P13-2a (T2) — الفصل الحي: أسعار المنظومة الفعلية. كان هذا
            الفصل «قريباً — خطط مدفوعة» (وعد لا تطبيقه) بينما الباقات
            حيّة منذ زمن على منصات المنتجات — الآن الصفحة تحكي الحقيقة:
            جدول مصغّر لكل منتج بسلّمه الحالي، وكل جدول يقود لصفحة
            الأسعار الحيّة عند المنتج نفسه. mono labels + لمسات
            البرتقالي (كود) + كل المبالغ عبر formatLyd. */}
        <section className="ln-chapter">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">01 — المنظومة الحيّة</span>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground reveal-up reveal-d-1">باقات حيّة بالدينار الليبي</h2>
            <p className="ln-chapter-lede">
              أسعار كل منتج تُدار على منصّته — هذه لقطة سلّمه الحالي،
              والتفاصيل الكاملة وميزات كل باقة عند صفحة أسعار المنتج.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {ecosystemPricing.map((product, i) => (
              <div
                key={product.title}
                className={`reveal-up reveal-d-${Math.min(i + 1, 4)} ln-card group relative rounded-2xl p-7 md:p-8 flex flex-col`}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <span className={`ln-motif ${product.motif}`} aria-hidden="true" />
                  <h3 className="text-[length:var(--fs-h3)] font-bold text-foreground">{product.title}</h3>
                </div>
                <p className="text-[length:var(--fs-body)] text-[var(--primary-text)] font-medium mb-4">{product.subtitle}</p>
                {/* mini-table: صف لكل باقة — اسم الخطة + السعر عبر
                    formatLyd (أرقام غربية، تجميع نقاط، لاحقة د.ل)؛
                    الصف المجاني يبرز بحبر البرتقالي (لمسة كود)،
                    والخط الشعري بين الصفوف من --border. */}
                <ul className="flex-1 mb-6">
                  {product.plans.map((p) => (
                    <li
                      key={p.name}
                      className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] last:border-b-0 py-2.5"
                    >
                      <span className="text-[length:var(--fs-body)] text-muted-foreground">{p.name}</span>
                      <span
                        className={`ln-mono text-[length:var(--fs-metric-md)] font-bold ${
                          p.price === 0 ? "text-[var(--primary-text)]" : "text-foreground"
                        }`}
                      >
                        {formatLyd(p.price)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="ln-mono text-[length:var(--fs-body)] text-muted-foreground mb-6">
                  [ {product.period} ]
                </p>
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`تفاصيل الخطط على منصّة ${product.title}، رابط خارجي`}
                  className="group inline-flex items-center justify-center gap-2 w-full h-11 px-5 rounded-md bg-primary text-[var(--primary-fg)] font-semibold text-[length:var(--fs-sm)] hover:bg-[var(--accent-hover)] transition-all duration-[var(--t-fast)] active:scale-[0.97]"
                >
                  تفاصيل الخطط على منصّة {product.title} <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — the only client island on this page (CSS accordion).
            r131 D4: the centered bare h2 unifies on the chapter-head
            anatomy; title rides the --fs-h2 rung.
            phase6: full-width chapter head + a measured 3xl column. */}
        <section className="ln-chapter">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">02 — الأسئلة</span>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground reveal-up reveal-d-1">أسئلة شائعة</h2>
            <p className="ln-chapter-lede">إجابات سريعة عن الخطط والأسعار قبل أن تبدأ</p>
          </div>
          <div className="max-w-3xl">
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      </div>
    </div>
    </SiteChrome>
  )
}
