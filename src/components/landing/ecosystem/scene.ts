/* r147 (17-DEBT-SL): the constellation's scene geometry, extracted from
 * EcosystemConstellation.tsx. SceneState is the mutable scene the parent
 * engine owns: the parent's resize() mirrors the resized geometry into
 * it (same values, same assignment order — the geometry variables are
 * resize-written and read-only everywhere else, so the mirror cannot
 * drift), and buildScene() (re)builds the star field + the depth-bloom
 * nebula exactly as the original closure did, returning them to the same
 * closure locals. The orbit anatomy type + resolver live here too; the
 * ORBITS table itself stays declared in the composition root (its rad/ms
 * values are parity-pinned there) and is mirrored at boot. The parent
 * engine still owns the draw loop — only these pure geometry helpers
 * moved. */
import { rgb, type Star, type Triplet } from './engine-primitives';

/** Ellipse anatomy per world (f = fraction of system radius; rot = tilt;
    omega = rad/ms — real angular speeds, never rescaled per frame). */
export type OrbitSpec = {
  readonly f: number;
  readonly rot: number;
  readonly omega: number;
};

/** The mutable scene the extracted modules read. Every field is written
 *  by the parent engine only (resize/boot) and read-only here. */
export type SceneState = {
  /* viewport geometry — mirrored by the parent's resize() */
  w: number;
  h: number;
  systemR: number;
  cx: number;
  cy: number;
  squash: number;
  /* built content — (re)assigned from buildScene()'s return value */
  stars: Star[];
  nebula: HTMLCanvasElement | null;
  /* boot-time mirrors of the parent's pinned constants + sampled palette */
  orbits: readonly OrbitSpec[];
  lowTier: boolean;
  C: Triplet;
  V: Triplet;
  W: readonly Triplet[];
  glowW: HTMLCanvasElement[];
  glowCore: HTMLCanvasElement;
  glowBloom: HTMLCanvasElement;
};

export function createSceneState(): SceneState {
  return {
    /* the same initial values the original closure locals had */
    w: 0,
    h: 0,
    systemR: 1,
    cx: 0,
    cy: 0,
    squash: 0.6,
    stars: [],
    nebula: null,
    orbits: [],
    lowTier: false,
    C: [0, 0, 0],
    V: [0, 0, 0],
    W: [],
    glowW: [],
    /* placeholders only — replaced by the boot-built sprites in the
       parent before the first paint; never drawn in this state. Called
       from the engine's useEffect, so `document` always exists here. */
    glowCore: document.createElement('canvas'),
    glowBloom: document.createElement('canvas'),
  };
}

export function buildScene(S: SceneState): { stars: Star[]; nebula: HTMLCanvasElement | null } {
  const { w, h, systemR, cx, cy, C, V, lowTier } = S;
  const area = w * h;
  const starCount = lowTier
    ? Math.min(54, Math.max(20, Math.round(area / 20000)))
    : Math.min(120, Math.max(30, Math.round(area / 9500)));
  const stars = Array.from({ length: starCount }, () => {
    const depth: 0 | 1 = Math.random() < 0.62 ? 0 : 1;
    return {
      x: Math.random(),
      y: Math.random(),
      r: (0.5 + Math.random() * 1.1) * (depth === 1 ? 1.15 : 0.85),
      base: (0.4 + Math.random() * 0.42) * (depth === 1 ? 1 : 0.82),
      depth,
      color: Math.random() < 0.86 ? rgb(C, 1) : rgb(V, 1),
    };
  });
  // Depth bloom — violet light source at the core + a faint horizon
  // where the page continues below the fold.
  const nebula = document.createElement('canvas');
  nebula.width = Math.max(1, w);
  nebula.height = Math.max(1, h);
  const ng = nebula.getContext('2d');
  if (ng) {
    const rr = systemR * 1.7;
    const grad = ng.createRadialGradient(cx, cy, 0, cx, cy, rr);
    grad.addColorStop(0, rgb(V, 0.22));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ng.fillStyle = grad;
    ng.fillRect(0, 0, w, h);
    const hz = ng.createRadialGradient(w * 0.5, h * 1.18, 0, w * 0.5, h * 1.18, h * 0.75);
    hz.addColorStop(0, rgb(C, 0.1));
    hz.addColorStop(1, 'rgba(0,0,0,0)');
    ng.fillStyle = hz;
    ng.fillRect(0, 0, w, h);
  }
  return { stars, nebula };
}

export function orbitPoint(S: SceneState, orbit: number, angle: number, out: { x: number; y: number }) {
  const { systemR, squash, cx, cy } = S;
  const o = S.orbits[orbit]!;
  const rx = systemR * o.f;
  const ry = rx * squash;
  const cos = Math.cos(o.rot);
  const sin = Math.sin(o.rot);
  const ex = Math.cos(angle) * rx;
  const ey = Math.sin(angle) * ry;
  out.x = cx + ex * cos - ey * sin;
  out.y = cy + ex * sin + ey * cos;
}
