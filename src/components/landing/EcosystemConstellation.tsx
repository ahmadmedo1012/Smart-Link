'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { WORLDS, worldById, type WorldId } from './worlds';
import { constellationStore } from './ecosystem/constellation-store';
import {
  makeGlowSprite,
  readToken,
  rgb,
  type Triplet,
  type WorldNode,
} from './ecosystem/engine-primitives';
import { buildScene, createSceneState, orbitPoint } from './ecosystem/scene';
import { paintCore, paintLinks, paintOrbits, paintStars } from './ecosystem/scene-painters';

/**
 * EcosystemConstellation — «الكوكبة الحية» (r142 radical redesign).
 *
 * The hero's living organism, evolved from the r129 OrbitScene canvas
 * engine (same craft discipline: DPR 1.5 cap, 48ms dt clamp,
 * allocation-free draw loop, IO/visibility pause, reduced-motion → ONE
 * composed static frame, returning-visitor calm via the same
 * 'smartlink.intro.seen' sessionStorage key) into a NEW anatomy:
 *
 * · a SmartLink CORE (cream nucleus + violet depth bloom + breathing
 *   hairline ring) at the system's heart;
 * · THREE product nodes ride tilted ellipses in their OWN world hues —
 *   read at runtime from landing.css tokens via getComputedStyle (zero
 *   hex in TSX, ever): Smart Menu = --ln-ember, SmartBot = --ln-cyan,
 *   Smart Order = --ln-lime;
 * · PULSING DATA LINKS core↔node: a faint hairline plus a bright bead
 *   travelling each line (orders in, answers out) — the connected-tissue
 *   of the منظومة;
 * · pointer PARALLAX across three depth planes (stars / rings / system)
 *   with the OrbitScene smoothing;
 * · hover a node → its glow lifts, its orbit eases, and a DOM tip
 *   (positioned imperatively — no per-frame React) names it;
 * · click a node (or its chip in ConstellationDock) → the glass preview
 *   card slides in with the product's real facts + a CTA to its LIVE
 *   domain. Selection lives in the module store below so the canvas,
 *   the chips and the card stay one organism across two client islands;
 * · mobile/reduced-power: the scene recedes (CSS dim) and the dock's
 *   chips are the tappable nodes; prefers-reduced-motion paints the
 *   same composed frame, perfectly still.
 */

/* ── craft constants (parity-pinned) ────────────────────────────────── */
const DPR_CAP = 1.5;
const DT_MAX = 48;
const INTRO_KEY = 'smartlink.intro.seen';
const IO_ROOT_MARGIN = '80px 0px';
/** Pointer hover hit radius around a node core (desktop pointer, px). */
const HIT_RADIUS = 30;

/* Ellipse anatomy per world (f = fraction of system radius; rot = tilt;
   omega = rad/ms — real angular speeds, never rescaled per frame). */
const ORBITS = [
  { f: 0.52, rot: -0.3, omega: 0.00009 },
  { f: 0.74, rot: 0.24, omega: -0.000062 },
  { f: 0.97, rot: -0.1, omega: 0.000045 },
] as const;
/* Deterministic starting angles — the composition is authored, not random. */
const NODE_ANGLES = [-1.15, 2.6, 0.55] as const;
/* PULSE_PERIOD / PULSE_OUT moved with the data-links painter
   → ecosystem/scene-painters.ts (r147 split, values unchanged). */

/* r147 (17-DEBT-SL) — the engineering-debt split map. Focused modules
 * under ./ecosystem/ now carry: the module store (constellation-store.ts),
 * the engine primitives (token reader, rgba helper, glow sprites, entity
 * types → engine-primitives.ts), the scene geometry (state + buildScene +
 * orbitPoint → scene.ts) and the pin-free paint blocks (stars, data
 * links, orbit ellipses, core → scene-painters.ts). The engine spine
 * (boot/resize/frame/listeners), the eased node math and the dock stay
 * HERE: their craft lines are pinned verbatim by tests/parity.mjs
 * against this file's text, so moving them would trade a line count for
 * a broken acceptance contract. The store is re-exported so the module's
 * public surface is unchanged. */

export { constellationStore } from './ecosystem/constellation-store';

export function EcosystemConstellation({
  className,
  biasX = 0,
}: {
  className?: string;
  /** Horizontal bias of the system, −1…1. The hero passes a negative
      value so the living mass sits opposite the RTL reading column. */
  biasX?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvasNode = canvasRef.current;
    const tipNode = tipRef.current;
    if (!canvasNode) return;

    // Returning-visitor calm — the SAME per-product sessionStorage key
    // OrbitScene used; landing.css snaps the entrance to t-fast.
    try {
      if (window.sessionStorage.getItem(INTRO_KEY) === '1') {
        canvasNode.closest('.landing')?.setAttribute('data-intro-seen', 'true');
      } else {
        window.sessionStorage.setItem(INTRO_KEY, '1');
      }
    } catch {
      // private mode may block storage — the full entrance plays, fine.
    }

    const context = canvasNode.getContext('2d', { alpha: true });
    if (!context) {
      queueMicrotask(() => setFailed(true));
      return;
    }
    const canvas: HTMLCanvasElement = canvasNode;
    const ctx: CanvasRenderingContext2D = context;
    const tip = tipNode;

    // ── environment (once-sampled reads, OrbitScene discipline) ──────
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;
    const nav2 = navigator as { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowTier = Boolean(nav2.connection?.saveData)
      || (typeof nav2.deviceMemory === 'number' && nav2.deviceMemory <= 2);

    // ── palette from the token layer ──────────────────────────────────
    const root = canvas.closest('.landing') ?? canvas;
    const cream = readToken(root, '--ln-cream');
    const violet = readToken(root, '--ln-violet');
    const worlds = WORLDS.map((w) => readToken(root, w.token));
    if (!cream || !violet || worlds.some((w) => w === null)) {
      // The token layer is the source of truth — without it the engine
      // refuses to paint guesswork; the CSS sky fallback below stays.
      queueMicrotask(() => setFailed(true));
      return;
    }
    const C = cream!;
    const V = violet!;
    const W = worlds as readonly Triplet[];

    // r147 split: the scene state the extracted geometry/painter modules
    // read — the parent mirrors its pinned constants, the sampled palette
    // and (below) the boot-built sprites into it. Same values, same
    // order; the geometry fields are resize-written, read-only elsewhere.
    const S = createSceneState();
    S.orbits = ORBITS;
    S.lowTier = lowTier;
    S.C = C;
    S.V = V;
    S.W = W;

    // ── sizing ────────────────────────────────────────────────────────
    let w = 0;
    let h = 0;
    let systemR = 1;
    let cx = 0;
    let cy = 0;
    let squash = 0.6;
    let nebula: HTMLCanvasElement | null = null;

    const nodes: WorldNode[] = WORLDS.map((_, i) => ({
      angle: NODE_ANGLES[i]!,
      omega: ORBITS[i]!.omega,
      r: 5,
      x: 0,
      y: 0,
      orbit: i,
      hoverK: 0,
      selectK: 0,
    }));
    const core = { x: 0, y: 0, breathe: 0 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Containment-first: the widest orbit always stays inside the
      // hero's overflow:hidden — radius capped by both axes.
      systemR = Math.min(h * 0.4, w * 0.34);
      cx = w * 0.5 + biasX * Math.max(0, w * 0.5 - systemR * 1.08);
      cy = h * 0.47;
      squash = w < h ? 0.78 : 0.6;

      // r147 split: mirror the resized geometry, then rebuild the scene —
      // buildScene reads the same values from the state object; the built
      // stars/nebula return to the same closure locals draw() reads.
      S.w = w;
      S.h = h;
      S.systemR = systemR;
      S.cx = cx;
      S.cy = cy;
      S.squash = squash;
      const built = buildScene(S);
      S.stars = built.stars;
      nebula = built.nebula;
    }

    // glow sprites — one per world + core + bloom (built once)
    const glowW = W.map((t) => makeGlowSprite(64, t, 0.4));
    const glowCore = makeGlowSprite(64, C, 0.34);
    const glowBloom = makeGlowSprite(128, V, 0.3);
    S.glowW = glowW;
    S.glowCore = glowCore;
    S.glowBloom = glowBloom;

    const scratch = { x: 0, y: 0 };
    let introT = 0;
    let scrollP = 0;
    const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5, active: false };
    const pointer = { x: -1, y: -1, inside: false };
    let canvasHover: WorldId | null = null;

    function systemScale() {
      return 0.94 + 0.06 * introT;
    }

    /* draw — allocation-free: every string below is either built here
       from precomputed triplets (cheap primitives, no per-frame arrays)
       or was fixed at boot. OrbitScene's loop budget discipline holds. */
    function draw(dt: number, tNow: number) {
      ctx.clearRect(0, 0, w, h);
      const fade = 1 - scrollP * 0.55;
      const scale = systemScale();

      if (nebula) {
        ctx.globalAlpha = fade;
        ctx.drawImage(nebula, 0, 0, w, h);
      }

      // stars — two parallax depth planes, static alpha (nothing flashes)
      // (r147: block verbatim → ecosystem/scene-painters paintStars)
      paintStars(ctx, S, mouse, fade);

      // system parallax — the living mass drifts opposite the pointer
      const sysParX = (mouse.sx - 0.5) * 14;
      const sysParY = (mouse.sy - 0.5) * 10;
      const scx = cx + sysParX;
      const scy = cy + sysParY;

      // core breathe + node angles advance
      core.breathe = Math.sin(tNow * 0.0012);
      core.x = scx;
      core.y = scy;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        const storeHover = constellationStore.getHover();
        const selected = constellationStore.getSelected();
        const hot = WORLDS[i]!.id === canvasHover || WORLDS[i]!.id === storeHover;
        n.hoverK += ((hot ? 1 : 0) - n.hoverK) * Math.min(1, dt / 120);
        n.selectK += ((WORLDS[i]!.id === selected ? 1 : 0) - n.selectK) * Math.min(1, dt / 160);
        // hover eases the node's angular speed — it slows to be caught
        if (n.selectK > 0.01) {
          // r144 (P4-4SL، QA): the OPEN node answers its selection by
          // riding to the orbit's top vantage — the one arc of every
          // orbit that sits in the clear sky ABOVE the dock's glass
          // card, so the selection ring can never park behind the very
          // panel that names it (the 1440 occlusion finding). Shortest
          // wrap-around arc, eased on the same 160ms selectK clock.
          let gap = -Math.PI / 2 - n.angle;
          gap = Math.atan2(Math.sin(gap), Math.cos(gap));
          n.angle += gap * Math.min(1, dt / 420) * n.selectK;
        } else {
          n.angle += n.omega * (reducedMotion ? 0 : 1 - n.hoverK * 0.75) * dt;
        }
        orbitPoint(S, n.orbit, n.angle, scratch);
        // the intro bloom scales the whole system around its center
        n.x = scx + (scratch.x - cx) * scale;
        n.y = scy + (scratch.y - cy) * scale;
      }

      // data links — faint hairline core↔node + bright pulse bead
      // (r147: block verbatim → ecosystem/scene-painters paintLinks)
      paintLinks(ctx, S, nodes, core, tNow, fade);

      // orbit ellipses — hairline whispers under the nodes
      // (r147: block verbatim → ecosystem/scene-painters paintOrbits)
      paintOrbits(ctx, S, nodes, scx, scy, scale, fade);

      // the core — violet bloom, breathing ring, cream nucleus
      // (r147: block verbatim → ecosystem/scene-painters paintCore)
      paintCore(ctx, S, core, scale, fade);

      // nodes — glow sprite + core + hover halo + selection ring
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        const r = n.r * (1 + n.hoverK * 0.7 + n.selectK * 0.25);
        const gs = r * (11 + n.hoverK * 5);
        ctx.globalAlpha = fade * (0.75 + n.hoverK * 0.25);
        ctx.drawImage(glowW[i]!, n.x - gs / 2, n.y - gs / 2, gs, gs);
        if (n.hoverK > 0.02 || n.selectK > 0.02) {
          // hover halo / selection ring — flat ring, no neon (the
          // flat-craft law holds). r144: the OPEN state is the LOUDEST
          // state — the selection ring rides further out (up to +13px
          // past the node) at full node alpha and a heavier stroke, so
          // it reads around the edges of the open glass card instead of
          // dying behind it (the QA "ambiguous open state" finding). 
          ctx.globalAlpha = fade * Math.max(n.hoverK, n.selectK);
          ctx.strokeStyle = rgb(W[i]!, 1);
          ctx.lineWidth = 1.4 + n.selectK * 0.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 6 + n.hoverK * 3 + n.selectK * 7, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
        ctx.globalAlpha = fade;
        ctx.fillStyle = rgb(W[i]!, 0.98);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    /* the imperative tip — DOM labels stay crisper than canvas text and
       never re-render React; written only when the hovered node changes. */
    let tipFor: WorldId | null = null;
    function syncTip() {
      if (!tip) return;
      const storeHover = constellationStore.getHover();
      const hot = canvasHover ?? storeHover;
      if (hot !== tipFor) {
        tipFor = hot;
        const world = worldById(hot);
        if (world) {
          const b = tip.querySelector('b');
          const i = tip.querySelector('i');
          if (b) b.textContent = world.name;
          if (i) i.textContent = world.sub;
          tip.classList.add('on');
        } else {
          tip.classList.remove('on');
        }
        canvas.classList.toggle('is-pointer', Boolean(hot));
      }
      if (tipFor) {
        const n = nodes[WORLDS.findIndex((wd) => wd.id === tipFor)!]!;
        tip.style.transform = `translate3d(${n.x.toFixed(1)}px, ${(n.y - n.r - 16).toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
    }

    function hitTest(px: number, py: number): WorldId | null {
      let best: WorldId | null = null;
      let bestD = HIT_RADIUS;
      for (let i = 0; i < nodes.length; i++) {
        const d = Math.hypot(nodes[i]!.x - px, nodes[i]!.y - py);
        if (d < bestD) {
          bestD = d;
          best = WORLDS[i]!.id;
        }
      }
      return best;
    }

    /* ── static composed frame (reduced-motion path) ────────────────── */
    function drawStatic() {
      introT = 1;
      draw(0, 2600); // tNow fixed mid-breathe; pulses frozen at authored phases
      if (tip) tip.classList.remove('on');
    }

    /* ── loop control (OrbitScene discipline) ───────────────────────── */
    let raf = 0;
    let last = 0;
    let tNow = 0;
    let running = false;
    let inView = true;
    let visible = !document.hidden;

    function frame(now: number) {
      raf = 0;
      if (!running) return;
      const dt = Math.min(DT_MAX, now - last || 16);
      last = now;
      tNow += dt;
      if (introT < 1) introT = Math.min(1, introT + dt / 1400);
      // pointer smoothing (one lerp per frame, OrbitScene pacing)
      mouse.sx += (mouse.x - mouse.sx) * 0.12;
      mouse.sy += (mouse.y - mouse.sy) * 0.12;
      draw(dt, tNow);
      syncTip();
      if (running) raf = requestAnimationFrame(frame);
    }

    function setRunning(next: boolean) {
      if (reducedMotion) return; // the static path never loops
      const target = next && inView && visible;
      if (target === running) return;
      running = target;
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    /* ── listeners ──────────────────────────────────────────────────── */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inView = e.isIntersecting;
          setRunning(inView);
        }
      },
      { rootMargin: IO_ROOT_MARGIN },
    );
    const onVisibility = () => {
      visible = !document.hidden;
      setRunning(visible);
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) drawStatic();
    });

    let scrollRaf = 0;
    const readScroll = () => {
      scrollRaf = 0;
      const rect = canvas.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      scrollP = Math.max(0, Math.min(1, -rect.top / (vh * 0.9)));
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(readScroll);
    };

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.inside = pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= 0 && pointer.y <= rect.height;
      if (pointer.inside) {
        // feed the shared parallax (same smoothed 0..1 space as mousemove)
        mouse.x = pointer.x / Math.max(1, rect.width);
        mouse.y = pointer.y / Math.max(1, rect.height);
        mouse.active = true;
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!canHover) return;
      toLocal(e);
      if (pointer.inside) {
        const hit = hitTest(pointer.x, pointer.y);
        if (hit !== canvasHover) {
          canvasHover = hit;
          constellationStore.setHover(hit);
        }
      }
    };
    const onPointerLeave = () => {
      pointer.inside = false;
      if (canvasHover) {
        canvasHover = null;
        constellationStore.setHover(null);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      toLocal(e);
      if (!pointer.inside) return;
      const hit = hitTest(pointer.x, pointer.y);
      if (hit) {
        constellationStore.setSelected(constellationStore.getSelected() === hit ? null : hit);
      }
    };

    const teardown = () => {
      running = false;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      if (raf) cancelAnimationFrame(raf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      constellationStore.setHover(null);
    };

    try {
      resize();
    } catch {
      queueMicrotask(() => setFailed(true));
      teardown();
      return;
    }

    if (reducedMotion) {
      // ONE composed still — no loop, no pointer/scroll listeners.
      drawStatic();
      return teardown;
    }

    readScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
    io.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    setRunning(true);
    return teardown;
  }, [biasX]);

  if (failed) return null;
  return (
    <>
      {/* r144 (P4-4SL، دلالة QA): the canvas carries REAL semantics now —
          role="img" + an Arabic label that names the scene for anyone
          inspecting the tree. It stays a non-interactive decoration: the
          accessible interactive twin is the dock below (chips + glass
          card), and the imperative tip keeps its own aria-hidden (its
          text mirrors the chip names). */}
      <canvas
        ref={canvasRef}
        className={className}
        role="img"
        aria-label="الكوكبة الحية — نواة SmartLink تدور حولها عقد المنتجات الثلاثة بروابط بيانات نابضة (مشهد ديكوري؛ العقد القابلة للتفاعل في الرصيف أسفله)"
      />
      {/* the hover tip — imperative canvas-space label (physical left/top
          is the canvas coordinate system; positioning is transform-only) */}
      <div ref={tipRef} className="ln-eco-tip" aria-hidden="true">
        <b />
        <i />
      </div>
    </>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   ConstellationDock — the tappable nodes: three world chips + the glass
   preview card. On desktop the chips mirror the canvas nodes (hover one
   ↔ the other glows); on mobile they ARE the nodes (the scene recedes).
   The card is a non-modal dialog: Escape closes and returns focus to
   the chip, focus moves into the card on open, aria-expanded/controls
   carry the disclosure contract on every chip.
   ═════════════════════════════════════════════════════════════════════ */

const SERVER_NULL = null;

export function ConstellationDock() {
  const hover = useSyncExternalStore(
    constellationStore.subscribeHover,
    constellationStore.getHover,
    () => SERVER_NULL,
  );
  const selected = useSyncExternalStore(
    constellationStore.subscribeSelected,
    constellationStore.getSelected,
    () => SERVER_NULL,
  );
  const cardRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Partial<Record<WorldId, HTMLButtonElement | null>>>({});

  const world = worldById(selected);

  // focus lands in the card on open; Escape closes + returns to the chip
  useEffect(() => {
    if (!selected) return;
    cardRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        constellationStore.setSelected(null);
        chipRefs.current[selected]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <>
      <div className="ln-eco-chips" role="group" aria-label="عقد الكوكبة — اختر عالمًا لمعاينته">
        {WORLDS.map((wd) => {
          const open = selected === wd.id;
          const hot = hover === wd.id;
          return (
            <button
              key={wd.id}
              type="button"
              ref={(el) => {
                chipRefs.current[wd.id] = el;
              }}
              className={`ln-eco-chip${open ? ' is-open' : ''}${hot ? ' is-hot' : ''}`}
              style={{ '--ln-world': `var(${wd.token})` } as CSSProperties}
              aria-expanded={open}
              aria-controls="ln-eco-card"
              onClick={() => constellationStore.setSelected(open ? null : wd.id)}
              onMouseEnter={() => constellationStore.setHover(wd.id)}
              onMouseLeave={() => constellationStore.setHover(null)}
              onFocus={() => constellationStore.setHover(wd.id)}
              onBlur={() => constellationStore.setHover(null)}
            >
              <span className="ln-eco-chip-dot" aria-hidden="true" />
              <span className="ln-eco-chip-body">
                <span className="ln-eco-chip-name">{wd.name}</span>
                <span className="ln-eco-chip-host ln-mono">{wd.host}</span>
              </span>
            </button>
          );
        })}
      </div>

      {world && (
        <div
          ref={cardRef}
          id="ln-eco-card"
          className="ln-eco-card"
          role="dialog"
          aria-modal="false"
          aria-labelledby="ln-eco-card-title"
          tabIndex={-1}
          style={{ '--ln-world': `var(${world.token})` } as CSSProperties}
        >
          <header className="ln-eco-card-head">
            <span className="ln-eco-card-dot" aria-hidden="true" />
            <span className="ln-eco-card-id">
              <b id="ln-eco-card-title">{world.name}</b>
              <i>{world.sub}</i>
            </span>
            <button
              type="button"
              className="ln-eco-card-close"
              aria-label="إغلاق بطاقة المعاينة"
              onClick={() => {
                constellationStore.setSelected(null);
                chipRefs.current[world.id]?.focus();
              }}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </header>
          <ul className="ln-eco-card-facts">
            {world.claims.map((c) => (
              <li key={c}>
                <span className="ln-eco-card-mark" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
          <footer className="ln-eco-card-foot">
            <span className="ln-eco-card-host ln-mono">{world.host}</span>
            <a
              href={world.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ln-eco-card-cta"
              aria-label={`زيارة ${world.name} — النطاق الحي، رابط خارجي`}
            >
              زيارة {world.name}
              <ArrowLeft size={14} aria-hidden="true" />
            </a>
          </footer>
        </div>
      )}
    </>
  );
}
