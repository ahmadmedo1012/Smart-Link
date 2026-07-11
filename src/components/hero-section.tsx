"use client"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Smartphone, Bot, Users, TrendingUp, Star, Sparkles } from "lucide-react"

function AnimatedStat({ value, label, icon: Icon, delay = 0 }: { value: string; label: string; icon: React.ComponentType<{ className?: string }>; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState("0")
  const target = parseFloat(value.replace(/[+%]/g, ""))
  const prefix = value.startsWith("+") ? "+" : ""
  const suffix = value.endsWith("%") ? "%" : ""

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const totalSteps = duration / step
    const increment = target / totalSteps
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setDisplay(prefix + Math.round(target) + suffix)
        clearInterval(timer)
      } else {
        setDisplay(prefix + Math.round(start) + suffix)
      }
    }, step)
    return () => clearInterval(timer)
  }, [inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay + 0.3 }}
      className="glass rounded-xl p-4 text-center hover:border-[var(--primary)]/30 transition-all duration-300"
    >
      <Icon className="w-5 h-5 text-[var(--primary)] mx-auto mb-1.5" />
      <div className="text-lg font-bold text-[var(--foreground)]">{display}</div>
      <div className="text-xs text-[var(--muted-foreground)]">{label}</div>
    </motion.div>
  )
}

const floatingIcons = [
  { Icon: Smartphone, delay: 0, x: "12%", y: "25%" },
  { Icon: Bot, delay: 0.5, x: "82%", y: "35%" },
  { Icon: Sparkles, delay: 1, x: "8%", y: "65%" },
  { Icon: Star, delay: 0.3, x: "86%", y: "70%" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/8 blur-[150px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/5 blur-[100px]" />
      </div>

      {floatingIcons.map((item) => (
        <div
          key={item.delay}
          className="absolute hidden lg:block pointer-events-none opacity-[0.15]"
          style={{
            left: item.x, top: item.y,
            animation: `float 4s ease-in-out ${item.delay}s infinite`,
          }}
        >
          <item.Icon className="w-8 h-8 text-[var(--primary)]" />
        </div>
      ))}

      <div className="container-base relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass text-sm text-[var(--primary)] font-medium mb-6"
          >
            <Star className="w-3.5 h-3.5" />
            <span>منصة رقمية متكاملة</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            <span className="gradient-text">SmartLink</span>
            <br />
            <span className="text-[var(--foreground)]">منصة رقمية</span>
            <br />
            <span className="text-[var(--foreground)]">لخدمات ذكية</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            منصة موحدة تجمع حلولنا الرقمية المبتكرة — من المنيو الرقمي للمطاعم إلى البوت الذكي لفيسبوك —
            <span className="text-[var(--foreground)] font-medium"> كل ما تحتاجه لتنمية أعمالك في مكان واحد</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:brightness-110 transition-all duration-300 shadow-[0_0_25px_var(--orange-muted)]"
            >
              اكتشف خدماتنا <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-all duration-300"
            >
              تعرف علينا
            </Link>
          </motion.div>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { label: "خدمة نشطة", value: "+500", icon: Users },
            { label: "منيو رقمي", value: "+10K", icon: Smartphone },
            { label: "ردود آلية", value: "+50K", icon: Bot },
            { label: "نمو مستمر", value: "99.9%", icon: TrendingUp },
          ].map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  )
}
