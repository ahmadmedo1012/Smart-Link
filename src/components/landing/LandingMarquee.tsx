/**
 * LandingMarquee — the r128 Orbit-Ink marquee strip (PORT-KIT §3).
 *
 * Self-contained and server-safe (no hooks, no browser APIs): the real
 * item list is duplicated ×2 for the seamless RTL loop; each item is
 * followed by the 5×5px lime dot separator (`·` glyph hidden by CSS —
 * a true dot is drawn). The section is decorative (aria-hidden), the
 * same as the canonical Madarek markup — the copy exists in the page's
 * real content already.
 *
 * Animation lives in src/app/landing.css (.ln-marquee-track, incl. the
 * explicit prefers-reduced-motion off-switch).
 */
export function LandingMarquee({ items }: { items: string[] }) {
  return (
    <section className="ln-marquee" aria-hidden="true">
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
