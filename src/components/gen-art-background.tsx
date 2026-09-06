"use client"
import { useMemo } from "react"

/* Client island: generative SVG background (seeded RNG + useMemo).
   Extracted from about/contact pages so those pages can be server
   components with zero framer-motion in their critical path. */

function mulberry32(s: number) {
  return function () {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    var t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function GenArtBackground({ seed = 42 }: { seed?: number }) {
  const paths = useMemo(() => {
    const rng = mulberry32(seed);
    const lines: string[] = [];
    const accent = "oklch(0.55 0.01 260)";

    for (let i = 0; i < 8; i++) {
      const y1 = i * 14 + rng() * 6;
      const y2 = y1 + 8 + rng() * 4;
      const xOff = rng() * 10;
      const op = 0.02 + i * 0.003;
      lines.push(
        `<polygon points="${xOff},${y1} ${100 + xOff},${y1 - 4} ${100 + xOff},${y2 + 4} ${xOff},${y2}" fill="${accent}" opacity="${op}" />`
      );
    }
    for (let i = 0; i < 60; i++) {
      const x = rng() * 100;
      const y = rng() * 100;
      const sz = 0.3 + rng() * 1.5;
      const op = 0.01 + rng() * 0.03;
      lines.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(2)}" fill="${accent}" opacity="${op}" />`);
    }
    return lines.join("\n");
  }, [seed]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: paths }} />
  )
}
