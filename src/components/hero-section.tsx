"use client"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Smartphone, Bot, Users, TrendingUp, Star, Sparkles, Hexagon, Zap } from "lucide-react"

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
    const duration = 2000
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
  }, [inView, target, prefix, suffix])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-xl p-4 text-center group"
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 group-hover:-translate-y-0.5 transition-[transform] duration-200">
        <Icon className="w-4 h-4 text-[var(--primary)]" />
      </div>
      <div className="text-xl font-bold text-[var(--foreground)] tabular-nums tracking-tight">{display}</div>
      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{label}</div>
    </motion.div>
  )
}

const ambientBlobs = [
  { size: 600, x: "-20%", y: "-15%", blur: "180px", color: "var(--primary)", opacity: 0.08 },
  { size: 450, x: "65%", y: "10%", blur: "150px", color: "var(--primary)", opacity: 0.06 },
  { size: 350, x: "40%", y: "50%", blur: "120px", color: "oklch(0.45 0.15 260)", opacity: 0.04 },
  { size: 500, x: "80%", y: "60%", blur: "140px", color: "var(--primary)", opacity: 0.05 },
]

const floatingIcons = [
  { Icon: Smartphone, delay: 0, x: "10%", y: "22%" },
  { Icon: Bot, delay: 0.6, x: "84%", y: "32%" },
  { Icon: Sparkles, delay: 1.2, x: "7%", y: "60%" },
  { Icon: Hexagon, delay: 0.3, x: "88%", y: "65%" },
  { Icon: Zap, delay: 0.9, x: "50%", y: "15%" },
  { Icon: Star, delay: 0.4, x: "92%", y: "20%" },
]

function FloatingIcon({ Icon, delay, x, y, index }: { Icon: React.ComponentType<{ className?: string }>; delay: number; x: string; y: string; index: number }) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div
      className="absolute hidden lg:block pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={shouldReduceMotion ? {} : { opacity: [0.08, 0.15, 0.08], y: [0, -20, 0], x: [0, 10, 0] }}
      transition={{ duration: 5 + index * 0.5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <Icon className="w-7 h-7 text-[var(--primary)]" />
    </motion.div>
  )
}

const headingWords = ["SmartLink", "منصة رقمية", "لخدمات ذكية"]

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  return (
    <section className="relative min-h-[90dvh] flex items-center pt-24 pb-16 overflow-hidden" aria-label="Hero section">
      {/* Ambient blobs with drift */}
      {ambientBlobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none rounded-full"
          aria-hidden="true"
          style={{
            width: b.size, height: b.size, left: b.x, top: b.y,
            background: b.color, filter: `blur(${b.blur})`, opacity: b.opacity,
          }}
          animate={shouldReduceMotion ? {} : { opacity: [b.opacity, b.opacity * 1.3, b.opacity] }}
          transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating animated icons */}
      {floatingIcons.map((item, i) => (
        <FloatingIcon key={`hero-icon-${i}`} {...item} index={i} />
      ))}

      <div className="container-base relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-[var(--primary)] font-medium mb-8"
          >
            <Star className="w-3 h-3" />
            <span>منصة رقمية متكاملة</span>
          </motion.div>

          {/* Animated heading - staggered lines */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6">
            {headingWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {i === 0 ? (
                  <span className="gradient-text">{word}</span>
                ) : i === 1 ? (
                  <span className="text-[var(--foreground)]">{word}</span>
                ) : (
                  <span className="text-[var(--muted-foreground)]">{word}</span>
                )}
              </motion.span>
            ))}
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-[1.7]"
          >
            منصة موحدة تجمع حلولنا الرقمية المبتكرة — من المنيو الرقمي للمطاعم إلى البوت الذكي لفيسبوك —
            <span className="text-[var(--foreground)] font-medium"> كل ما تحتاجه لتنمية أعمالك في مكان واحد</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#services"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 shadow-glow hover:shadow-[0_0_35px_var(--shadow-glow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] active:scale-[0.97]"
            >
              اكتشف خدماتنا <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-[background-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] active:scale-[0.97]"
            >
              تعرف علينا
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          {[
            { label: "خدمة نشطة", value: "+500", icon: Users },
            { label: "منيو رقمي", value: "+10K", icon: Smartphone },
            { label: "ردود آلية", value: "+50K", icon: Bot },
            { label: "نمو مستمر", value: "99.9%", icon: TrendingUp },
          ].map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} delay={i * 0.12} />
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  )
}
