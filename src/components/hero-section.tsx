"use client"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Smartphone, Bot, Users, TrendingUp, Star, Sparkles, Hexagon, Zap, MousePointer2 } from "lucide-react"

function AnimatedStat({ value, label, icon: Icon, delay = 0 }: { value: string; label: string; icon: React.ComponentType<{ className?: string }>; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState("0")
  const target = parseFloat(value.replace(/[+%]/g, ""))
  const prefix = value.startsWith("+") ? "+" : ""
  const suffix = value.endsWith("%") ? "%" : ""

  useEffect(() => {
    if (!inView) return
    const duration = 1200
    const startTime = performance.now()
    let raf: number
    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out-quart deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)
      setDisplay(prefix + current + suffix)
      if (progress < 1) { raf = requestAnimationFrame(tick) }
      else { setDisplay(prefix + Math.round(target) + suffix) }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, prefix, suffix])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-xl p-4 text-center group"
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--card)] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
        <Icon className="w-4 h-4 text-[var(--primary)]" />
      </div>
      <div className="text-xl font-bold text-[var(--foreground)] tabular-nums tracking-tight">{display}</div>
      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{label}</div>
    </motion.div>
  )
}

const ambientBlobs = [
  { size: 320, x: "-5%", y: "-8%", blur: "120px", color: "oklch(0.65 0.18 250 / 0.05)", opacity: 0.03 },
  { size: 240, x: "72%", y: "20%", blur: "100px", color: "oklch(0.6 0.15 45 / 0.04)", opacity: 0.02 },
  { size: 200, x: "35%", y: "55%", blur: "80px", color: "oklch(0.55 0.14 300 / 0.025)", opacity: 0.015 },
  { size: 180, x: "12%", y: "70%", blur: "70px", color: "oklch(0.6 0.12 200 / 0.02)", opacity: 0.012 },
]

const floatingIcons = [
  { Icon: Smartphone, x: "10%", y: "22%" },
  { Icon: Bot, x: "84%", y: "32%" },
  { Icon: Sparkles, x: "7%", y: "60%" },
  { Icon: Hexagon, x: "88%", y: "68%" },
  { Icon: Zap, x: "50%", y: "12%" },
  { Icon: Star, x: "92%", y: "18%" },
  { Icon: MousePointer2, x: "3%", y: "42%" },
  { Icon: TrendingUp, x: "94%", y: "50%" },
]

function FloatingIcon({ Icon, x, y, index }: { Icon: React.ComponentType<{ className?: string }>; x: string; y: string; index: number }) {
  return (
    <div
      className={`absolute hidden lg:block pointer-events-none floating-icon-${index % 6}`}
      style={{ left: x, top: y }}
      aria-hidden="true"
    >
      <Icon className="w-6 h-6 text-[var(--primary)] opacity-[0.10]" />
    </div>
  )
}

const headingWords = ["SmartLink", "منصة رقمية", "لخدمات ذكية"]

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5])

  return (
    <section ref={sectionRef} className="relative min-h-[90dvh] flex items-center pt-24 pb-16 overflow-hidden" aria-label="Hero section">
      {/* Ambient blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {ambientBlobs.map((b, i) => (
          <div
            key={i}
            className={`absolute rounded-full blob-${i}`}
            style={{
              width: b.size, height: b.size, left: b.x, top: b.y,
              background: b.color, filter: `blur(${b.blur})`,
            }}
          />
        ))}
      </div>

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: "transparent" }}
          animate={{ backgroundPosition: ["0px 0px", "-60px -60px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating animated icons */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {floatingIcons.map((item, i) => (
          <FloatingIcon key={`hero-icon-${i}`} {...item} index={i} />
        ))}
      </div>

      <motion.div
        className="container-base relative z-10 w-full"
        style={{ scale: heroScale, opacity: heroOpacity }}
        // ponytail: scroll-linked scale/opacity; degraded by prefers-reduced-motion CSS on outer section
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-[var(--primary)] font-medium mb-10"
          >
            <span>منصة رقمية متكاملة</span>
          </motion.div>

          {/* Animated heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.01em] sm:tracking-[-0.02em] leading-[1.25] mb-7">
            {headingWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-[1.7]"
          >
            منصة موحدة تجمع حلولنا الرقمية المبتكرة — من المنيو الرقمي للمطاعم إلى البوت الذكي لفيسبوك —
            <span className="text-[var(--foreground)] font-semibold"> كل ما تحتاجه لتنمية أعمالك في مكان واحد</span>
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
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm transition-all duration-300 shadow-glow hover:shadow-glow-strong active:scale-[0.97] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                اكتشف خدماتنا <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-all duration-200 active:scale-[0.97]"
            >
              تعرف علينا
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
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
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  )
}
