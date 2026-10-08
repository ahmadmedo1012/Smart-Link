"use client"

import { useEffect, useRef } from "react"

/**
 * HeroDepthLayer — r128 Stage B (F2b), ported from Madarek
 * (frontend/src/components/landing/HeroDepthLayer.tsx).
 *
 * Scroll-craft baseline: parallax starfield for the hero. This layer
 * moves at ~0.2× the scroll rate while the orbit canvas sits at z0 and
 * the text column at z1, so the copy appears closer than the starfield.
 *
 * Perf: one passive scroll listener + one rAF. The canonical component
 * consumed Madarek's useReducedMotion hook; this port reads the media
 * query inline (the repo's port convention) — semantics byte-equal.
 *
 * r130 (W1-D P2-17): the port now SUBSCRIBES to the media query (the
 * canonical hook re-runs on preference change) — toggling OS
 * reduce-motion mid-session attaches/detaches the parallax live
 * instead of leaving the starfield running until reload; turning RM
 * ON also clears the last translate3d offset so the layer snaps home.
 */

type Star = { cx: number; cy: number; r: number; op: number }

const STAR_COUNT = 80
const VIEWBOX = 1200

function makeStars(count: number, seed: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random by seed so layout is identical every render.
    const x = ((Math.sin(seed + i * 397.1) * 0.5 + 0.5) * VIEWBOX)
    const y = ((Math.cos(seed + i * 263.3) * 0.5 + 0.5) * VIEWBOX)
    const r = 0.5 + (Math.abs(Math.sin(seed + i * 179.7)) * 1.2)
    const op = 0.15 + (Math.abs(Math.sin(seed + i * 131.9)) * 0.35)
    stars.push({ cx: x, cy: y, r, op })
  }
  return stars
}

export function HeroDepthLayer() {
  const ref = useRef<SVGSVGElement | null>(null)
  const raf = useRef(0)

  // Seeded so the star positions are deterministic across renders.
  const stars = makeStars(STAR_COUNT, 42)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")

    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(tick)
    }
    const tick = () => {
      raf.current = 0
      const y = window.scrollY
      // Depth factor: how far scrolled relative to viewport height.
      const depth = y / (window.innerHeight || 1)
      // Slow parallax — ~0.2× scroll rate (scroll-craft baseline).
      const offset = depth * 40
      if (ref.current) {
        ref.current.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
      }
    }

    const attach = () => {
      window.addEventListener("scroll", onScroll, { passive: true })
      // Initial sample so the layer starts at the right position.
      tick()
    }
    const detach = () => {
      window.removeEventListener("scroll", onScroll)
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = 0
      // RM ON mid-session: drop the last parallax offset — the
      // starfield must not freeze mid-translate for the rest of the
      // session (the belt can't reach an inline style).
      if (ref.current) ref.current.style.transform = ""
    }

    if (!mq.matches) attach()

    // mid-session preference toggle: attach/detach live (canonical
    // useReducedMotion re-runs its effect on the same change).
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) detach()
      else attach()
    }
    mq.addEventListener("change", onChange)

    return () => {
      mq.removeEventListener("change", onChange)
      detach()
    }
  }, [])

  return (
    <svg
      ref={ref}
      className="ln-hero-depth"
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="rgba(245,243,231,0.6)"
          opacity={s.op}
        />
      ))}
    </svg>
  )
}
