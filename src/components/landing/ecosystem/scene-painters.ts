/* r147 (17-DEBT-SL): the constellation's pin-free paint blocks, extracted
 * VERBATIM from the parent engine's draw() — the same canvas ops, in the
 * same order, at the same call points (stars → data links → orbit
 * ellipses → core), reading the same values from the SceneState the
 * parent mirrors. The node update + node draw blocks stay in the
 * composition root: their eased glow/vantage math is parity-pinned
 * there verbatim (tests/parity.mjs reads that file's text), so moving
 * them would trade a line count for a broken acceptance contract. */
import { rgb, type WorldNode } from './engine-primitives';
import type { SceneState } from './scene';

/** One data pulse crosses its link in ~2.8s; three links run staggered. */
const PULSE_PERIOD = 2800;
/** Pulse direction per link: true = core→node (power out). */
const PULSE_OUT = [true, false, true] as const;

/* stars — two parallax depth planes, static alpha (nothing flashes) */
export function paintStars(
  ctx: CanvasRenderingContext2D,
  S: SceneState,
  mouse: { sx: number; sy: number },
  fade: number,
) {
  const { w, h, stars } = S;
  const starParX = (mouse.sx - 0.5) * 7;
  const starParY = (mouse.sy - 0.5) * 6;
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i]!;
    const k = s.depth === 1 ? 1 : 0.4;
    ctx.globalAlpha = s.base * fade;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x * w + starParX * k, s.y * h + starParY * k, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* data links — faint hairline core↔node + bright pulse bead */
export function paintLinks(
  ctx: CanvasRenderingContext2D,
  S: SceneState,
  nodes: readonly WorldNode[],
  core: { x: number; y: number },
  tNow: number,
  fade: number,
) {
  const { C, W, glowW } = S;
  ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]!;
    const linkA = 0.09 + n.selectK * 0.1 + n.hoverK * 0.08;
    ctx.strokeStyle = rgb(C, Math.max(0.05, linkA) * fade);
    ctx.beginPath();
    ctx.moveTo(core.x, core.y);
    ctx.lineTo(n.x, n.y);
    ctx.stroke();

    // pulse bead — staggered phase, alternating direction
    const phase = ((tNow / PULSE_PERIOD + i * 0.37 + 0.12) % 1 + 1) % 1;
    const dir = PULSE_OUT[i]! ? phase : 1 - phase;
    const bx = core.x + (n.x - core.x) * dir;
    const by = core.y + (n.y - core.y) * dir;
    // brighter segment riding the bead
    const seg = 0.1;
    const a1 = Math.max(0, dir - seg);
    const a2 = Math.min(1, dir + seg);
    ctx.strokeStyle = rgb(W[i]!, 0.5 * fade);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(core.x + (n.x - core.x) * a1, core.y + (n.y - core.y) * a1);
    ctx.lineTo(core.x + (n.x - core.x) * a2, core.y + (n.y - core.y) * a2);
    ctx.stroke();
    ctx.lineWidth = 1;

    const gs = 15 + n.hoverK * 12 + n.selectK * 8;
    ctx.globalAlpha = fade * (0.5 + n.hoverK * 0.5 + n.selectK * 0.3);
    ctx.drawImage(glowW[i]!, bx - gs / 2, by - gs / 2, gs, gs);
    ctx.globalAlpha = fade;
    ctx.fillStyle = rgb(W[i]!, 0.95);
    ctx.beginPath();
    ctx.arc(bx, by, 1.7, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* orbit ellipses — hairline whispers under the nodes */
export function paintOrbits(
  ctx: CanvasRenderingContext2D,
  S: SceneState,
  nodes: readonly WorldNode[],
  scx: number,
  scy: number,
  scale: number,
  fade: number,
) {
  const { orbits, systemR, squash, C } = S;
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgb(C, 1);
  for (let i = 0; i < orbits.length; i++) {
    const o = orbits[i]!;
    ctx.globalAlpha = (0.16 + nodes[i]!.selectK * 0.14 + nodes[i]!.hoverK * 0.1) * fade;
    ctx.beginPath();
    ctx.ellipse(scx, scy, systemR * o.f * scale, systemR * o.f * scale * squash, o.rot, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/* the core — violet bloom, breathing ring, cream nucleus */
export function paintCore(
  ctx: CanvasRenderingContext2D,
  S: SceneState,
  core: { x: number; y: number; breathe: number },
  scale: number,
  fade: number,
) {
  const { C, glowCore, glowBloom } = S;
  ctx.globalAlpha = 0.85 * fade;
  ctx.drawImage(glowBloom, core.x - 55, core.y - 55, 110, 110);
  const ringR = 21 + core.breathe * 1.6;
  ctx.globalAlpha = (0.3 + core.breathe * 0.06) * fade;
  ctx.strokeStyle = rgb(C, 1);
  ctx.beginPath();
  ctx.arc(core.x, core.y, ringR * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = fade;
  ctx.drawImage(glowCore, core.x - 26, core.y - 26, 52, 52);
  ctx.fillStyle = rgb(C, 0.96);
  ctx.beginPath();
  ctx.arc(core.x, core.y, 5.6 + core.breathe * 0.5, 0, Math.PI * 2);
  ctx.fill();
}
