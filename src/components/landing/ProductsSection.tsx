"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { ArrowLeft, Network } from "lucide-react"
import Link from "next/link"
import { RevealCssClass } from "@/hooks/useReveal"
import { SITE } from "@/lib/site"

/* r129 — Chapter 01 «الاكتشاف»: the products constellation, REBUILT on
 * the canonical CollegeConstellation anatomy (Madarek
 * frontend/src/components/landing/CollegeConstellation.tsx @ cf7ffca)
 * over the §6 slot map (colleges→products). The flat 3-ring SVG chart
 * is gone; this is a strict geometric orrery:
 *
 * · Square 720×720 viewBox mounted in a square, aspect-locked layer —
 *   the rings can never render as anything but perfect circles:
 *   concentric, centered, radii on a single 36-unit module (66…246) —
 *   SIX rings (r129 P0-11: was 3 flat circles in a 1000×640 viewBox).
 * · Dots are pure trigonometry: ring radius + equal angular steps +
 *   one fixed phase per ring (RING_PHASE). Zero jitter, zero scatter.
 * · Idle dots are ONE uniform cream at 0.65 alpha (canonical P2-13 —
 *   r129: the two permanently-lime live dots are gone; lime is
 *   reserved for the single hovered/focused node, ONE pop).
 * · 8×8px inline pins (canonical DOT_SIZE) over the 13px css hit-dot
 *   box; each pin carries a guaranteed 44×44 hit span.
 * · Resting life (r129 P1-4): one node gently highlights at a time on
 *   a ~4s cycle — the sky shows life without hover. Gated by
 *   prefers-reduced-motion (never starts) and paused offscreen via the
 *   component's own IntersectionObserver.
 * · React-state tip (role="status") anchored at the hovered node — the
 *   canonical anatomy (r129: replaces the CSS-only hover tip).
 * · The registry CTA strip (canonical .ln-constellation-cta): mono
 *   count + browse pill → /pricing (the products' plans page; Madarek
 *   opens the colleges popover — Smart-Link has no registry popover).
 * · Live products are real <a>s to the real apps (focusable, external);
 *   coming-soon services are decorative sky members (aria-hidden —
 *   their names ride the chips strip and the lede, the documented §6
 *   adaptation; they still hover-pop + tip so the sky reads equal). */

/** Hover pop — var()-chained to the Orbit Ink lime token with hex fallback. */
const DOT_LIME = "var(--ln-lime, #DFEDB2)"
/** Idle paint — flat cream (canonical P2-13: 0.65 alpha — findable at rest). */
const DOT_IDLE = "rgba(245,243,231,0.65)"
/** Resting-cycle paint — the one gently lit node (near-full cream). */
const DOT_REST = "rgba(245,243,231,0.95)"

/** Square stage side — a square viewBox is what keeps every ring a perfect circle. */
const SIZE = 720
/** Shared center of all six rings. */
const CENTER = SIZE / 2
/** Ring radii on a single 36-unit module: 66, 102, 138, 174, 210, 246. */
const RING_BASE = 66
const RING_STEP = 36
/** Ring count — canonical: SIX concentric knowledge rings. */
const RING_COUNT = 6
/**
 * Per-ring phase in degrees — the one global angular offset each ring
 * carries so its dots never stack radially on another ring's dots
 * (canonical RING_PHASE, verbatim).
 */
const RING_PHASE = [90, 0, 30, 60, 15, 105] as const

/** Resting-highlight cadence — one node every ~4s (canonical). */
const REST_CYCLE_MS = 4000

/**
 * The services registry (§6 mapping, r128 content truth; r137 re-truth):
 * the THREE LIVE products — focusable links to the real apps — ride the
 * three inner rings (closest to the violet heart); the five coming-soon
 * services spread over the outer rings. r137: «متجر إلكتروني — قريباً»
 * became the LIVE Smart Order — the placeholder anticipated exactly this
 * product (README: متجر رقمي وطلبات وتوصيل للأعمال), and keeping a
 * coming-soon e-store node next to a live one was a contradiction.
 */
type Service = {
  name: string
  sub: string
  href?: string
  ring: number
}

const SERVICES: readonly Service[] = [
  { name: "Smart Menu", sub: "المنيو الرقمي للمطاعم — يعمل الآن", href: SITE.products.menu.url, ring: 0 },
  { name: "SmartBot", sub: "البوت الذكي لفيسبوك — يعمل الآن", href: SITE.products.bot.url, ring: 1 },
  { name: "Smart Order", sub: "متجر الطلبات الرقمي — يعمل الآن", href: SITE.products.order.url, ring: 2 },
  { name: "حجوزات مواعيد", sub: "قريباً", ring: 2 },
  { name: "منصة تسويق", sub: "قريباً", ring: 3 },
  { name: "مساعد ذكي", sub: "قريباً", ring: 3 },
  { name: "فواتير إلكترونية", sub: "قريباً", ring: 4 },
  { name: "تطبيق موبايل", sub: "قريباً", ring: 5 },
]

type Node = Service & {
  /** position on the square SVG stage, in viewBox units */
  x: number
  y: number
}

/**
 * Static orbit ring geometry + node placement — radii only; the full
 * dashed-hairline treatment lives in landing.css (with its
 * `animation: none` anti-crawl guard and the P3-21 dash-grow entrance
 * keyed off the group reveal's `.in-view`); per-ring `--ln-ri` feeds
 * the entrance stagger, per-dot `--ln-ci` the radial dot stagger.
 */
function buildConstellation(): { nodes: Node[]; rings: number[] } {
  // Six concentric circles on one radial module.
  const rings = Array.from({ length: RING_COUNT }, (_, i) => RING_BASE + i * RING_STEP)

  // Even angular steps around each ring, rotated by the ring's fixed
  // phase. No jitter, no randomness — the composition is stable.
  const nodes: Node[] = []
  for (let ring = 0; ring < rings.length; ring++) {
    const list = SERVICES.filter((s) => s.ring === ring)
    const radius = rings[ring]!
    const phase = (RING_PHASE[ring]! * Math.PI) / 180
    list.forEach((s, i) => {
      const angle = phase + (i / list.length) * Math.PI * 2
      nodes.push({
        ...s,
        x: CENTER + Math.cos(angle) * radius,
        y: CENTER + Math.sin(angle) * radius,
      })
    })
  }
  return { nodes, rings }
}

/**
 * The square drawing layer. The stage frame keeps its wide 1000/640
 * aspect (landing.css), so the sky itself is mounted as a centered
 * square: full stage height, 1/1 aspect ratio, horizontally centered.
 * The square viewBox then maps 1:1 onto it — rings stay perfectly
 * circular at any stage size, and DOM dot percentages land exactly on
 * the ring paths. (Canonical ORRERY_STYLE, verbatim.)
 */
const ORRERY_STYLE: CSSProperties = {
  position: "absolute",
  insetBlock: 0,
  left: "50%",
  aspectRatio: "1 / 1",
  translate: "-50%",
}

/** Idle dot geometry — an 8×8px pin (canonical P2-13), overriding the
 * 13px CSS hit-dot box; the CSS class keeps the 44px invisible hit span. */
const DOT_SIZE: CSSProperties = { inlineSize: 8, blockSize: 8 }

/** Guaranteed ≥44px touch target around each dot (mobile spec §4.3). */
const HIT_STYLE: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  inlineSize: 44,
  blockSize: 44,
  transform: "translate(-50%, -50%)",
  borderRadius: "50%",
}

export function ProductsSection() {
  const [active, setActive] = useState<Node | null>(null)
  /** Index of the resting-highlight node (-1 = none) — P2-13 life. */
  const [restIdx, setRestIdx] = useState(-1)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const { nodes, rings } = useMemo(() => buildConstellation(), [])
  const count = SERVICES.length

  // Resting-highlight cycle (canonical CollegeConstellation.tsx:211-240,
  // verbatim port): rotate one gently lit node every ~4s so the sky
  // reads as alive without hover. NEVER runs under prefers-reduced-
  // motion; paused while the stage is offscreen (IO); fully torn down
  // on unmount.
  useEffect(() => {
    if (typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const stage = stageRef.current
    if (!stage || typeof IntersectionObserver === "undefined") return
    let inView = false
    let timer = 0
    const start = () => {
      if (timer) return
      timer = window.setInterval(() => {
        setRestIdx((i) => (i + 1) % Math.max(1, nodes.length))
      }, REST_CYCLE_MS)
    }
    const stop = () => {
      window.clearInterval(timer)
      timer = 0
    }
    const io = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting)
      if (visible === inView) return
      inView = visible
      if (visible) start()
      else stop()
    })
    io.observe(stage)
    return () => {
      io.disconnect()
      stop()
    }
  }, [nodes.length])

  return (
    <section id="products" className="ln-chapter ln-products">
      <div className="ln-chapter-head">
        <span className="ln-label">{"01 — الاكتشاف"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          ثلاثة منتجات نشطة في <em>مدارٍ واحد</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          مدار SmartLink ينتظم حول حلولٍ تعمل الآن — منيو رقمي للمطاعم، وبوت
          ذكي لفيسبوك، ومتجر طلبات للأعمال — وخمس خدمات قادمة تشغل بقية
          المدار.
        </RevealCssClass>
      </div>

      <RevealCssClass as="div" delay={2}>
        <div className="ln-constellation" data-count={count}>
          {/* ── Desktop: the full sky ─────────────────────────────────── */}
          {/* No aria-hidden on the stage while it holds focusable product
              links (canonical P2-13 axe rule). The SVG carries its own
              role="img" label; dots self-describe. */}
          <div className="ln-constellation-stage" ref={stageRef}>
            <div className="ln-constellation-orrery" style={ORRERY_STYLE}>
              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                preserveAspectRatio="xMidYMid meet"
                className="ln-constellation-svg"
                role="img"
                aria-label={`كوكبة ${count} خدمات على ستة مدارات`}
              >
                {/* allow-emoji: bespoke scene SVG — six concentric orbit
                    rings, not a Lucide icon slot */}
                {rings.map((r, i) => (
                  <circle
                    key={r}
                    className="ln-constellation-ring"
                    cx={CENTER}
                    cy={CENTER}
                    r={r}
                    style={{ "--ln-ri": i } as CSSProperties}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {/* the service dots live in the DOM layer below — real
                    links on the same square grid, so each one rides
                    exactly on its ring path */}
              </svg>
              {/* labels are DOM (crisper Arabic, better a11y than <text>) */}
              {nodes.map((n, i) => {
                const resting = !active && restIdx === i
                const dot = active?.name === n.name ? DOT_LIME : resting ? DOT_REST : DOT_IDLE
                const pos = {
                  left: `${(n.x / SIZE) * 100}%`,
                  top: `${(n.y / SIZE) * 100}%`,
                } as CSSProperties
                if (n.href) {
                  return (
                    <a
                      key={n.name}
                      href={n.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ln-constellation-dot${resting ? " is-resting" : ""}`}
                      style={{ ...pos, "--dot": dot, "--ln-ci": i, ...DOT_SIZE } as CSSProperties}
                      aria-label={`${n.name} — ${n.sub}، رابط خارجي`}
                      onMouseEnter={() => setActive(n)}
                      onFocus={() => setActive(n)}
                      onMouseLeave={() => setActive(null)}
                      onBlur={() => setActive(null)}
                    >
                      <span aria-hidden style={HIT_STYLE} />
                    </a>
                  )
                }
                return (
                  <span
                    key={n.name}
                    aria-hidden="true"
                    className={`ln-constellation-dot${resting ? " is-resting" : ""}`}
                    style={{ ...pos, "--dot": dot, "--ln-ci": i, ...DOT_SIZE } as CSSProperties}
                    onMouseEnter={() => setActive(n)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <span aria-hidden style={HIT_STYLE} />
                  </span>
                )
              })}
              {active && (
                <span
                  className="ln-constellation-tip"
                  style={{ left: `${(active.x / SIZE) * 100}%`, top: `${(active.y / SIZE) * 100}%` }}
                  role="status"
                >
                  <b>{active.name}</b>
                  <i>{active.sub}</i>
                </span>
              )}
            </div>
          </div>

          {/* the domain strip — carries the full registry accessibly
              (desktop keeps the sky chart; phones get these chips) */}
          <ul className="ln-constellation-strip">
            {nodes.map((n, i) => (
              <li
                key={n.name}
                className="ln-constellation-chip"
                style={{ "--dot": n.href ? DOT_LIME : DOT_IDLE } as CSSProperties}
              >
                <span className="ln-constellation-chip-dot" aria-hidden="true" />
                <span className="ln-constellation-chip-label">{n.name}</span>
                <span className="ln-constellation-chip-count">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>

          {/* the registry CTA strip (canonical .ln-constellation-cta) */}
          <div className="ln-constellation-cta">
            <span className="ln-mono">{String(count).padStart(2, "0")} خدمات · منظومة SmartLink</span>
            <Link href="/pricing" prefetch={false} className="ln-constellation-browse">
              تصفّح المنتجات
              <ArrowLeft size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </RevealCssClass>

      <RevealCssClass as="p" className="ln-products-note" delay={3}>
        <Network size={14} aria-hidden="true" />
        منظومة موحَّدة: حساب واحد، واجهات عربية كاملة، ودعم واتساب على مدار
        الساعة — تجربة واحدة متّسقة لكل خدمة.
      </RevealCssClass>
    </section>
  )
}
