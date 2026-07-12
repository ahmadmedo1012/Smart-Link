"use client"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Check, Smartphone, Bot, ChevronLeft, Sparkles } from "lucide-react"

function mulberry32(s: number) {
  return function () {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    var t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function GenArtBackground({ seed = 77 }: { seed?: number }) {
  const paths = useMemo(() => {
    const rng = mulberry32(seed);
    const lines: string[] = [];
    const accent = "oklch(0.55 0.01 260)";
    const accentDim = "oklch(0.55 0.01 260 / 0.04)";

    for (let band = 0; band < 8; band++) {
      const cx = 30 + rng() * 40;
      const cy = 30 + rng() * 40;
      const r = 6 + band * 6 + rng() * 5;
      const pts = 8 + band * 2;
      const rot = rng() * 360;
      const op = 0.02 + band * 0.004;
      const d: string[] = [];
      for (let i = 0; i <= pts; i++) {
        const angle = ((i / pts) * 360 + rot) * (Math.PI / 180);
        const rad = r + (i % 3 === 0 ? rng() * 4 - 2 : 0);
        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;
        d.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      d.push("Z");
      lines.push(`<path d="${d.join(" ")}" fill="none" stroke="${accent}" stroke-width="0.4" opacity="${op}" />`);
      if (band % 3 === 0) {
        const fd = [...d, "Z"];
        lines.push(`<path d="${fd.join(" ")}" fill="${accentDim}" stroke="none" />`);
      }
    }

    for (let i = 0; i < 60; i++) {
      const x = rng() * 100;
      const y = rng() * 100;
      const sz = 0.3 + rng() * 1;
      const op = 0.01 + rng() * 0.03;
      lines.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(2)}" fill="${accent}" opacity="${op}" />`);
    }

    return lines.join("\n");
  }, [seed]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

const plans = [
  {
    title: "Smart Menu",
    subtitle: "المنيو الرقمي للمطاعم",
    icon: Smartphone,
    price: "مجاني",
    period: "الخطة الأساسية",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    iconBg: "from-amber-400/20 to-orange-500/20",
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
    icon: Bot,
    price: "مجاني",
    period: "الخطة الأساسية",
    gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    iconBg: "from-violet-400/20 to-purple-500/20",
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
  { q: "هل الخدمة مجانية حقاً؟", a: "نعم، الخطط الأساسية لكل من Smart Menu و SmartBot متوفرة مجاناً مع ميزات محدودة. يمكنك البدء فوراً بدون أي تكلفة." },
  { q: "ما الفرق بين الخطة المجانية والمدفوعة؟", a: "الخطة المجانية توفر الميزات الأساسية. الخطط المدفوعة (القادمة قريباً) ستشمل ميزات متقدمة مثل التحليلات المتعمقة والدعم الفني الأولوي." },
  { q: "هل هناك حد أقصى لعدد المستخدمين؟", a: "الخطط المجانية تسمح باستخدام فردي. الخطط المدفوعة ستتيح إضافة أعضاء الفريق." },
  { q: "كيف يمكنني الترقية؟", a: "سيتم تفعيل الترقية مباشرة من لوحة التحكم عند إطلاق الخطط المدفوعة. سنقوم بإشعارك عبر البريد الإلكتروني." },
  { q: "هل يمكن إلغاء الاشتراك في أي وقت؟", a: "نعم، يمكنك إلغاء حسابك أو إيقاف الخدمة في أي وقت بدون أي رسوم." },
]

const _ease = [0.16, 1, 0.3, 1] as [number, number, number, number]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: _ease },
})

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <GenArtBackground seed={77} />
      <div className="container-base relative">
        {/* Hero */}
        <motion.div className="max-w-3xl mx-auto text-center mb-14" {...fadeUp()}>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            الخطط <span className="gradient-text">والأسعار</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            اختر الخطة المناسبة لعملك — ابدأ مجاناً وطور خدماتك معنا
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.title}
                {...fadeUp(0.1 + i * 0.1)}
                className="group relative rounded-[20px] border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--ring)]/30 hover:shadow-[0_0_50px_var(--shadow-glow)] flex flex-col"
              >
                <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${plan.gradient})` }} aria-hidden="true" />
                <div className="relative p-7 md:p-8 flex flex-col flex-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{plan.title}</h3>
                  <p className="text-sm text-[var(--primary)] font-medium mb-2">{plan.subtitle}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground mr-2">{plan.period}</span>
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
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.97]"
                  >
                    ابدأ الآن <ChevronLeft className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Coming soon */}
        <motion.div className="max-w-2xl mx-auto mb-16" {...fadeUp(0.4)}>
          <div className="glass rounded-2xl p-8 text-center border border-dashed border-[var(--glass-border)]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-[var(--primary)]" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">قريباً — خطط مدفوعة</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              نعمل على إطلاق خطط مدفوعة بميزات حصرية: تحليلات متقدمة، دعم فني أولوي، عدد غير محدود من العناصر، وأكثر
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:brightness-110 transition-all duration-200"
            >
              تواصل معنا لمعرفة المزيد <ChevronLeft className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div className="max-w-2xl mx-auto" {...fadeUp(0.5)}>
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">أسئلة شائعة</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-right text-sm font-medium text-foreground hover:bg-[var(--accent)]/30 transition-colors"
                  aria-expanded={openFaq === i}
                >
                  {faq.q}
                  <ChevronLeft className={`w-4 h-4 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: _ease }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
