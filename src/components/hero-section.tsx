"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Smartphone, Bot, Users, TrendingUp, Star, Sparkles, Hexagon, Zap, MousePointer2 } from "lucide-react"

/* framer-motion removed from the hero (critical path, 122 KB vendor chunk):
   counters → IntersectionObserver, parallax → rAF scroll listener,
   shine/grid → CSS keyframes. Visual behavior is preserved. */

function AnimatedStat({ value, label, icon: Icon, delay = 0 }: { value: string; label: string; icon: React.ComponentType<{ className?: string }>; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [display, setDisplay] = useState("0")
  const target = parseFloat(value.replace(/[+%]/g, ""))
  const prefix = value.startsWith("+") ? "+" : ""
  const suffix = value.endsWith("%") ? "%" : ""

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { rootMargin: "0px 0px -10% 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

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
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className="glass-card rounded-xl p-4 text-center group transition-all duration-400 ease-[cubic-bezier(0.16,1,0.2,1)]"
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--card)] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
        <Icon className="w-4 h-4 text-primary-text" />
      </div>
      <div className="text-xl font-bold text-[var(--foreground)] tabular-nums tracking-tight">{display}</div>
      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{label}</div>
    </div>
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
  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll-linked parallax (replaces framer-motion useScroll/useTransform):
  // rAF-gated, passive, and disabled entirely for prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return
    let raf = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      // progress 0 → 1 as the hero scrolls out of view
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1)
      const scale = 1 - progress * 0.05
      const opacity = 1 - Math.min(progress / 0.5, 1) * 0.5
      content.style.transform = `scale(${scale})`
      content.style.opacity = String(opacity)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

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

      {/* Animated grid pattern — CSS drift (fixed: the old motion.div animated
          a transparent child, so the drift never actually rendered) */}
      <div
        className="grid-drift absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating animated icons */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {floatingIcons.map((item, i) => (
          <FloatingIcon key={`hero-icon-${i}`} {...item} index={i} />
        ))}
      </div>

      <div
        ref={contentRef}
        className="container-base relative z-10 w-full will-change-[transform,opacity]"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow — CSS reveal (paints pre-JS, critical for LCP) */}
          <div
            className="reveal-up reveal-d1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary-text font-medium mb-10"
          >
            <span>منصة رقمية متكاملة</span>
          </div>

          {/* Animated heading — CSS reveal (pre-JS paint for LCP) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.01em] sm:tracking-[-0.02em] leading-[1.25] mb-7 reveal-stagger">
            {headingWords.map((word, i) => (
              <span key={word} className={i === 1 ? "block reveal-up" : "block reveal-up"}>
                {i === 0 ? (
                  <span className="gradient-text">{word}</span>
                ) : i === 1 ? (
                  <span className="text-[var(--foreground)]">{word}</span>
                ) : (
                  <span className="text-[var(--muted-foreground)]">{word}</span>
                )}
              </span>
            ))}
          </h1>

          {/* Description — CSS reveal */}
          <p
            className="reveal-up reveal-d2 text-base md:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-[1.7]"
          >
            منصة موحدة تجمع حلولنا الرقمية المبتكرة - من المنيو الرقمي للمطاعم إلى البوت الذكي لفيسبوك -
            <span className="text-[var(--foreground)] font-semibold"> كل ما تحتاجه لتنمية أعمالك في مكان واحد</span>
          </p>

          {/* CTAs — CSS reveal */}
          <div
            className="reveal-up reveal-d3 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#services"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm transition-all duration-300 shadow-glow hover:shadow-glow-strong active:scale-[0.97] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                اكتشف خدماتنا <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </span>
              <span className="cta-shine" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              prefetch={false}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-all duration-200 active:scale-[0.97]"
            >
              تعرف علينا
            </Link>
          </div>
        </div>

        {/* Stats — CSS reveal on the grid; the number counters keep JS inView */}
        <div
          className="reveal-up reveal-d4 mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {[
            { label: "خدمة نشطة", value: "+500", icon: Users },
            { label: "منيو رقمي", value: "+10K", icon: Smartphone },
            { label: "ردود آلية", value: "+50K", icon: Bot },
            { label: "نمو مستمر", value: "99.9%", icon: TrendingUp },
          ].map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} delay={i * 0.12} />
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  )
}
