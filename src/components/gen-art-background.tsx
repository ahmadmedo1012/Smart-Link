"use client"
import { useMemo } from "react"

/* Client island: generative SVG background (seeded RNG + useMemo).
   Extracted from about/contact/pricing pages so those pages can be server
   components with zero framer-motion in their critical path.

   Two visual variants (both seeded, deterministic per seed):
   - "bands"  — horizontal drifting bands + star field (about/contact)
   - "blobs"  — concentric blob rings + star field (pricing) */

function mulberry32(s: number) {
  return function () {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    var t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const STAR_COUNT = 60

function stars(rng: () => number, accent: string) {
  const lines: string[] = []
  for (let i = 0; i < STAR_COUNT; i++) {
    const x = rng() * 100
    const y = rng() * 100
    const sz = 0.3 + rng() * 1.5
    const op = 0.01 + rng() * 0.03
    lines.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(2)}" fill="${accent}" opacity="${op}" />`)
  }
  return lines
}

function bandsArt(rng: () => number, accent: string) {
  const lines: string[] = []
  for (let i = 0; i < 8; i++) {
    const y1 = i * 14 + rng() * 6
    const y2 = y1 + 8 + rng() * 4
    const xOff = rng() * 10
    const op = 0.02 + i * 0.003
    lines.push(
      `<polygon points="${xOff},${y1} ${100 + xOff},${y1 - 4} ${100 + xOff},${y2 + 4} ${xOff},${y2}" fill="${accent}" opacity="${op}" />`
    )
  }
  lines.push(...stars(rng, accent))
  return lines.join("\n")
}

function blobsArt(rng: () => number, accent: string, accentDim: string) {
  const lines: string[] = []
  for (let band = 0; band < 8; band++) {
    const cx = 30 + rng() * 40
    const cy = 30 + rng() * 40
    const r = 6 + band * 6 + rng() * 5
    const pts = 8 + band * 2
    const rot = rng() * 360
    const op = 0.02 + band * 0.004
    const d: string[] = []
    for (let i = 0; i <= pts; i++) {
      const angle = ((i / pts) * 360 + rot) * (Math.PI / 180)
      const rad = r + (i % 3 === 0 ? rng() * 4 - 2 : 0)
      const x = cx + Math.cos(angle) * rad
      const y = cy + Math.sin(angle) * rad
      d.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    d.push("Z")
    lines.push(`<path d="${d.join(" ")}" fill="none" stroke="${accent}" stroke-width="0.4" opacity="${op}" />`)
    if (band % 3 === 0) {
      lines.push(`<path d="${d.join(" ")} Z" fill="${accentDim}" stroke="none" />`)
    }
  }
  lines.push(...stars(rng, accent))
  return lines.join("\n")
}

export function GenArtBackground({
  seed = 42,
  variant = "bands",
}: {
  seed?: number
  variant?: "bands" | "blobs"
}) {
  const paths = useMemo(() => {
    const rng = mulberry32(seed)
    const accent = "oklch(0.55 0.01 260)"
    if (variant === "blobs") {
      return blobsArt(rng, accent, "oklch(0.55 0.01 260 / 0.04)")
    }
    return bandsArt(rng, accent)
  }, [seed, variant])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  )
}
