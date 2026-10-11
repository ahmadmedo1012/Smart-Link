/**
 * LandingMarquee — the r142 «شريط البث» (data-broadcast strip).
 *
 * Self-contained and server-safe (no hooks, no browser APIs): the real
 * item list is duplicated ×2 for the seamless RTL loop; each item is
 * followed by the 5×5px lime dot separator (`·` glyph hidden by CSS —
 * a true dot is drawn). The section is decorative (aria-hidden), the
 * same as the canonical Madarek markup — the copy exists in the page's
 * real content already.
 *
 * r142 redesign: the strip reads as a live BROADCAST — a fixed mono tag
 * cell («BROADCAST · بث المنظومة» + pulsing live dot, static under
 * reduced-motion) opens the line, and the items ride the mono machine
 * voice. The loop arithmetic itself is UNTOUCHED (parity-pinned: 48px
 * track gap, from translateX(0) → to translateX(calc(50% + 24px))).
 *
 * Animation lives in src/app/landing.css (.ln-marquee-track, incl. the
 * explicit prefers-reduced-motion off-switch).
 */
export function LandingMarquee({ items }: { items: string[] }) {
  return (
    <section className="ln-marquee" aria-hidden="true">
      <span className="ln-marquee-tag ln-mono">
        <span className="ln-marquee-live" />
        BROADCAST · بث المنظومة
      </span>
      <div className="ln-marquee-track">
        {[...items, ...items].map((it, i) => (
          <span className="ln-marquee-item" key={i}>
            {it}
            <span className="ln-marquee-sep">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
