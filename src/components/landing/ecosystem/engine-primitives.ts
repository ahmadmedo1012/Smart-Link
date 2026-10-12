/* r147 (17-DEBT-SL): the constellation engine's shared primitives,
 * extracted verbatim from EcosystemConstellation.tsx — the color triplet
 * type, the CSS-token reader, the rgba string helper, the radial
 * glow-sprite builder and the engine's entity types. Pure functions over
 * their arguments: no module state, no DOM beyond the sprites' own
 * offscreen canvases. The composition root keeps calling readToken at
 * boot and rgb inside its (parity-pinned) node blocks exactly as before. */

export type Triplet = readonly [number, number, number];

export type Star = { x: number; y: number; r: number; base: number; depth: 0 | 1; color: string };
export type WorldNode = {
  angle: number;
  omega: number;
  r: number;
  x: number;
  y: number;
  orbit: number;
  hoverK: number; // 0..1 eased hover glow
  selectK: number; // 0..1 eased selection glow
};

/* ── token reader — the ONLY colors the engine may use ────────────────
 * landing.css owns every hue (--ln-*); the canvas resolves them through
 * getComputedStyle at boot. No hex literal exists in this file. */
export function readToken(root: Element, token: string): Triplet | null {
  const raw = getComputedStyle(root).getPropertyValue(token).trim();
  const hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1]!;
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  }
  const fn = raw.match(/^rgba?\(([^)]+)\)$/i);
  if (fn) {
    const parts = fn[1]!.split(/[,/\s]+/).filter(Boolean).slice(0, 3);
    if (parts.length === 3) return parts.map((p) => parseFloat(p)) as unknown as Triplet;
  }
  return null;
}

/* rgba helper — cheap primitives over precomputed triplets; the draw
   loop builds no other strings per frame (allocation-free discipline). */
export const rgb = (t: Triplet, a: number) => `rgba(${t[0]},${t[1]},${t[2]},${a})`;

/* Pre-rendered radial glow sprite (OrbitScene discipline — per-frame
   shadow filters are far too slow). The `rgb` parameter shadows the
   module helper on purpose: the moved body is verbatim. */
export function makeGlowSprite(size: number, rgb: Triplet, coreAlpha: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  if (!g) return c;
  const half = size / 2;
  const grad = g.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${coreAlpha})`);
  grad.addColorStop(0.25, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${coreAlpha * 0.55})`);
  grad.addColorStop(0.6, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${coreAlpha * 0.14})`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}
