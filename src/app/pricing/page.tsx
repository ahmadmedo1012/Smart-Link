import { Check, Smartphone, Bot, ChevronLeft, Sparkles } from "lucide-react"
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
// hairline + border-shift (.ln-card), the pastel family survives ONLY
// as flat icon wells (à la the landing megamenu ico tones), the price
// speaks in the mono machine-voice (.ln-mono), the eyebrow is the
// ln-label technical label.
//
// r132 (A8 F-SL-1, adjudicated — G4 canon completion): the plan CTAs
// leave the rounded-full pill grammar for the FULL r131 fleet button
// canon — rectangles 40/13/600/r10 (h-10 = 40px, --fs-sm 13px, weight
// 600, rounded-md = 10px; worklog FLEET RULINGS + the SO Button twin
// — the pill is the landing hero's 46px lime grammar only). Sibling
// evidence (G4-verified): SO/SB/SM Buttons are all rounded-md (10px)
// + 600, and the madarek reference .btn is var(--r-md); F4's first
// pass went rounded-xl (16px) for SL-internal consistency, which
// contradicted the canon it cited — G4 re-based the whole inner-page
// CTA set (about/error/offline/404/contact-form/pricing) on the full
// 40/13/600/r10 canon. The CTA label swap also resolves the deferred
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
     strongest commercial keywords (مجاناً، بلا بطاقة ائتمان). */
  title: "الخطط والأسعار — ابدأ مجاناً اليوم",
  description:
    "خطط وأسعار Smart Menu وSmartBot: ابدأ مجاناً اليوم بلا بطاقة ائتمان — منيو رقمي تفاعلي للمطاعم وبوت ذكي لصفحات فيسبوك، مع خطط مدفوعة قادمة بميزات حصرية للفرق.",
  canonical: "/pricing",
  ogDescription: "ابدأ مجاناً — خطط Smart Menu وSmartBot الأساسية مجانية بالكامل",
})

const plans = [
  {
    title: "Smart Menu",
    subtitle: "المنيو الرقمي للمطاعم",
    href: SITE.products.menu.url,
    icon: Smartphone,
    price: "مجاني",
    period: "الخطة الأساسية",
    /* the pastel family as flat tone wells only (A4 §6) */
    well: "var(--c-peach-bg)",
    wellInk: "var(--c-peach-ink)",
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
    well: "var(--c-lavender-bg)",
    wellInk: "var(--c-lavender-ink)",
    features: [
      "ردود تلقائية ذكية",
      "تصنيف النوايا الأساسي",
      "لوحة تحكم متكاملة",
      "تقارير أساسية",
      "إدارة صفحة واحدة",
      "دعم فني عبر البريد",
    ],
  },
]

const faqs = [
  { q: "هل الخدمة مجانية حقاً؟", a: "نعم، الخطط الأساسية لكل من Smart Menu وSmartBot متوفرة مجاناً مع ميزات محدودة. يمكنك البدء فوراً بدون أي تكلفة." },
  { q: "ما الفرق بين الخطة المجانية والمدفوعة؟", a: "الخطة المجانية توفر الميزات الأساسية. الخطط المدفوعة (القادمة قريباً) ستشمل ميزات متقدمة مثل التحليلات المتعمقة والدعم الفني ذي الأولوية." },
  { q: "هل هناك حد أقصى لعدد المستخدمين؟", a: "الخطط المجانية تسمح باستخدام فردي. الخطط المدفوعة ستتيح إضافة أعضاء الفريق." },
  { q: "كيف يمكنني الترقية؟", a: "سيتم تفعيل الترقية مباشرة من لوحة التحكم عند إطلاق الخطط المدفوعة. سنقوم بإشعارك عبر البريد الإلكتروني." },
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
    <div className="pt-28 pb-16 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GenArtBackground seed={77} variant="blobs" />
      <div className="container-base relative">
        {/* r130 (W1-D P1-2): the page head unifies on the canonical
            ln-chapter-head anatomy (label / title / lede, like /about) —
            was a centered text-5xl/6xl 800-weight header. The title
            rides the display clamp (34→56px, 700 — Plex has no 800). */}
        <div className="ln-chapter-head max-w-3xl">
          <span className="ln-label reveal-up reveal-d-1">الأسعار</span>
          <h1 className="ln-page-title"><em>الخطط</em> والأسعار</h1>
          <p className="ln-chapter-lede">
            اختر الخطة المناسبة لأعمالك — ابدأ مجاناً وطور خدماتك معنا
          </p>
        </div>

        {/* Pricing cards — CSS reveal (LCP element, paints pre-JS).
            r128 F6: flat hairline cards, border-shift only. */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.title}
                className={`reveal-up reveal-d-${Math.min(i + 1, 4)} ln-card group relative rounded-2xl p-7 md:p-8 flex flex-col`}
              >
                {/* flat tone well — the pastel family's only survivor */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: plan.well, color: plan.wellInk }}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-[length:var(--fs-h3)] font-bold text-foreground mb-1">{plan.title}</h2>
                <p className="text-sm text-[var(--primary-text)] font-medium mb-2">{plan.subtitle}</p>
                <div className="mb-6">
                  {/* mono machine-voice price (ln-mono pattern) — r131 D4:
                      the --fs-metric-lg 30px rung (was raw text-4xl 36px,
                      off the metric ladder 22/30/44); ln-mono carries the
                      tabular-nums. */}
                  <span className="ln-mono text-[length:var(--fs-metric-lg)] font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ms-2">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 w-full h-10 px-5 rounded-md bg-primary text-[var(--primary-fg)] font-semibold text-[length:var(--fs-sm)] hover:bg-[var(--accent-hover)] transition-all duration-160 active:scale-[0.97]"
                >
                  ابدأ الآن <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                </a>
              </div>
            )
          })}
        </div>

        {/* Coming soon — flat dashed hairline (was glass + gradient well).
            r131 D4: the centered bare h2 becomes the ln-chapter-head
            anatomy (label + title + lede, start-aligned like every
            /about chapter); the card keeps the icon well + CTA. */}
        <div className="max-w-2xl mx-auto mb-16 reveal-up reveal-d-4">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">01 — القادم</span>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground reveal-up reveal-d-1">قريباً — خطط مدفوعة</h2>
            <p className="ln-chapter-lede">
              نعمل على إطلاق خطط مدفوعة بميزات حصرية: تحليلات متقدمة، دعم فني ذو أولوية، عدد غير محدود من العناصر، والمزيد
            </p>
          </div>
          <div className="ln-card ln-card--dashed rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[var(--accent)]">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-[var(--primary-fg)] text-[length:var(--fs-sm)] font-semibold hover:bg-[var(--accent-hover)] transition-all duration-160 active:scale-[0.97]"
            >
              تواصل معنا لمعرفة المزيد <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* FAQ — the only client island on this page (CSS accordion).
            r131 D4: the last centered bare h2 unifies on the chapter-head
            anatomy (label + title + lede); title rides the --fs-h2 rung. */}
        <div className="max-w-2xl mx-auto">
          <div className="ln-chapter-head">
            <span className="ln-label reveal-up reveal-d-1">02 — الأسئلة</span>
            <h2 className="text-[length:var(--fs-h2)] font-bold text-foreground reveal-up reveal-d-1">أسئلة شائعة</h2>
            <p className="ln-chapter-lede">إجابات سريعة عن الخطط والأسعار قبل أن تبدأ</p>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
    </SiteChrome>
  )
}
