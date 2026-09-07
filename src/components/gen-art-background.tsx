/* r9: a SERVER component. This shipped as a client island for no reason —
   the generator is deterministic (seeded RNG), has zero interaction, and
   useMemo was useless for a single render. Removing "use client" bakes
   the SVG into the static HTML of about/pricing/contact and drops the
   ~4.4 KB chunk + hydration work from all three pages.

   Three visual variants (all seeded, deterministic per seed):
   - "bands"  — horizontal drifting bands + star field (about)
   - "blobs"  — concentric blob rings + star field (pricing)
   - "rings"  — wavy concentric rings + star field (contact — r6 moved the
     page's inline ~50-line copy of this generator into the shared
     component, one seeded-RNG source of truth instead of two) */

function mulberry32(s: number) {
  return function () {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
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

function ringsArt(rng: () => number, accent: string) {
  const lines: string[] = []
  for (let ring = 0; ring < 6; ring++) {
    const cx = 30 + rng() * 40
    const cy = 30 + rng() * 40
    const r = 10 + ring * 5 + rng() * 6
    const pts = 16 + ring * 2
    const rot = rng() * 360
    const op = 0.015 + ring * 0.005
    const d: string[] = []
    for (let i = 0; i <= pts; i++) {
      const angle = ((i / pts) * 360 + rot) * (Math.PI / 180)
      const rad = r + (i % 4 === 0 ? rng() * 5 - 2.5 : 0)
      const x = cx + Math.cos(angle) * rad
      const y = cy + Math.sin(angle) * rad
      d.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    d.push("Z")
    lines.push(`<path d="${d.join(" ")}" fill="none" stroke="${accent}" stroke-width="0.4" opacity="${op}" />`)
  }
  lines.push(...stars(rng, accent))
  return lines.join("\n")
}

export function GenArtBackground({
  seed = 42,
  variant = "bands",
}: {
  seed?: number
  variant?: "bands" | "blobs" | "rings"
}) {
  const rng = mulberry32(seed)
  const accent = "oklch(0.55 0.01 260)"
  const paths =
    variant === "blobs"
      ? blobsArt(rng, accent, "oklch(0.55 0.01 260 / 0.04)")
      : variant === "rings"
        ? ringsArt(rng, accent)
        : bandsArt(rng, accent)

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
