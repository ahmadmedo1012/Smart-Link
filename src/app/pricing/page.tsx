import { Check, Smartphone, Bot, ShoppingBag, ChevronLeft, Sparkles } from "lucide-react"
import { SITE } from "@/lib/site"
import Link from "next/link"
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
// r150 (20-IDEAL-CTA completion): the plan CTAs ride the r150 fleet
// button canon — rectangles 44/13/600/r10 (h-11 = 44px, --fs-sm 13px,
// weight 600, rounded-md = 10px; was the r131 40/13/600/r10 rung —
// the h-10 40px CTA debt the family 44/48/52 canon retired; worklog
// FLEET RULINGS + the SO Button twin — the pill is the landing hero's
// 48px gold-pill grammar only). Sibling evidence (G4-verified): SO/SB/SM
// Buttons are all rounded-md (10px) + 600, and the madarek reference
// .btn is var(--r-md). The CTA label also resolves the deferred
// 14px no-rung question for BUTTONS: 13px = the --fs-sm rung.
// Body-copy text-sm (card features, timestamps) is NOT a CTA and
// stays deferred.
//
// r131 (A3 D1/D4): the page's three section-head grammars (centered
// bare h2 / card h2 / raw 36px mono price) unify — the coming-soon and
// FAQ section heads ride the ln-chapter-head anatomy (label + title +
// lede) with the title on the --fs-h2 rung; plan card H2s consume
// --fs-h3; the price moves onto the metric ladder (--fs-metric-lg 30px,
// mono tnum) instead of the raw text-4xl step.

export const metadata = pageMetadata({
  /* r10 (SEO audit P2): expanded toward the SERP window with the
     strongest commercial keywords (مجاناً، بلا بطاقة ائتمان).
     r137 (صدق الأسطول): Smart-Order انضم — المنتج الثالث الحي. */
  title: "الخطط والأسعار — ابدأ مجاناً اليوم",
  description:
    "خطط وأسعار Smart Menu وSmartBot وSmart Order: ابدأ مجاناً اليوم بلا بطاقة ائتمان — منيو رقمي تفاعلي للمطاعم، وبوت ذكي لصفحات فيسبوك، ومتجر طلبات للأعمال، مع خطط مدفوعة قادمة بميزات حصرية للفرق.",
  canonical: "/pricing",
  ogDescription: "ابدأ مجاناً — خطط Smart Menu وSmartBot وSmart Order الأساسية مجانية بالكامل",
})

/* r137 (ليبي أولاً — قرار الدينار): لا يوجد أي مبلغ ليبي حقيقي على
   هذه الصفحة اليوم (كل الخطط «مجاني» والمدفوعة «قريباً») — لذا لا
   تُخترع أسعار. عند وصول سعر حقيقي: يُصاغ بالدينار (19 أو "19.500")
   ويُعرض حصراً عبر formatLyd من lib/money.ts — أرقام غربية + تجميع
   نقاط ar-LY (1.234.567) + لاحقة « د.ل»، سياسة الأسطول الواحدة
   (madarek formatNum بنظام ar-LY + Smart-Order formatLyd) — لا
   تهجئة ثانية يدوية أبداً. */
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
       cards — all three plans stay «مجاني» (honest: no invented plan
       tiers), and the CTA keeps the family gold canon: the hub sells in
       gold, the siblings deliver in their own worlds. */
    well: "ln-well--menu",
    motif: "ln-motif--plate",
    features: [
      "منيو رقمي تفاعلي غير محدود العناصر",
      "طلبات عبر واتساب",
      "رمز QR مخصص",
      "لوحة تحكم عربية",
      "إحصائيات أساسية",
      "دعم فني عبر البريد",
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

const faqs = [
  { q: "هل الخدمة مجانية حقاً؟", a: "نعم، الخطط الأساسية لكل من Smart Menu وSmartBot وSmart Order متوفرة مجاناً مع ميزات محدودة. يمكنك البدء فوراً بدون أي تكلفة." },
  { q: "ما الفرق بين الخطة المجانية والمدفوعة؟", a: "الخطة المجانية توفر الميزات الأساسية. خطط Smart Menu وSmartBot المدفوعة (القادمة قريباً) ستشمل ميزات متقدمة مثل التحليلات المتعمقة والدعم الفني ذي الأولوية — وباقات Smart Order المدفوعة متاحة فعلاً بالدينار الليبي على منصته." },
  { q: "هل هناك حد أقصى لعدد المستخدمين؟", a: "الخطط المجانية تسمح باستخدام فردي. الخطط المدفوعة ستتيح إضافة أعضاء الفريق." },
  { q: "كيف يمكنني الترقية؟", a: "سيتم تفعيل الترقية مباشرة من لوحة التحكم عند إطلاق خطط Smart Menu وSmartBot المدفوعة (ترقية Smart Order متاحة الآن من لوحة تحكمه). سنقوم بإشعارك عبر البريد الإلكتروني." },
  { q: "هل يمكن إلغاء الاشتراك في أي وقت؟", a: "نعم، يمكنك إلغاء حسابك أو إيقاف الخدمة في أي وقت بدون أي رسوم." },
]

/* Rich results: FAQPage + BreadcrumbList structured data (Google eligibility)
   — r10: shared builders from lib/schema (was a copy of the home FAQ map). */
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
        max-w-4xl void), the coming-soon banner spans it, the FAQ keeps
        a measured 3xl column (answers are prose). Chapters ride the
        .ln-chapter fluid rhythm + the gold hairline. */}
    <div className="pt-28 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GenArtBackground seed={77} variant="blobs" />
      <div className="container-base relative">
        {/* r130 (W1-D P1-2): the page head unifies on the canonical
            ln-chapter-head anatomy (label / title / lede, like /about) —
            was a centered text-5xl/6xl 800-weight header. The title
            rides the display clamp (34→56px, 700 — Plex has no 800).
            phase6: the --head chapter, full container width. */}
        <header className="ln-chapter ln-chapter--head">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">الأسعار</span>
            <h1 className="ln-page-title"><em>الخطط</em> والأسعار</h1>
            <p className="ln-chapter-lede">
              اختر الخطة المناسبة لأعمالك — ابدأ مجاناً وطور خدماتك معنا
            </p>
          </div>
        </header>

        {/* Pricing cards — CSS reveal (LCP element, paints pre-JS).
            r128 F6: flat hairline cards, border-shift only.
            r137: three cards — lg:grid-cols-3 keeps them on one row on
            desktop; md keeps the 2-col grammar (the third wraps).
            phase6: the row composes at the FULL container width (was
            max-w-4xl mx-auto — a centered 896px island in a 1152px
            container). The plan row is its own chapter (the cards are the
            chapter's content — no head needed: the page head introduces
            them). */}
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
                    identity hex, decorative + aria-hidden. */}
                <div className="flex items-center gap-2.5 mb-1">
                  <span className={plan.motif} aria-hidden="true" />
                  <h2 className="text-[length:var(--fs-h3)] font-bold text-foreground">{plan.title}</h2>
                </div>
                {/* r133 (A7 §2.2 / R16): the plan card's prose trio — subtitle,
                    period and features — rides --fs-body 15px (was raw
                    text-sm 14px — the UI-chrome rung). */}
                <p className="text-[length:var(--fs-body)] text-[var(--primary-text)] font-medium mb-2">{plan.subtitle}</p>
                <div className="mb-6">
                  {/* mono machine-voice price (ln-mono pattern) — r131 D4:
                      the --fs-metric-lg 30px rung (was raw text-4xl 36px,
                      off the metric ladder 22/30/44); ln-mono carries the
                      tabular-nums. */}
                  <span className="ln-mono text-[length:var(--fs-metric-lg)] font-bold text-foreground">{plan.price}</span>
                  <span className="text-[length:var(--fs-body)] text-muted-foreground ms-2">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-[length:var(--fs-body)] text-muted-foreground">
                      {/* §0a2-promotion: the value list rides the same
                          per-product well — quiet identity, no invented
                          plan differences. The Check inherits the lit ink. */}
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

        {/* Coming soon — flat dashed hairline (was glass + gradient well).
            r131 D4: the centered bare h2 becomes the ln-chapter-head
            anatomy (label + title + lede, start-aligned like every
            /about chapter); the card keeps the icon well + CTA.
            phase6: a full-width chapter — the dashed banner spans the
            container (was a centered max-w-2xl island). */}
        <section className="ln-chapter">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">01 — القادم</span>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground reveal-up reveal-d-1">قريباً — خطط مدفوعة</h2>
            <p className="ln-chapter-lede">
              نعمل على إطلاق خطط مدفوعة لـ Smart Menu وSmartBot بميزات حصرية:
              تحليلات متقدمة، دعم فني ذو أولوية، عدد غير محدود من العناصر،
              والمزيد — وباقات Smart Order المدفوعة متاحة فعلاً بالدينار
              الليبي على منصته.
            </p>
          </div>
          <div className="ln-card ln-card--dashed rounded-2xl p-8 text-center reveal-up reveal-d-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[var(--accent)]">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 h-11 px-5 rounded-md bg-primary text-[var(--primary-fg)] text-[length:var(--fs-sm)] font-semibold hover:bg-[var(--accent-hover)] transition-all duration-[var(--t-fast)] active:scale-[0.97]"
            >
              تواصل معنا لمعرفة المزيد <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* FAQ — the only client island on this page (CSS accordion).
            r131 D4: the last centered bare h2 unifies on the chapter-head
            anatomy (label + title + lede); title rides the --fs-h2 rung.
            phase6: full-width chapter head + a measured 3xl column for
            the accordion (the answers are prose — the measure is the
            composition, not dead space). */}
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
