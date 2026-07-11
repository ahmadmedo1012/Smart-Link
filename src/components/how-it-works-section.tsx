"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { UserPlus, Palette, Share2 } from "lucide-react"

const steps = [
  { icon: UserPlus, title: "إنشاء حساب مجاني", description: "سجل حسابك مجاناً بدون أي بطاقة ائتمان. ابدأ رحلتك الرقمية في دقائق." },
  { icon: Palette, title: "اختيار الخدمة", description: "اختر الخدمة التي تناسب عملك — منيو رقمي لمطعمك أو بوت ذكي لصفحتك." },
  { icon: Share2, title: "انطلق وابدأ", description: "شارك الرابط مع عملائك وابدأ في استقبال الطلبات والردود بشكل آلي." },
]

function StepCard({ step, index }: { step: typeof steps[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative text-center group"
    >
      {/* Connecting line */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-[1px] bg-gradient-to-r from-[var(--primary)]/0 via-[var(--primary)]/20 to-[var(--primary)]/0" />
      )}

      {/* Step number */}
      <div className="relative inline-flex mb-5">
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300">
          <Icon className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center shadow-[0_0_12px_var(--shadow-glow)]">
          {index + 1}
        </div>
      </div>

      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{step.title}</h3>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs mx-auto">{step.description}</p>
    </motion.div>
  )
}

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="container-base">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">كيف تعمل المنصة؟</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-base leading-relaxed">ثلاث خطوات بسيطة لتبدأ رحلتك الرقمية</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-10 relative">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
