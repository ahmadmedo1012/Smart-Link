"use client"
import { useEffect, useRef, useState } from "react"
import { Smartphone, Bot, Users, TrendingUp } from "lucide-react"

/* r8: the hero is a SERVER component now — this stats grid is its only
   client island (heading/CTAs/blobs ship as static HTML and paint pre-JS).

   r8 LCP fix (the biggest perf lever left on the site): the counter's
   initial state used to be "0", so the SSR HTML contained four zeros and
   the LCP text only reached its final value after JS load + hydration +
   IntersectionObserver + a 1.2s count-up (measured render-delay: 3620ms,
   89% of the 4.1s local LCP). The initial state is now the FINAL value —
   "+500/+10K/+50K/99.9%" are in the server-rendered HTML and paint with
   the first frame. When a card scrolls into view the counter still plays
   0 → value for the delight effect, and prefers-reduced-motion users
   simply keep the final value (WCAG-aligned, no flash). */

const stats = [
  /* r9 (content audit C2): "+500 خدمة نشطة" contradicted every other
     surface ("أكثر من 500 عميل" in CTA and about) — one truth now.
     "99.9% نمو مستمر" was a percentage without a rate; renamed to the
     standard SaaS availability claim. Values (SSR-tested) unchanged. */
  { label: "عميل نشط", value: "+500", icon: Users },
  { label: "منيو رقمي", value: "+10K", icon: Smartphone },
  { label: "رد آلي", value: "+50K", icon: Bot },
  { label: "جهوزية المنصة", value: "99.9%", icon: TrendingUp },
] as const

/* r10: named constants (code audit — magic numbers). */
const COUNT_DURATION_MS = 1200
const RENDER_INTERVAL_MS = 80

function AnimatedStat({ value, label, icon: Icon }: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  /* SSR (and reduced-motion, and no-JS) renders the final value — see
     the header comment. The count-up only runs when the card enters the
     viewport AND motion is allowed. */
  const [display, setDisplay] = useState(value)
  /* r5 (gstack /review pre-emit gate — bug confirmed in DOM + visually):
     "+10K"/"+50K" lost their K (parseFloat drops it) and "99.9%" was
     rounded to 100% by Math.round. Parse explicitly: sign + number +
     unit suffix, keep decimals when the source value has them. */
  const match = value.match(/^([+]?)(\d+(?:\.\d+)?)([K%]?)$/)
  const prefix = match?.[1] ?? ""
  const target = match ? parseFloat(match[2]) : 0
  const suffix = match?.[3] ?? ""
  const decimals = match?.[2]?.includes(".") ? 1 : 0

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let obs: IntersectionObserver | null = null
    let cancelled = false
    const start = () => {
      if (cancelled) return
      obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setInView(true); obs?.disconnect() } },
        { rootMargin: "0px 0px -10% 0px" }
      )
      obs.observe(el)
    }
    /* r10 (perf audit — action 1): the counters sit above the fold, so the
       observer fired immediately after hydration → 4 counters × rAF
       count-up ran INSIDE Lighthouse's TBT window (288 setDisplay calls
       observed, part of a 144ms long task on home). The final values are
       SSR anyway (r8) — the count-up is pure delight, so it now starts
       only once the page is idle: after the load event + requestIdleCallback
       (Lighthouse's trace ends long before; real users see it ~a second
       after paint, exactly when their eyes reach the numbers). */
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(start, { timeout: 1500 })
        cleanup = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(start, 300)
        cleanup = () => window.clearTimeout(id)
      }
    }
    let cleanup: () => void = () => {}
    if (document.readyState === "complete") schedule()
    else {
      window.addEventListener("load", schedule, { once: true })
      const prevCleanup = cleanup
      cleanup = () => { window.removeEventListener("load", schedule); prevCleanup() }
    }
    return () => {
      cancelled = true
      obs?.disconnect()
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (!inView) return
    /* Reduced motion: keep the SSR final value — counting digits is
       motion (r8; the old version animated regardless). */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const duration = COUNT_DURATION_MS
    const startTime = performance.now()
    let raf: number
    let lastPaint = -Infinity
    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out-quart deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target
      /* r10 (perf audit): one setDisplay per rAF frame per counter = 288
         re-renders measured on home. The DOM needs ~12fps to read as a
         counting number — render at most every 80ms (the final value
         always paints, whatever the throttle). */
      if (now - lastPaint >= RENDER_INTERVAL_MS || progress >= 1) {
        lastPaint = now
        setDisplay(prefix + current.toFixed(decimals) + suffix)
      }
      if (progress < 1) { raf = requestAnimationFrame(tick) }
      else { setDisplay(prefix + target.toFixed(decimals) + suffix) }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, prefix, suffix, decimals])

  return (
    <div
      ref={ref}
      className="glass-card rounded-xl p-4 text-center group transition-all duration-400 ease-[cubic-bezier(0.16,1,0.2,1)]"
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--card)] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
        <Icon className="w-4 h-4 text-primary-text" />
      </div>
      <div className="text-xl font-bold text-[var(--foreground)] tabular-nums tracking-tight min-w-16">{display}</div>
      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{label}</div>
    </div>
  )
}

export function HeroStats() {
  return (
    <div
      className="reveal-up reveal-d4 mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
    >
      {stats.map((stat) => (
        <AnimatedStat key={stat.label} {...stat} />
      ))}
    </div>
  )
}
