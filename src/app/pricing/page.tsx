import { Check, Smartphone, Bot, ChevronLeft, Sparkles } from "lucide-react"
import { SITE } from "@/lib/site"
import Link from "next/link"
import { GenArtBackground } from "@/components/gen-art-background"
import { FaqAccordion } from "@/components/faq-accordion"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/schema"
// Server component — the FAQ accordion is the only client island;
// entrance motion is CSS reveal (paints pre-JS). Zero framer-motion.

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
    gradientVar: "var(--gradient-smart-menu)",
    features: [
      "منيو رقمي تفاعلي غير محدود العناصر",
      "طلبات عبر واتساب",
      "رمز QR مخصص",
      "لوحة تحكم عربية",
      "إحصائيات أساسية",
      "دعم فني عبر البريد",
    ],
    color: "oklch(0.7 0.19 60)",
  },
  {
    title: "SmartBot",
    subtitle: "البوت الذكي لفيسبوك",
    href: SITE.products.bot.url,
    icon: Bot,
    price: "مجاني",
    period: "الخطة الأساسية",
    gradientVar: "var(--gradient-smart-bot)",
    features: [
      "ردود تلقائية ذكية",
      "تصنيف النوايا الأساسي",
      "لوحة تحكم متكاملة",
      "تقارير أساسية",
      "إدارة صفحة واحدة",
      "دعم فني عبر البريد",
    ],
    color: "oklch(0.55 0.15 280)",
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
    <div className="pt-28 pb-16 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GenArtBackground seed={77} variant="blobs" />
      <div className="container-base relative">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="eyebrow-badge mb-6 reveal-up reveal-d1">
            <span>الأسعار</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            الخطط والأسعار
          </h1>
          <p className="text-lg text-muted-foreground">
            اختر الخطة المناسبة لأعمالك — ابدأ مجاناً وطور خدماتك معنا
          </p>
        </div>

        {/* Pricing cards — CSS reveal (LCP element, paints pre-JS) */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.title}
                className={`reveal-up reveal-d${Math.min(i + 1, 4)} group relative rounded-[20px] border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--ring)]/40 hover:shadow-glow-strong transition-all duration-500 flex flex-col`}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)` }} aria-hidden="true" />
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500" style={{ background: plan.gradientVar }} aria-hidden="true" />
                <div className="relative p-7 md:p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[var(--glass-border)]" style={{ background: plan.gradientVar }}>
                    <Icon className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">{plan.title}</h2>
                  <p className="text-sm text-[var(--primary-text)] font-medium mb-2">{plan.subtitle}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
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
                    className="group inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-105 transition-all duration-200 active:scale-[0.97]"
                  >
                    ابدأ الآن <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Coming soon */}
        <div className="max-w-2xl mx-auto mb-16 reveal-up reveal-d4">
          <div className="glass rounded-2xl p-8 text-center border border-dashed border-[var(--glass-border)] hover:border-[var(--ring)]/30 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--glass-border)]" style={{ background: "var(--gradient-coming-soon)" }}>
              <Sparkles className="w-7 h-7 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">قريباً — خطط مدفوعة</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              نعمل على إطلاق خطط مدفوعة بميزات حصرية: تحليلات متقدمة، دعم فني ذو أولوية، عدد غير محدود من العناصر، والمزيد
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:brightness-105 transition-all duration-200 active:scale-[0.97]"
            >
              تواصل معنا لمعرفة المزيد <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* FAQ — the only client island on this page (CSS accordion) */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">أسئلة شائعة</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  )
}
