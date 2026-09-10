import { UserPlus, Palette, Share2 } from "lucide-react"

/* Server component: step reveals + connecting-line draws + badge pops are
   CSS scroll-driven (styles.css §scroll-driven). The line draw reuses the
   existing border-draw keyframes attached to a view() timeline. */

const steps = [
  { icon: UserPlus, title: "إنشاء حساب مجاني", description: "أنشئ حسابك مجاناً بدون أي بطاقة ائتمان. ابدأ رحلتك الرقمية في دقائق." },
  { icon: Palette, title: "اختيار الخدمة", description: "اختر الخدمة التي تناسب عملك — منيو رقمي لمطعمك أو بوت ذكي لصفحتك." },
  { icon: Share2, title: "انطلق وابدأ", description: "شارك الرابط مع عملائك وابدأ في استقبال الطلبات، وسيتولى البوت الرد على العملاء بشكل آلي." },
]

function StepCard({ step, index }: { step: typeof steps[number]; index: number }) {
  const Icon = step.icon

  return (
    <div className="reveal-scroll relative text-center group">
      {/* Connecting line — draws as it scrolls into view.
          r14 (M1): the render condition was LTR-inverted — connectors point
          RIGHT (toward the previous step in this RTL grid), so the LAST
          (leftmost) step needs none, while the FIRST (rightmost) one drew
          a dangling line 34–59px past the grid edge, clipped only by the
          body overflow guard. index > 0 keeps every connector inside the
          grid and finally links the last pair. */}
      {index > 0 && (
        <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px">
          <div
            className="line-draw-scroll h-full bg-gradient-to-r from-[var(--primary)]/0 via-[var(--primary)]/20 to-[var(--primary)]/0"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Step badge */}
      <div className="relative inline-flex mb-5">
        <div className="w-16 h-16 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:scale-[1.12] group-hover:-translate-y-1 transition-transform duration-300 ease-[var(--ease-smooth)]">
          <Icon className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <div
          className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center"
          style={{ boxShadow: "0 0 12px var(--primary)" }}
          aria-hidden="true"
        >
          <span className="badge-pop">{index + 1}</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{step.title}</h3>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs mx-auto">{step.description}</p>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="container-base">
        <div className="reveal-scroll text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">كيف تعمل المنصة؟</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-base leading-relaxed">ثلاث خطوات بسيطة لتبدأ رحلتك الرقمية</p>
        </div>
        <div className="reveal-scroll-stagger grid md:grid-cols-3 gap-10 relative">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
