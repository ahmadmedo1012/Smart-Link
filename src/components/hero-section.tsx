import Link from "next/link"
import { ArrowLeft, Smartphone, Bot, Sparkles, Hexagon, Zap, Star, MousePointer2, TrendingUp } from "lucide-react"
import { HeroStats } from "@/components/hero-stat"

/* r8: the hero is a full SERVER component.
   - framer-motion was removed in r2 (122 KB vendor chunk out of the
     critical path); counters moved to an IntersectionObserver island.
   - r8 goes further: the counters island (hero-stat.tsx) is now the ONLY
     client JS in the hero, and it SSRs the FINAL values ("+500"…), so
     the stats paint pre-JS instead of waiting for hydration + count-up.
   - The scroll parallax is now a CSS scroll-driven animation
     (view-timeline --hero, see globals.css) — zero JS, zero listeners.
   Everything else here ships as static HTML: heading, CTAs, blobs,
   grid drift, floating icons (lucide SVGs render server-side). */

const ambientBlobs = [
  { size: 320, x: "-5%", y: "-8%", blur: "60px", color: "oklch(0.65 0.18 250 / 0.05)", opacity: 0.03 },
  { size: 240, x: "72%", y: "20%", blur: "50px", color: "oklch(0.6 0.15 45 / 0.04)", opacity: 0.02 },
  { size: 200, x: "35%", y: "55%", blur: "40px", color: "oklch(0.55 0.14 300 / 0.025)", opacity: 0.015 },
  { size: 180, x: "12%", y: "70%", blur: "35px", color: "oklch(0.6 0.12 200 / 0.02)", opacity: 0.012 },
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
  return (
    /* hero-section / hero-content: CSS view-timeline parallax hooks
       (globals.css) — replaces the rAF scroll listener. */
    <section className="hero-section relative min-h-[90dvh] flex items-center pt-24 pb-16 overflow-hidden" aria-label="Hero section">
      {/* Ambient blobs — r8: blur radii halved (120/100/80/70 → 60/50/40/35).
          At 2–3% opacity the visual difference is imperceptible while the
          raster/GPU cost on mobile drops sharply (Lighthouse: 6 giant blurs
          were among the main-thread paint costs). */}
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
        className="hero-content container-base relative z-10 w-full"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow — CSS reveal (paints pre-JS, critical for LCP) */}
          <div
            className="reveal-up reveal-d1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary-text font-medium mb-10"
          >
            <span>منصة رقمية متكاملة</span>
          </div>

          {/* Animated heading — r8: h1 lines paint INSTANTLY (no reveal).
             The third line's reveal completion was measured as the final
             LCP (39,008 px² at 2,128ms — larger than the description's
             35,033 px²). With headline + body painting at FCP the LCP
             lands at ~1.3s; the entrance cascade stays alive around them
             (eyebrow, CTAs, stats still reveal). */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.01em] sm:tracking-[-0.02em] leading-[1.25] mb-7">
            {headingWords.map((word, i) => (
              <span key={word} className="block">
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

          {/* Description — r8: paints INSTANTLY (no reveal animation).
             Live-throttled probe identified THIS paragraph as the LCP
             element (41,216 px² — the largest paint on the page): every
             100ms of reveal delay here was 100ms added to LCP on every
             visit. The entrance cascade is preserved around it (eyebrow,
             h1 lines, CTAs, stats still reveal). */}
          <p
            className="text-base md:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-[1.7]"
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

        {/* Stats — the hero's only client island (hero-stat.tsx): SSRs the
            final values so the LCP text paints pre-JS, then plays the
            count-up on scroll-in (reduced-motion keeps the final value). */}
        <HeroStats />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  )
}
