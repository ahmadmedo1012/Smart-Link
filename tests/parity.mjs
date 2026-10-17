#!/usr/bin/env node
/**
 * test(r126): Madarek parity snapshot — pin the canonical design tokens.
 * (r125 origin: Task 11-a, Wave B. Source of truth: the live Madarek repo —
 * madarek/frontend/src/styles/tokens.css — §1 dark · §2 light · §3 radius ·
 * §4 motion · §5 elevation. The r125 header cited two artifacts that never
 * lived in this repo (download/madarek-parity-matrix.md,
 * scripts/parity_matrix.py) — r126 points at the real SSOT instead.)
 *
 * Run: `npm run test:parity` (plain node — smart-link ships no unit-test
 * runner; the repo's e2e suite is Playwright against a live server, so this
 * is a dependency-free node script). Exit code 1 on any drift — CI-able
 * (wired into .github/workflows/ci.yml in r126).
 *
 * HOW IT READS THE CSS
 * ─────────────────────
 * - Only the theme blocks matter: :root (night, the default) and .light
 *   (paper) — extracted brace-matched from the TOP LEVEL so nothing can
 *   mask the resting values.
 * - The light scope is the real cascade: {.light} overlays {:root}; tokens
 *   .light does not redefine (radius, motion, families, elev…) inherit :root.
 * - var() chains are resolved inside the final scope; comparisons are
 *   normalization-tolerant (whitespace, `a,b` vs `a, b`, hex case) so the
 *   pins are about VALUES, not formatting.
 *
 * r126 EXTENSION (P4-A3 §2.1/§2.10 — the audit's high-value gap list):
 * the 134 r125 pins covered 67 of ~104 declared custom properties and
 * skipped every @media/@font-face surface. Added:
 *   - component-facing bridge tokens --primary/--primary-text/--primary-fg/
 *     --ring/--accent/--input-border (~130 utility consumers, the
 *     highest-drift-risk surface in the repo) — both themes;
 *   - the full glass stack (--glass-bg-strong/-border/-shadow/-shadow-lg)
 *     and the shadow recipes (--shadow-card(-h)/-pop/-modal +
 *     --t-shadow-lg/xl + --t-glow(-strong) — the runtime side of the
 *     @theme shadow utilities);
 *   - surfaces, scrollbar, gen-art strokes, gradient stops, grid line;
 *   - all 7 easings + the RTL --motion-direction override;
 *   - the @theme inline bridges (font stacks, radius ladder incl. the r126
 *     md/2xl/3xl entries, shadow + color + easing utility mappings);
 *   - the 12-face @font-face manifest (family/weight/style/display/src/
 *     unicode-range per face) + on-disk existence of every woff2;
 *   - the entire @media (prefers-contrast: more) override port
 *     (10 tokens × 2 themes);
 *   - the *:focus-visible contract (2px --ring outline, offset 2px, and
 *     NO border-radius mutation — the r126 unification).
 *
 * P4-W3c (A1): the @theme easing bridge is pinned at its full canonical
 * width — THEME_EASE now carries all 7 utility-generating entries
 * (was 2: smooth/spring), so a renamed curve or a reverted Tailwind
 * override can no longer pass.
 *
 * r130 ruling (supersedes r127-F6/r129): the dark-ring question was
 *   re-adjudicated against madarek tokens.css DIRECTLY — dark
 *   --state-focus-ring-color: var(--accent) → #E9B44C (gold, NOT
 *   strong-gold; --accent-strong is only the LIGHT-side resolver via
 *   --c-copper-deep #5C3416). All 5 repos now converge on
 *   dark #E9B44C / light #5C3416. (2) the
 *   prefers-reduced-motion TOKEN-zeroing layer (:root --t-* → 0ms,
 *   canonical layer 1 — the belt was already there) + the belt itself
 *   are pinned; (3) the @theme --radius-xs 6px bridge joins
 *   THEME_RADIUS (was: runtime --r-xs only, rounded-xs fell to the
 *   Tailwind 2px default).
 *
 * Token-name bridge (smart-link keeps its own shadcn/utility vocabulary):
 *   ground --bg → --background · surface --surface → --card
 *   ink --text → --foreground · ink-secondary → --muted-foreground
 *   accent --accent → --accent-solid (their --accent is the 15% wash twin)
 *   danger --danger → --destructive / --destructive-ink
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const css = readFileSync(new URL('../src/app/styles.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  ' '
);

// ── token file → theme scopes ────────────────────────────────────────────────

function topLevelBlock(source, prelude) {
  let i = 0;
  while (i < source.length) {
    const open = source.indexOf('{', i);
    if (open === -1) break;
    let depth = 1;
    let j = open + 1;
    while (j < source.length && depth > 0) {
      if (source[j] === '{') depth += 1;
      else if (source[j] === '}') depth -= 1;
      j += 1;
    }
    // the segment before `{` may carry earlier statements (e.g. the very
    // first @font-face sits after @import/@custom-variant) — only the
    // LAST at-rule/selector in it is what this brace opens.
    const last = source.slice(i, open).split(/[;}]/).pop().trim();
    if (last === prelude) return source.slice(open + 1, j - 1);
    i = j;
  }
  throw new Error(`top-level block not found: ${prelude}`);
}

function allTopLevelBlocks(source, prelude) {
  const out = [];
  let i = 0;
  while (i < source.length) {
    const open = source.indexOf('{', i);
    if (open === -1) break;
    let depth = 1;
    let j = open + 1;
    while (j < source.length && depth > 0) {
      if (source[j] === '{') depth += 1;
      else if (source[j] === '}') depth -= 1;
      j += 1;
    }
    const last = source.slice(i, open).split(/[;}]/).pop().trim();
    if (last === prelude) out.push(source.slice(open + 1, j - 1));
    i = j;
  }
  return out;
}

function parseDecls(block) {
  const out = {};
  for (const m of block.matchAll(/--([A-Za-z0-9_-]+)\s*:\s*([^;]+);/g)) {
    out[`--${m[1]}`] = m[2].trim();
  }
  return out;
}

const dark = parseDecls(topLevelBlock(css, ':root'));
// real cascade: .light overlays :root; everything else inherits
const light = { ...dark, ...parseDecls(topLevelBlock(css, '.light')) };
const theme = parseDecls(topLevelBlock(css, '@theme inline'));
const rtl = parseDecls(topLevelBlock(css, '[dir="rtl"]'));

function resolve(scope, value, depth = 0) {
  if (depth > 10) return value;
  return value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*)\s*)?\)/g, (_m, name, fb) => {
    if (scope[name] !== undefined) return resolve(scope, scope[name], depth + 1);
    return fb ?? `var(${name})`;
  });
}

function norm(v) {
  return v
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/#[0-9a-f]{3,8}/gi, (h) => h.toUpperCase())
    .trim();
}

// ── assertion harness ────────────────────────────────────────────────────────

let passed = 0;
const failures = [];

function pin(scope, mode, token, expected) {
  const raw = scope[token];
  if (raw === undefined) {
    failures.push(`${mode} ${token} is missing from styles.css`);
    return;
  }
  const actual = norm(resolve(scope, raw));
  if (actual !== norm(expected)) {
    failures.push(`${mode} ${token} drifted from the Madarek canonical: got ${actual}, want ${norm(expected)}`);
  } else {
    passed += 1;
  }
}

function pinAll(scope, mode, table) {
  for (const [token, value] of Object.entries(table)) pin(scope, mode, token, value);
}

function check(ok, message) {
  if (ok) passed += 1;
  else failures.push(message);
}

// ── canonical snapshot (madarek tokens.css, live-verified) ──────────────────

const GROUNDS_DARK = {
  /* r160 KODE (P12-2a): night ground = the near-black stage #050507,
     white text, neutral-grey hairlines (the night-indigo/sand family
     retired with the gold — same mechanism, new canonical values). */
  '--background': '#050507', // the KODE night stage
  '--card': '#0B0B10', // the night surface step
  '--foreground': '#FFFFFF', // stage white
  '--muted-foreground': '#A9ACB4', // grey secondary
  '--border': '#17171F', // neutral hairline
  '--border-strong': '#26262E',
};
const GROUNDS_LIGHT = {
  '--background': '#F4F2ED', // r160: the KODE paper stage
  '--card': '#FFFFFF',
  '--foreground': '#0A0A0A', // stage ink
  '--muted-foreground': '#55534E', // warm grey secondary
  '--border': '#E9E7E2',
  '--border-strong': '#D9D6D0',
};
const ACCENT_DARK = {
  /* r160 KODE: the safety-orange column (#FF4C00) — gold retired. */
  '--accent-solid': '#FF4C00',
  '--accent-hover': '#FF6A2E', // brightens on night (direction law kept)
  '--accent-soft': '#221008',
  '--accent-strong': '#FF6A2E',
  '--accent-ink': '#FF4C00',
  '--accent-fg': '#050507', // black ink on orange ≈ 6.3:1
};
const ACCENT_LIGHT = {
  /* phase6 (P6-2-a2) LIGHT GOLD RULING (coordinator decision): the
     copper family (#B57438/#9A5F25/#5C3416) migrates to gold-on-cream —
     fill #E9B44C (ink #1A0F06 on it 9.96:1) · hover #C9962F · soft
     #F7ECD2 · strong/ink = the text-grade deep gold #8A6420 (5.13:1
     on cream ≥ 4.5 — computed-checked) · fg #1A0F06. */
  /* r160 KODE: orange-on-paper — fill #FF4C00 (ink #0A0A0A on it ≈
     5.8:1) · hover darkens #E04400 · soft #FFE3D6 · strong/ink = the
     text-grade #B23E00 (5.2:1 on paper) · fg #0A0A0A. */
  '--accent-solid': '#FF4C00',
  '--accent-hover': '#E04400',
  '--accent-soft': '#FFE3D6',
  '--accent-strong': '#B23E00',
  '--accent-ink': '#B23E00',
  '--accent-fg': '#0A0A0A',
};
const STATUS_DARK = {
  '--success': '#7FD39A', '--success-ink': '#7FD39A',
  '--destructive': '#F0938F', '--destructive-ink': '#F0938F', // Madarek --danger/-ink
  /* r144 (P4-4SL): --warning/--warning-ink/--info/--info-ink removed —
     zero var() consumers repo-wide (grep-verified); pinning deleted
     tokens is how drift hides (the r131 A3 D3 lesson). */
};
const STATUS_LIGHT = {
  '--success': '#4FA66D', '--success-ink': '#1F4F30',
  '--destructive': '#DD6E78', '--destructive-ink': '#6B2128',
};
/* phase6 (P6-2-a2, §0a2-promotion): the pastel section families are
   RETIRED from both themes — their last consumers were the /pricing
   wells, which now ride the per-product foreshadow identities (the
   FORESHADOW tables below). Pinning deleted tokens is how drift hides
   (the r131 A3 D3 / r144 lesson); an extinction sweep asserts the
   retirement itself. */
const FORESHADOW_DARK = {
  /* r160 KODE: the promoted set collapses onto the safety-orange pair
     (S3 discipline — per-world hues retired with the constellation).
     lit = accent grade · true = the literal orange · well = the dark
     orange-brown ground (lit ink on it ≥ 4.5:1). */
  '--ln-menu': '#FF4C00',
  '--ln-menu-true': '#FF4C00',
  '--ln-menu-well': '#221008',
  '--ln-bot': '#FF4C00',
  '--ln-bot-true': '#FF4C00',
  '--ln-bot-well': '#221008',
  '--ln-order': '#FF4C00',
  '--ln-order-true': '#FF4C00',
  '--ln-order-well': '#221008',
};
const FORESHADOW_LIGHT = {
  /* cream grades — LIT ≥ 4.5:1 on #FBFAF9 · TRUE ≥ 3:1 non-text on the
     white card; teal's literal hex is 2.15:1 on cream and takes the one
     daylight detour #0F8A73 (documented in the styles.css block). */
  /* r160 KODE: lit #B23E00 (5.2:1 on paper) · true the literal
     #FF4C00 · well the paper-orange wash. */
  '--ln-menu': '#B23E00',
  '--ln-menu-true': '#FF4C00',
  '--ln-menu-well': '#FFE3D6',
  '--ln-bot': '#B23E00',
  '--ln-bot-true': '#FF4C00',
  '--ln-bot-well': '#FFE3D6',
  '--ln-order': '#B23E00',
  '--ln-order-true': '#FF4C00',
  '--ln-order-well': '#FFE3D6',
};
const RADIUS = {
  '--r-xs': '6px', '--r-sm': '8px', '--r-md': '10px', '--r-lg': '12px',
  '--r-xl': '16px', '--r-2xl': '20px', '--r-3xl': '28px', '--r-full': '9999px',
};
const MOTION = {
  '--t-micro': '80ms', '--t-fast': '160ms', '--t-base': '240ms',
  '--t-slow': '380ms', '--t-slower': '520ms', '--t-cinema': '720ms',
};
const ELEV_DARK = {
  '--elev-1': '0 1px 2px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)',
  '--elev-2': '0 4px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
  '--elev-3': '0 8px 16px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)',
  '--elev-4': '0 16px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
  '--elev-5': '0 32px 64px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.08)',
};
const ELEV_LIGHT = {
  '--elev-1': '0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.06)',
  '--elev-2': '0 4px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
  '--elev-3': '0 8px 16px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.05)',
  '--elev-4': '0 16px 32px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.06)',
  '--elev-5': '0 32px 64px rgba(0,0,0,0.12), 0 16px 32px rgba(0,0,0,0.08)',
};

// ── r126: component-facing bridge tokens (the ~130-consumer surface) ────────

const BRIDGE_DARK = {
  /* r160 KODE: the safety-orange bridge — #FF4C00 accents on the night
     stage (4.0:1, the spec's accent-grade ruling; body text stays
     --foreground white). */
  '--primary': '#FF4C00',
  '--primary-text': '#FF4C00',
  '--primary-fg': '#050507', // black ink on orange ≈ 6.3:1
  '--ring': '#FF4C00', // the orange focus ring (recolored per spec S5)
  '--accent': 'rgb(255 76 0 / 0.15)', // translucent wash semantics
  '--input-border': 'color-mix(in oklab, #A9ACB4 70%, #0B0B10)', // resolved r13 3:1 border recipe
};
const BRIDGE_LIGHT = {
  /* r160 KODE: orange-on-paper — see ACCENT_LIGHT. */
  '--primary': '#FF4C00',
  '--primary-text': '#B23E00', // text-grade orange — 5.2:1 on paper
  '--primary-fg': '#0A0A0A',
  '--ring': '#B23E00', // the AA focus ring
  '--accent': 'rgb(255 76 0 / 0.12)',
  '--input-border': 'color-mix(in oklab, #55534E 80%, #FFFFFF)',
};

// ── r126: glass + shadow stacks (the runtime side of @theme utilities) ──────

const GLASS_DARK = {
  '--glass-bg-strong': 'rgba(13, 13, 18, 0.92)', /* r160: neutralized night glass */
  '--glass-border': 'rgba(142, 151, 184, 0.12)',
  '--glass-shadow': '0 8px 16px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  '--glass-shadow-lg': '0 16px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.07)',
};
const GLASS_LIGHT = {
  /* r140: 0.92 — قرار الكنون الموحد للزجاج القوي (مدارك 79b5bf9d، الثيمان معًا) */
  '--glass-bg-strong': 'rgba(255, 255, 255, 0.92)',
  '--glass-border': 'rgba(25, 25, 24, 0.06)',
  '--glass-shadow': '0 8px 16px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.05)',
  '--glass-shadow-lg': '0 16px 32px rgba(0, 0, 0, 0.10), 0 8px 16px rgba(0, 0, 0, 0.06)',
};
const SHADOWS_DARK = {
  '--shadow-card': '0 1px 2px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)', // = --elev-1
  '--shadow-card-h': '0 1px 2px rgba(2, 4, 12, 0.50), 0 8px 22px rgba(2, 4, 12, 0.55), 0 0 0 1px rgba(142, 151, 184, 0.08)',
  '--shadow-pop': '0 2px 4px rgba(2, 4, 12, 0.55), 0 10px 28px rgba(2, 4, 12, 0.62), 0 0 0 1px rgba(142, 151, 184, 0.10)',
  '--shadow-modal': '0 12px 32px rgba(2, 4, 12, 0.66), 0 32px 80px rgba(2, 4, 12, 0.70), 0 0 0 1px rgba(142, 151, 184, 0.12)',
  '--t-shadow-lg': '0 2px 4px rgba(2, 4, 12, 0.55), 0 10px 28px rgba(2, 4, 12, 0.62), 0 0 0 1px rgba(142, 151, 184, 0.10)',
  '--t-shadow-xl': '0 12px 32px rgba(2, 4, 12, 0.66), 0 32px 80px rgba(2, 4, 12, 0.70), 0 0 0 1px rgba(142, 151, 184, 0.12)',
  /* P13-2a KODE retirement — re-pin: the glows ride the safety orange
     (was the Madarek gold rgb(233 180 76 / …); alpha ladder unchanged). */
  '--t-glow': '0 0 30px rgb(255 76 0 / 0.25)',
  '--t-glow-strong': '0 0 60px rgb(255 76 0 / 0.35)',
};
const SHADOWS_LIGHT = {
  '--shadow-card': '0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.06)', // = --elev-1
  '--shadow-card-h': '0 1px 2px rgba(15, 15, 15, 0.04), 0 6px 18px rgba(15, 15, 15, 0.06)',
  '--shadow-pop': '0 1px 2px rgba(15, 15, 15, 0.04), 0 8px 24px rgba(15, 15, 15, 0.08)',
  '--shadow-modal': '0 12px 36px rgba(15, 15, 15, 0.10), 0 32px 80px rgba(15, 15, 15, 0.14)',
  '--t-shadow-lg': '0 1px 2px rgba(15, 15, 15, 0.04), 0 8px 24px rgba(15, 15, 15, 0.08)',
  '--t-shadow-xl': '0 12px 36px rgba(15, 15, 15, 0.10), 0 32px 80px rgba(15, 15, 15, 0.14)',
  /* phase6 light gold ruling → P13-2a KODE retirement — re-pin: the
     glows ride the safety orange (alpha ladder unchanged). */
  '--t-glow': '0 0 30px rgb(255 76 0 / 0.14)',
  '--t-glow-strong': '0 0 60px rgb(255 76 0 / 0.22)',
};

// ── r126: surfaces, scrollbar, gen-art, gradients ───────────────────────────

const SURFACES_DARK = { '--surface-sunken': '#0B0B10' }; /* r160 KODE neutral night step */
const SURFACES_LIGHT = { '--surface-sunken': '#F7F6F3' };
const SCROLLBAR_DARK = {
  '--scrollbar-thumb': 'rgba(142, 151, 184, 0.20)',
  '--scrollbar-thumb-hover': 'rgba(142, 151, 184, 0.34)',
};
const SCROLLBAR_LIGHT = {
  '--scrollbar-thumb': 'rgba(25, 25, 24, 0.16)',
  '--scrollbar-thumb-hover': 'rgba(25, 25, 24, 0.28)',
};
const GENART_DARK = {
  /* phase6 (P6-2-a2) — the observatory re-tone: neutral grays retired,
     night-gold hairlines/rings in both grades (decorative furniture). */
  '--genart-accent': '#FF4C00',
  '--genart-accent-dim': 'rgb(255 76 0 / 0.04)',
};
const GENART_LIGHT = { '--genart-accent': '#B23E00', '--genart-accent-dim': 'rgb(178 62 0 / 0.05)' };
const GRADIENTS_DARK = {
  /* (r131 A3 D3: --gradient-text-mid/end removed with the dead
     @utility gradient-text — the tokens had zero consumers since the
     r128 flat-diet; pinning deleted tokens is how drift hides.)
     (r144 P4-4SL: the three --gradient-smart-* / --gradient-coming-soon
     service tokens removed for the SAME reason — zero var() consumers
     since the r128 card rebuild; only the live --grid-line stays.) */
  '--grid-line': 'rgb(255 76 0 / 0.1)',
};
const GRADIENTS_LIGHT = {
  /* (r131 A3 D3: light --gradient-text-mid/end twins removed likewise.
     r144 P4-4SL: the service-gradient light twins removed likewise.
     phase6 light gold ruling: the grid hairline rides the gold hue at
     +2% alpha — gold is lighter than the retired copper.) */
  '--grid-line': 'rgb(255 76 0 / 0.08)',
};

// ── r126: easings (exact rubric béziers) + RTL motion direction ─────────────

const EASINGS = {
  '--ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--ease-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
  '--ease-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--ease-spring-soft': 'cubic-bezier(0.34, 1.18, 0.64, 1)',
  '--ease-spring': 'cubic-bezier(0.34, 1.36, 0.64, 1)',
  '--ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  '--motion-direction': '1',
};

// ── r126: @theme inline bridges (what Tailwind utilities resolve to) ────────

const THEME_FONTS = {
  '--font-sans': '"IBM Plex Sans Arabic", "Tajawal", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  // r129 (A10): --font-heading = the canonical --font-display stack
  // (Madarek tokens.css:49) — the never-loaded Tajawal entry is gone;
  // --font-mono = the canonical pure stack (tokens.css:51) — the
  // Arabic-capable chains now live at their consumers (landing --ln-mono
  // + the secondary-page .ln-mono/.ln-label/.ln-stat-value rules).
  // r132-F4 (A9 SL-N1, adjudicated): --font-serif is GONE — deleted with
  // its two IBM Plex Serif italic faces (zero consumers repo-wide).
  // --font-mono stays: the mono pair is LIVE (downloaded by the .ln-*
  // family-name chains — A9's zero-consumer claim only grepped
  // var(--font-mono)/font-mono and missed them).
  '--font-heading': '"IBM Plex Sans Arabic", system-ui, sans-serif',
  '--font-mono': '"IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace',
};
const THEME_RADIUS = {
  // r127-F6: --radius-xs joins the bridge (was runtime --r-xs only —
  // rounded-xs silently rendered Tailwind's 2px default).
  '--radius-xs': '6px',
  '--radius-sm': '8px', '--radius-md': '10px', '--radius-lg': '12px',
  '--radius-xl': '16px', '--radius-2xl': '20px', '--radius-3xl': '28px',
};
const THEME_SHADOWS = {
  '--shadow-lg': 'var(--t-shadow-lg)',
  '--shadow-xl': 'var(--t-shadow-xl)',
  '--shadow-glow': 'var(--t-glow)',
  '--shadow-glow-strong': 'var(--t-glow-strong)',
};
const THEME_COLORS = {
  '--color-foreground': 'var(--foreground)',
  '--color-muted-foreground': 'var(--muted-foreground)',
  '--color-primary': 'var(--primary)',
  '--color-primary-text': 'var(--primary-text)',
};
const THEME_EASE = {
  // P4-W3c (A1): the FULL canonical easing set rides the Tailwind utility
  // namespace — ease-in/-out override Tailwind's non-canonical defaults
  // (same doctrine as the r126 shadow-xs..2xl → --elev-1..5 bridge:
  // a bare `ease-out` can never render an off-system curve). All seven
  // mirror the :root EASINGS table (smooth = smart-link's utility alias
  // for the Madarek exponential settle).
  '--ease-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--ease-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
  '--ease-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--ease-spring-soft': 'cubic-bezier(0.34, 1.18, 0.64, 1)',
  '--ease-spring': 'cubic-bezier(0.34, 1.36, 0.64, 1)', // r126: was the bounce 1.56 fork
  '--ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// ── r126: the 10-face @font-face manifest (m15 IBM Plex port; r132-F4
//    trimmed the two consumer-less IBM Plex Serif italic faces) ───────

const FONT_MANIFEST = [
  ['plex-sans-arabic-400-normal-arabic.woff2', 'IBM Plex Sans Arabic', '400', 'normal'],
  ['plex-sans-arabic-500-normal-arabic.woff2', 'IBM Plex Sans Arabic', '500', 'normal'],
  ['plex-sans-arabic-600-normal-arabic.woff2', 'IBM Plex Sans Arabic', '600', 'normal'],
  ['plex-sans-arabic-700-normal-arabic.woff2', 'IBM Plex Sans Arabic', '700', 'normal'],
  ['plex-sans-arabic-400-normal-latin.woff2', 'IBM Plex Sans Arabic', '400', 'normal'],
  ['plex-sans-arabic-500-normal-latin.woff2', 'IBM Plex Sans Arabic', '500', 'normal'],
  ['plex-sans-arabic-600-normal-latin.woff2', 'IBM Plex Sans Arabic', '600', 'normal'],
  ['plex-sans-arabic-700-normal-latin.woff2', 'IBM Plex Sans Arabic', '700', 'normal'],
  ['plex-mono-400-normal-latin.woff2', 'IBM Plex Mono', '400', 'normal'],
  ['plex-mono-500-normal-latin.woff2', 'IBM Plex Mono', '500', 'normal'],
];

// ── r126: prefers-contrast overrides (elevations collapse to solid rings,
//    glass goes solid, hairlines strengthen — 10 tokens × 2 themes) ─────────

const CONTRAST_DARK = {
  '--elev-1': '0 0 0 1px rgba(255, 255, 255, 0.36)',
  '--elev-2': '0 0 0 1.5px rgba(255, 255, 255, 0.44)',
  '--elev-3': '0 0 0 2px rgba(255, 255, 255, 0.52)',
  '--elev-4': '0 0 0 2.5px rgba(255, 255, 255, 0.60)',
  '--elev-5': '0 0 0 3px rgba(255, 255, 255, 0.68)',
  '--glass-bg': 'var(--card)',
  '--glass-bg-strong': 'var(--card)',
  '--glass-border': 'rgba(255, 255, 255, 0.36)',
  '--border': 'rgba(255, 255, 255, 0.48)',
  '--border-strong': 'rgba(255, 255, 255, 0.64)',
};
const CONTRAST_LIGHT = {
  '--elev-1': '0 0 0 1px rgba(0, 0, 0, 0.32)',
  '--elev-2': '0 0 0 1.5px rgba(0, 0, 0, 0.40)',
  '--elev-3': '0 0 0 2px rgba(0, 0, 0, 0.48)',
  '--elev-4': '0 0 0 2.5px rgba(0, 0, 0, 0.56)',
  '--elev-5': '0 0 0 3px rgba(0, 0, 0, 0.64)',
  '--glass-bg': 'var(--card)',
  '--glass-bg-strong': 'var(--card)',
  '--glass-border': 'rgba(0, 0, 0, 0.32)',
  '--border': 'rgba(0, 0, 0, 0.42)',
  '--border-strong': 'rgba(0, 0, 0, 0.60)',
};

// ── assertions ───────────────────────────────────────────────────────────────

pinAll(dark, 'dark', GROUNDS_DARK);
pinAll(light, 'light', GROUNDS_LIGHT);
pinAll(dark, 'dark', ACCENT_DARK);
pinAll(light, 'light', ACCENT_LIGHT);
pinAll(dark, 'dark', STATUS_DARK);
pinAll(light, 'light', STATUS_LIGHT);
pin(dark, 'glass-dark', '--glass-bg', 'rgba(11, 11, 16, 0.78)'); /* r160: neutralized night glass */
pin(light, 'glass-light', '--glass-bg', 'rgba(251, 250, 249, 0.78)');

/* phase6 (§0a2-promotion): the pastel family pins are retired WITH the
   tokens (zero var() consumers after the /pricing well migration); the
   promoted foreshadow identities take their place in BOTH themes, plus
   an extinction sweep so the pastels can never resurrect silently. */
pinAll(dark, 'foreshadow-dark', FORESHADOW_DARK);
pinAll(light, 'foreshadow-light', FORESHADOW_LIGHT);
check(
  !/--c-(peach|lavender|mint|sky|yellow|rose|sand|grey|copper)-/.test(css),
  'phase6 pastel extinction: the 9 --c-* section families are gone from styles.css (both themes — retired with the /pricing well migration)'
);

// radius + motion are theme-independent (:root) — assert in both scopes
for (const scope of [dark, light]) {
  pinAll(scope, 'radius', RADIUS);
  pinAll(scope, 'motion', MOTION);
}
pinAll(dark, 'elev-dark', ELEV_DARK);
pinAll(light, 'elev-light', ELEV_LIGHT);

// r126: bridge tokens + glass/shadow stacks + surfaces + scrollbar +
// gen-art + gradients — the surfaces ~130 utilities actually consume.
pinAll(dark, 'bridge-dark', BRIDGE_DARK);
pinAll(light, 'bridge-light', BRIDGE_LIGHT);
pinAll(dark, 'glass-dark', GLASS_DARK);
pinAll(light, 'glass-light', GLASS_LIGHT);
pinAll(dark, 'shadows-dark', SHADOWS_DARK);
pinAll(light, 'shadows-light', SHADOWS_LIGHT);
pinAll(dark, 'surfaces-dark', SURFACES_DARK);
pinAll(light, 'surfaces-light', SURFACES_LIGHT);
pinAll(dark, 'scrollbar-dark', SCROLLBAR_DARK);
pinAll(light, 'scrollbar-light', SCROLLBAR_LIGHT);
pinAll(dark, 'genart-dark', GENART_DARK);
pinAll(light, 'genart-light', GENART_LIGHT);
pinAll(dark, 'gradients-dark', GRADIENTS_DARK);
pinAll(light, 'gradients-light', GRADIENTS_LIGHT);

// r126: easings (exact rubric béziers, :root) + the RTL direction override.
pinAll(dark, 'easings', EASINGS);
pin(rtl, 'rtl', '--motion-direction', '-1');

// r126: @theme inline bridges — the utilities layer resolves through these.
pinAll(theme, 'theme', THEME_FONTS);
pinAll(theme, 'theme', THEME_RADIUS);
pinAll(theme, 'theme', THEME_SHADOWS);
pinAll(theme, 'theme', THEME_COLORS);
pinAll(theme, 'theme', THEME_EASE);

// r126: the font-face manifest — a renamed file or a dropped
// font-display pins follow the optional law since P18-W2-b. r132-F4: 12 → 10 faces (the
// two IBM Plex Serif italic latin cuts deleted — zero consumers).
const fontFaceBlocks = allTopLevelBlocks(css, '@font-face');
check(fontFaceBlocks.length === 10, `font-face manifest must declare exactly 10 faces (got ${fontFaceBlocks.length})`);
for (const [file, family, weight, style] of FONT_MANIFEST) {
  const block = fontFaceBlocks.find((b) => b.includes(`url('/fonts/${file}')`));
  if (block === undefined) {
    failures.push(`font-face for /fonts/${file} is missing from styles.css`);
    continue;
  }
  /* P18-W2-b re-anchor (CLS gate closure, CI red at 55a89cc → sim-devices
     CLS 0.053 > 0.02): root-caused to the font-swap layer — a cold first
     visit swapped the Plex faces in at ~772ms and reflowed the hero
     +56px. The P16-W7 no-swap law (optional) is extended from the two
     preloaded faces to ALL TEN (no swap event can exist anywhere), and
     the above-fold faces are preloaded in layout.tsx so optional still
     lands the real cut on first paint. Value re-anchor only — manifest
     structure, families, weights, unicode-ranges and the disk-existence
     gates are untouched. */
  const displayOk = block.includes('font-display: optional');
  const ok =
    block.includes(`font-family: '${family}'`) &&
    block.includes(`font-weight: ${weight}`) &&
    block.includes(`font-style: ${style}`) &&
    displayOk &&
    /unicode-range:\s*U\+/.test(block);
  check(ok, `font-face ${file} must carry family '${family}', weight ${weight}, style ${style}, font-display: optional and a unicode-range`);
  check(
    existsSync(new URL(`../public/fonts/${file}`, import.meta.url)),
    `public/fonts/${file} must exist on disk (the manifest points at it)`
  );
}

// r126: prefers-contrast overrides — the whole high-contrast port, pinned.
const contrastMedia = topLevelBlock(css, '@media (prefers-contrast: more)');
pinAll(parseDecls(topLevelBlock(contrastMedia, ':root:not(.light)')), 'contrast-dark', CONTRAST_DARK);
pinAll(parseDecls(topLevelBlock(contrastMedia, '.light')), 'contrast-light', CONTRAST_LIGHT);

// r126: the *:focus-visible contract — ONE ring language, no shape mutation.
const focusRule = css.match(/\*:focus-visible\s*\{([^}]*)\}/)?.[1] ?? '';
check(/outline:\s*2px solid var\(--ring\)/.test(focusRule), '*:focus-visible must paint the canonical 2px var(--ring) outline');
check(/outline-offset:\s*2px/.test(focusRule), '*:focus-visible must keep the 2px outline offset');
check(!/border-radius/.test(focusRule), '*:focus-visible must NOT mutate border-radius (r126 unification — outline only)');

// r127-F6: prefers-reduced-motion — the full canonical shape, pinned.
// A6 found Link shipped the universal belt but NOT layer 1 (zeroing the
// --t-* ladder): the belt clamps CSS animation/transition properties,
// while consumers reading var(--t-*) durations directly kept animating.
// Both layers are now asserted, so neither can silently regress.
{
  const rmReduceBlocks = allTopLevelBlocks(css, '@media (prefers-reduced-motion: reduce)');
  check(
    rmReduceBlocks.some(
      (b) => /animation-duration:\s*0\.01ms\s*!important/.test(b) && /transition-duration:\s*0\.01ms\s*!important/.test(b)
    ),
    'the universal RM belt (animation/transition → 0.01ms !important) must stay'
  );
  const rmZeroDecls = rmReduceBlocks
    .map((b) => {
      try {
        return parseDecls(topLevelBlock(b, ':root'));
      } catch {
        return null;
      }
    })
    .find((d) => d !== null && d['--t-micro'] !== undefined);
  check(
    rmZeroDecls !== undefined,
    'a prefers-reduced-motion: reduce block must zero the --t-* duration ladder (:root layer 1)'
  );
  if (rmZeroDecls) {
    for (const t of Object.keys(MOTION)) pin(rmZeroDecls, 'rm-zero', t, '0ms');
  }
}

// ── report ───────────────────────────────────────────────────────────────────

// r128-F2b: the report's exit gate moved BELOW the on-accent block — it
// used to run before the last two checks, so their failures could never
// fail the suite (a dead-code defect: the gate printed a false green at
// 286/287 during the F2b assembly). Same assertions, honest exit order.

// ── r128 F6 · landing layer (src/app/landing.css) ───────────────────────────
// Wave-2 (83dc8b1+7a1fac7) landed the Madarek-journey landing as its own css
// file scoped `.landing` (R4); the 287 product-token pins above say nothing
// about that layer. This block pins the LANDING surface so the Orbit-Ink
// world cannot drift either: the --ln-* token values (PORT-KIT §1), the
// marquee loop arithmetic (R3: 48px track gap, keyframes seam 50%+24px =
// half the gap), the --sp scroll-progress consumers, the R2 scroll-spy
// selector family, the R7 grain veil, the R3 marquee RM off-switch, and
// the R4 scope isolation in both directions. Same harness: pin() resolves
// var() chains inside the merged .landing scope (two exact-`.landing`
// blocks), check() for structural assertions.
{
  const lcss = readFileSync(new URL('../src/app/landing.css', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
  const landingScope = Object.assign(
    {},
    ...allTopLevelBlocks(lcss, '.landing').map(parseDecls)
  );

  // 1 ── the --ln-* token surface (r152 phase5: مدارك Night — the family
  //     identity). The Orbit-Ink values (ink #252A3E / lime #DFEDB2 /
  //     violet #7A6BF2) retired with the experiment; the landing now
  //     paints the styles.css night world's OWN values (night #070B16 /
  //     sand #F2EFE6 / gold #E9B44C) + the §0a2 product-foreshadow pairs
  //     (the three siblings' Phase-5 identity hexes, lit + true grades)
  //     + the night glass. The motion aliases pin the CHAIN (var(--t-*)/
  //     var(--ease-*)) — those tokens are not redefined inside .landing,
  //     so resolve() leaves the reference verbatim; --ln-t-reveal
  //     resolves through the in-scope 360ms bridge to its canonical value.
  pinAll(landingScope, 'landing', {
    /* r160 KODE: the landing scope re-pinned to the 3-color discipline
       (S3) — night #050507 / white + grey / #FF4C00. The per-world
       foreshadow hues collapsed onto the accent; the glass slots carry
       the flat night panel values (glass retired). */
    '--ln-ink':         '#050507',
    '--ln-ink-2':       '#0B0B10',
    '--ln-cream':       '#FFFFFF',
    '--ln-cream-dim':   '#A9ACB4',
    '--ln-gold':        '#FF4C00',
    '--ln-gold-deep':   '#FF6A2E',
    '--ln-line':        'rgba(255, 255, 255, 0.16)',
    '--ln-line-soft':   'rgba(255, 255, 255, 0.08)',
    '--ln-menu':        '#FF4C00',
    '--ln-menu-true':   '#FF4C00',
    '--ln-bot':         '#FF4C00',
    '--ln-bot-true':    '#FF4C00',
    '--ln-order':       '#FF4C00',
    '--ln-order-true':  '#FF4C00',
    '--ln-glass':       'rgba(11, 11, 16, 0.92)',
    '--ln-glass-strong': 'rgba(11, 11, 16, 0.97)',
    '--ln-grain-op':    '0.075', /* r129: canonical landing-local P3-22 lift (Madarek landing.css:58) — ruling adopted over PORT-KIT R7's 0.05 */
    '--ln-radius-pill': 'var(--r-full)',
    '--ln-h1':          'clamp(3.5rem, 13vw, 11.875rem)', /* r160 S1: the KODE lockup scale */
    '--ln-dur-marquee': '42s',
    '--ln-t-fast':      'var(--t-fast)',
    '--ln-t-base':      'var(--t-base)',
    '--ln-t-slow':      'var(--t-slow)',
    '--ln-t-cinema':    'var(--t-cinema)',
    '--ln-t-reveal':    '360ms',
    '--ln-ease':        'var(--ease)',
    '--ln-ease-out':    'var(--ease-out)',
    '--ln-ease-soft':   'var(--ease-soft)',
    '--ln-ease-spring': 'var(--ease-spring)',
    '--ln-ease-linear': 'linear',
  });

  // 2 ── the marquee loop (R3): seamless RTL duplicate-list loop.
  const marqueeKf = topLevelBlock(lcss, '@keyframes ln-marquee');
  check(
    /from\s*\{[^}]*translateX\(0\)/.test(marqueeKf),
    'landing @keyframes ln-marquee: from translateX(0)'
  );
  check(
    /to\s*\{[^}]*translateX\(calc\(50%\s*\+\s*24px\)\)/.test(marqueeKf),
    'landing @keyframes ln-marquee: to translateX(calc(50% + 24px)) — the seam is HALF the track gap'
  );
  const track = topLevelBlock(lcss, '.landing .ln-marquee-track');
  check(/gap:\s*48px/.test(track), 'landing .ln-marquee-track: 48px track gap (lockstep with the +24px seam)');
  check(
    /animation:\s*ln-marquee\s+var\(--ln-dur-marquee\)\s+var\(--ln-ease-linear\)\s+infinite/.test(track),
    'landing .ln-marquee-track: animation ln-marquee var(--ln-dur-marquee) var(--ln-ease-linear) infinite'
  );

  // 3 ── --sp consumers: the useSectionProgress scrub surface.
  //     r148 (19-AUDIT-SL D3): this consumer pin counted TWO canonical
  //     producers-to-css contracts — but the journey light-path half
  //     had been dead since the beam rebuild (zero TSX consumers;
  //     JourneySection renders .ln-beam*). The pin was protecting ~20
  //     dead CSS lines — the exact drift-hiding class r144 taught
  //     against — so it is RETIRED here together with the dead rules
  //     themselves (the .ln-journey-path* family + the straggler
  //     .ln-cta-orbit.o1). The live --sp consumers stay pinned: the
  //     chapter wash below and the beam family in JourneySection.
  //     EXPECTED_ASSERTIONS 525 → 524 (the ONLY authorized pin-count
  //     change of the r148 wave).
  check(
    /opacity:\s*calc\(var\(--sp,\s*0\)\s*\*\s*0\.5\)/.test(topLevelBlock(lcss, '.landing .ln-chapter::before')),
    'landing --sp consumer: .ln-chapter::before opacity calc(var(--sp, 0) * 0.5)'
  );

  // 4 ── scroll-spy selectors (R2): the observer writes
  //     header[data-active-section]; these selectors are the css half
  //     of the contract, on the shipped anchor set. r144 (P4-4SL): the
  //     roster follows the r142 chapter map — the #trust/#roles anchors
  //     died with their sections and their selector lines were excised.
  for (const anchor of ['products', 'journey', 'progress', 'platforms']) {
    check(
      lcss.includes(`.landing header[data-active-section="${anchor}"] .landing-nav-link[href="#${anchor}"]`),
      `landing scroll-spy selector for #${anchor} (R2)`
    );
  }
  check(
    !lcss.includes('data-active-section="trust"') && !lcss.includes('data-active-section="roles"'),
    'r144: the retired #trust/#roles spy selectors no longer exist (r142 chapter map is the truth)'
  );

  // 5 ── the grain veil (R7): fixed, inert, riding --ln-grain-op.
  const grain = topLevelBlock(lcss, '.landing .ln-grain');
  check(
    /opacity:\s*var\(--ln-grain-op\)/.test(grain),
    'landing .ln-grain: opacity var(--ln-grain-op)'
  );
  check(
    /position:\s*fixed/.test(grain) && /pointer-events:\s*none/.test(grain),
    'landing .ln-grain: fixed veil, pointer-events none'
  );

  // 6 ── the marquee RM off-switch (R3): the one raw-duration loop that
  //     the --ln-t-* alias zeroing cannot reach.
  const lrm = allTopLevelBlocks(lcss, '@media (prefers-reduced-motion: reduce)').join('\n');
  check(
    /\.ln-marquee-track\s*\{[^}]*animation:\s*none/.test(lrm),
    'landing marquee RM off-switch: .ln-marquee-track { animation: none } under prefers-reduced-motion: reduce'
  );

  // 7 ── R4 scope isolation, re-truthed (phase6 §0a2-promotion): the
  //     product sheet now carries EXACTLY the promoted foreshadow set
  //     (lit/true/well per world) — anything else --ln-* in styles.css
  //     is still a leak. landing.css keeps its own .landing-scoped set
  //     (or at-rule-nested) for everything, and the drift gate below
  //     pins the two sheets equal.
  {
    const allowed = new Set([
      '--ln-menu', '--ln-menu-true', '--ln-menu-well',
      '--ln-bot', '--ln-bot-true', '--ln-bot-well',
      '--ln-order', '--ln-order-true', '--ln-order-well',
    ]);
    const declared = [...css.matchAll(/--ln-[\w-]+(?=\s*:)/g)].map((m) => m[0]);
    const leaks = declared.filter((t) => !allowed.has(t));
    check(
      leaks.length === 0,
      `R4 isolation: styles.css declares ONLY the promoted §0a2 set (leaks: ${JSON.stringify([...new Set(leaks)])})`
    );
    // the two-sheet drift gate: the six identity tokens must be equal in
    // both sheets (the landing is night-only; the -well grounds have no
    // landing twin by design — they are product-page anatomy).
    for (const name of ['--ln-menu', '--ln-menu-true', '--ln-bot', '--ln-bot-true', '--ln-order', '--ln-order-true']) {
      check(
        norm(dark[name]) === norm(landingScope[name]),
        `§0a2 promotion drift gate: styles.css ${name} (${dark[name]}) must equal the landing twin (${landingScope[name]}) — one-sheet value changes are drift, not decisions`
      );
    }
  }
  {
    let leak = null;
    let i = 0;
    while (i < lcss.length) {
      const open = lcss.indexOf('{', i);
      if (open === -1) break;
      let depth = 1;
      let j = open + 1;
      while (j < lcss.length && depth > 0) {
        if (lcss[j] === '{') depth += 1;
        else if (lcss[j] === '}') depth -= 1;
        j += 1;
      }
      const prelude = lcss.slice(i, open).split(/[;}]/).pop().trim();
      /* phase9 (P9-3-a E3): html.light .landing is the sanctioned DAY-STAGE
         scope (§15a) — it still carries the .landing root inside the
         compound selector, so R4's "no --ln-* outside .landing" law holds;
         every other scope (html.dark, body, .anything-else) stays a leak. */
      if (!prelude.startsWith('.landing') && !prelude.startsWith('html.light .landing') && !prelude.startsWith('@') && /--ln-[\w-]+\s*:/.test(lcss.slice(open + 1, j - 1))) {
        leak = prelude;
        break;
      }
      i = j;
    }
    check(
      leak === null,
      `R4 isolation: every --ln-* declaration in landing.css is .landing-scoped (leaked via: ${leak})`
    );
  }

  // 8 ── NEGATIVE CONTROL — the new landing pins must have teeth: pin()
  //     against a scope carrying a DRIFTED --ln-ink has to record a
  //     failure. The planted failure is then retracted so the control
  //     itself never fails the suite. (r152: the planted drift is now
  //     the RETIRED Orbit-Ink ground — the exact regression the pin
  //     guards against, an accidental return of the old layer.)
  {
    const before = failures.length;
    const passedBefore = passed;
    pin({ ...landingScope, '--ln-ink': '#252A3E' }, 'landing-neg', '--ln-ink', '#070B16');
    check(
      failures.length === before + 1 && passed === passedBefore,
      'negative control: a drifted --ln-ink value FAILS the landing pin'
    );
    failures.length = before;
  }
}

// ── phase9 (P9-3-a) · the LIGHT stage (mission E3: the toggle must    ──────
//    meaningfully affect the landing). The night §0a pins above stay
//    byte-identical; this block pins the DAY twin — the html.light
//    .landing token block (§15a of landing.css), its completeness (a
//    forgotten token would silently paint night values on paper), the
//    luminous-gold CTA exception, the toggle's contract, and the
//    engine's theme repaint wiring.
{
  const lcssP9 = readFileSync(new URL('../src/app/landing.css', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
  const headerSrcP9 = readFileSync(new URL('../src/components/landing/LandingHeader.tsx', import.meta.url), 'utf8');
  /* r160: the sculpture engine replaces the constellation engine in the
     theme-repaint contract. */
  const chainSrcP9 = readFileSync(new URL('../src/components/landing/ChainSculpture.tsx', import.meta.url), 'utf8');

  const lightBlocks = allTopLevelBlocks(lcssP9, 'html.light .landing');
  check(
    lightBlocks.length === 1,
    `phase9 light stage: exactly ONE html.light .landing token block (§15a — found ${lightBlocks.length})`
  );
  const landingLight = Object.assign({}, ...lightBlocks.map(parseDecls));

  // completeness: every color-ish var the night stage defines must have
  // a day twin — the flip is total or it is a leak of night paint.
  const nightScopeP9 = Object.assign(
    {},
    ...allTopLevelBlocks(lcssP9, '.landing').map(parseDecls)
  );
  const LIGHT_MUST_FLIP = [
    '--ln-ink', '--ln-ink-2', '--ln-cream', '--ln-cream-dim',
    '--ln-gold', '--ln-gold-deep', '--ln-line', '--ln-line-soft',
    '--ln-grain-op', '--ln-glass', '--ln-glass-strong',
    '--ln-menu', '--ln-menu-true', '--ln-bot', '--ln-bot-true',
    '--ln-order', '--ln-order-true',
  ];
  check(
    LIGHT_MUST_FLIP.every((t) => landingLight[t] !== undefined),
    `phase9 light stage: every --ln-* color token flips (missing: ${LIGHT_MUST_FLIP.filter((t) => landingLight[t] === undefined).join(', ')})`
  );

  // the day values (r160 KODE: paper #F4F2ED / ink #0A0A0A / orange —
  // lit #B23E00 text-grade, true #FF4C00; ratios in landing.css §15a):
  pinAll(landingLight, 'landing-light', {
    '--ln-ink':        '#F4F2ED',
    '--ln-ink-2':      '#EAE7DF',
    '--ln-cream':      '#0A0A0A',
    '--ln-cream-dim':  '#55534E',
    '--ln-gold':       '#B23E00',
    '--ln-gold-deep':  '#8F3000',
    '--ln-line':       'rgba(10, 10, 10, 0.18)',
    '--ln-line-soft':  'rgba(10, 10, 10, 0.09)',
    '--ln-grain-op':   '0.05',
    '--ln-menu':       '#B23E00',
    '--ln-menu-true':  '#FF4C00',
    '--ln-bot':        '#B23E00',
    '--ln-bot-true':   '#FF4C00',
    '--ln-order':      '#B23E00',
    '--ln-order-true': '#FF4C00',
    '--ln-glass':       'rgba(244, 242, 237, 0.94)',
    '--ln-glass-strong': 'rgba(244, 242, 237, 0.98)',
  });

  // the night stage stays the DEFAULT: the exact-.landing scope (which
  // the dark pins above already value-pin) must not carry the PAPER
  // ground — the day values may live only under the html.light compound.
  check(
    nightScopeP9['--ln-ink'] === '#050507',
    'phase9 light stage: the default .landing scope stays the NIGHT stage (--ln-ink #050507 — the paper ground lives only under html.light)'
  );

  // r160 KODE: the CTA family is the ORANGE UNDERLINE SWEEP now (the
  // gold pill retired) — the night scope carries the sweep anatomy and
  // the light scope keeps the text-grade orange ink (#B23E00 = var
  // (--ln-gold) in the day). The sweep itself is stage-independent.
  check(
    /\.landing \.ln-btn-gold\s*\{[^}]*background:\s*transparent;[^}]*color:\s*var\(--ln-gold\)/.test(lcssP9)
      && /\.landing \.ln-btn-gold::before\s*\{[^}]*background:\s*currentColor/.test(lcssP9)
      && /\.landing \.ln-btn-gold:hover::before[\s\S]*?transform:\s*scaleX\(1\)/.test(lcssP9),
    'r160 CTA: .ln-btn-gold is the flat orange underline sweep (transparent ground, currentColor rule, scaleX(1) on hover — S4 finale treatment)'
  );

  // the toggle: the family twin contract on the landing chrome —
  // mounted guard, resolvedTheme, the family aria-labels, 44px floor.
  check(
    /landing-theme-toggle/.test(headerSrcP9)
      && headerSrcP9.includes('useSyncExternalStore')
      && headerSrcP9.includes('resolvedTheme')
      && headerSrcP9.includes('"تفعيل المظهر الفاتح"')
      && headerSrcP9.includes('"تفعيل المظهر الداكن"'),
    'phase9 toggle: LandingHeader carries the family twin (mounted guard + resolvedTheme + the family aria-labels)'
  );
  check(
    /\.landing \.landing-theme-toggle\s*\{[^}]*block-size:\s*44px;[^}]*min-block-size:\s*44px;/.test(lcssP9)
      && /\.landing \.landing-theme-toggle-icon\s*\{[^}]*transition:\s*transform/.test(lcssP9),
    'phase9 toggle: the 44px touch floor + the icon flip transition (landing.css §15c)'
  );

  // the engine: the sculpture follows the theme (MutationObserver on
  // the html class → readStage() re-reads the --ln-* tokens → repaint).
  check(
    chainSrcP9.includes('readStage')
      && chainSrcP9.includes('new MutationObserver(paint)')
      && /attributeFilter: \[['"]class['"]\]/.test(chainSrcP9)
      && chainSrcP9.includes('mo.disconnect()'),
    'r160 engine: ChainSculpture re-reads the landing tokens on html class change (MutationObserver + paint + teardown)'
  );
}

// ── r129 F1 · canonical differential fixes (audits/r129/smartlink- ──────────
//    differential.md §6 pins 1-24 + the OrbitScene port-triplet pins + the
//    token-matrix fixes + the ruling-gated items ruled CANONICAL). Every
//    r129 fix is pinned here: the micro-depth family, the P4-10 measures,
//    the compact header CTA, the 1080 burger, the skip link + universal
//    focus ring, the constellation anatomy (6 rings / 8px pins / cream
//    0.65 idle / resting cycle / browse strip), the OrbitScene canvas
//    port (palette triplets, rad/ms omegas, DPR cap, intro key), and the
//    styles.css token additions (gold family, --ease-spring-snappy,
//    --hover-lift, canonical font stacks).
{
  const lcss = readFileSync(new URL('../src/app/landing.css', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
  const read = (p) => readFileSync(new URL(`../src/components/landing/${p}`, import.meta.url), 'utf8');
  const pageSrc = readFileSync(new URL('../src/app/page.tsx', import.meta.url), 'utf8');
  const productsSrc = read('WorldsSection.tsx');
  const rolesSrc = read('WorldsSection.tsx');
  const progressSrc = read('CockpitSection.tsx');
  const platformsSrc = read('PlatformsSection.tsx');
  const finaleSrc = read('FinaleCta.tsx');
  const layoutRaw = readFileSync(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
  const siteChromeRaw = readFileSync(new URL('../src/components/site-chrome.tsx', import.meta.url), 'utf8');
  const faqSrc = read('LandingFaq.tsx');
  const footerSrc = read('LandingFooter.tsx');
  const orbitSrc = read('ChainSculpture.tsx'); /* r160: the sculpture is the hero engine now */
  const worldsSrc = read('worlds.ts');
  const lrm129 = allTopLevelBlocks(lcss, '@media (prefers-reduced-motion: reduce)').join('\n');

  // A ── P4-18 label halo + the resting micro-depth family (P3-28..35).
  check(
    /radial-gradient\(ellipse at center, var\(--ln-gold\) 0%, transparent 70%\)/.test(topLevelBlock(lcss, '.landing .ln-label::before')),
    'landing .ln-label::before: gold halo radial (P4-18; r152 repaint)'
  );
  check(
    allTopLevelBlocks(lcss, '.landing .ln-label').some((b) => /position:\s*relative/.test(b)),
    'landing .ln-label: position relative (P4-18 halo anchor)'
  );
  check(
    /box-shadow:\s*0 1px 2px rgba\(0,\s*0,\s*0,\s*0\.06\)/.test(topLevelBlock(lcss, '.landing .ln-station-card'))
      || allTopLevelBlocks(lcss, '.landing .ln-station-card').some((b) => /box-shadow:\s*0 1px 2px rgba\(0,\s*0,\s*0,\s*0\.06\)/.test(b)),
    'landing .ln-station-card: resting shadow 0 1px 2px rgba(0,0,0,0.06) (P3-28)'
  );
  check(
    /box-shadow:\s*0 1px 2px rgba\(0,\s*0,\s*0,\s*0\.06\)/.test(topLevelBlock(lcss, '.landing .ln-stat')),
    'landing .ln-stat: resting shadow 0 1px 2px rgba(0,0,0,0.06) (P3-30)'
  );
  // r144 (P4-4SL): the r142 rebuild RETIRED whole landing chapters —
  // the old products-constellation (ln-products*/ln-constellation*), the
  // progress story (ln-progress*), the roles ledger (ln-roles-list/
  // ln-role-*), the trust-band anatomy (ln-trust-inner/ln-trust-sep),
  // the r141 starfield plane (ln-hero-depth) and the r141-universe layer
  // (nebula/orrery/tip-world — NOT the cta-family crest: see the pin
  // below, the crest was restored to the finale the same round).
  // Every rule body had ZERO TSX consumers (rg-verified per family) —
  // the pins below previously kept the dead rules alive by asserting
  // their values; they now assert the retirement itself, so the dead
  // chapters can never "resurrect".
  const retiredSelectors = [
    '.ln-products', '.ln-constellation', '.ln-progress', '.ln-roles',
    '.ln-role-row', '.ln-role-key', '.ln-role-ico', '.ln-role-name',
    '.ln-role-index', '.ln-role-desc', '.ln-role-quote',
    '.ln-trust-inner', '.ln-trust-sep', '.ln-hero-depth',
    '.ln-constellation-nebula', '.ln-constellation-orrery',
  ];
  check(
    retiredSelectors.every((sel) => !lcss.includes(`.landing ${sel}`)),
    'r144: every retired r128/r141 chapter family is excised from landing.css (products-constellation/progress/roles/trust-inner/hero-depth/r141-universe-minus-the-crest)'
  );
  // r144 (P4-4SL, QA P1): the FAMILY CREST returns to the finale. The
  // r142 rewrite had retired the r141 crest image — a unilateral
  // deviation from the r142 spec («شعار العائلة الختامي family.webp
  // float») that left a ~1200px dead void before the footer (production
  // QA flagged `family` absent from the whole DOM). The crest ships
  // again: FinaleCta renders the masked art, landing.css carries the
  // float (token easing), reduced-motion stands still, and the asset
  // exists on disk (the font-manifest lesson: pinned paths must exist).
  check(
    !/\.landing \.ln-role-quote-mark--end\s*\{[^}]*margin-inline-start:\s*6px/.test(lcss)
      && !/\.landing \.ln-role-ico\.azure\s*\{/.test(lcss),
    'r144: the roles-quote «» twin + role-ico.azure 3:1 pins retire WITH the dead roles chapter (the live .ln-menu-ico.azure keeps its 0.16 wash)'
  );
  check(
    !/\.ln-platform-name|\.ln-platform-desc|\.ln-platform-tag|\.ln-platforms-grid|\.ln-platform-cell/.test(lcss),
    'r144: the pre-r142 platforms anatomy twins (ln-platform-name/desc/tag/grid/cell) are gone — the live surface consumes ln-ground-* + .ln-platform-ico only'
  );
  check(
    /box-shadow:\s*0 1px 2px rgba\(0,\s*0,\s*0,\s*0\.06\)/.test(topLevelBlock(lcss, '.landing .ln-stat'))
      && /\.landing\[data-intro-seen='true'\] \.ln-hero-canvas/.test(lcss),
    'r144: the LIVE consumers of the retired chapters stay pinned (.ln-stat cockpit readout + canvas intro calm)'
  );
  const ctaFamilyRule = topLevelBlock(lcss, '.landing .ln-cta-family');
  check(
    /inline-size:\s*min\(240px,\s*52vw\)/.test(ctaFamilyRule)
      && /mask-image:\s*radial-gradient\(circle at 50% 50%, rgba\(0,\s*0,\s*0,\s*1\) 42%, transparent 68%\)/.test(ctaFamilyRule)
      && /animation:\s*ln-cta-family-float 9s var\(--ln-ease-soft\) infinite/.test(ctaFamilyRule)
      && lcss.includes('@keyframes ln-cta-family-float')
      && /\.landing \.ln-cta-family \{ animation: none; \}/.test(lcss)
      && existsSync(new URL('../public/images/ecosystem/family.webp', import.meta.url))
      && finaleSrc.includes('images/ecosystem/family.webp'),
    'r144 QA-P1: the family crest finale ships — masked circular art (min(240px,52vw)), slow float on the token easing, reduced-motion stands still, and public/images/ecosystem/family.webp exists on disk (FinaleCta consumes it)'
  );

  // B ── P4-10 effective measures.
  check(
    /max-inline-size:\s*20ch/.test(topLevelBlock(lcss, '.landing .ln-hero-title')),
    'landing .ln-hero-title: max-inline-size 20ch (P4-10)'
  );
  check(
    /max-inline-size:\s*72ch/.test(topLevelBlock(lcss, '.landing .ln-hero-sub')),
    'landing .ln-hero-sub: max-inline-size 72ch (P4-10)'
  );
  check(
    /max-inline-size:\s*72ch/.test(topLevelBlock(lcss, '.landing .ln-chapter-lede')),
    'landing .ln-chapter-lede: max-inline-size 72ch (P4-10)'
  );
  check(
    /max-inline-size:\s*72ch/.test(topLevelBlock(lcss, '.landing .ln-cta-lede')),
    'landing .ln-cta-lede: max-inline-size 72ch (P4-10)'
  );

  // C ── burger breakpoint 1080 + the 1081 guard (P0-10).
  check(
    lcss.includes('@media (max-width: 1080px)') && !/max-width:\s*1024px[^@]*landing-nav-links/.test(lcss),
    'landing burger breakpoint: 1080px (canonical), not 1024px'
  );
  check(
    lcss.includes('@media (min-width: 1081px)'),
    'landing burger guard: min-width 1081px hides the mobile menu'
  );

  // D ── the compact header CTA pair (P0-1, ruling): 44px / 12px /
  //     --ln-line ghost / flat lime, non-magnetic, no sheen.
  check(
    /min-block-size:\s*44px/.test(topLevelBlock(lcss, '.landing .landing-header-cta .ln-btn-ghost'))
      && /font-size:\s*12px/.test(topLevelBlock(lcss, '.landing .landing-header-cta .ln-btn-ghost'))
      && /border-color:\s*var\(--ln-line\)/.test(topLevelBlock(lcss, '.landing .landing-header-cta .ln-btn-ghost')),
    'landing header CTA ghost: 44px / 12px / --ln-line hairline (canonical compact re-skin)'
  );
  check(
    /min-block-size:\s*44px/.test(topLevelBlock(lcss, '.landing .landing-header-cta .ln-btn-gold'))
      && /font-size:\s*12px/.test(topLevelBlock(lcss, '.landing .landing-header-cta .ln-btn-gold'))
      && /transform:\s*none/.test(topLevelBlock(lcss, '.landing .landing-header-cta .ln-btn-gold')),
    'landing header CTA primary: 44px / 12px / flat (no magnetic translate)'
  );
  check(
    /\.landing-header-cta \.ln-btn-gold::after\s*\{[^}]*display:\s*none/.test(lcss),
    'landing header CTA primary: hero sheen ::after disabled'
  );

  // E ── universal cream focus ring + skip link (P2 rows 18/19).
  check(
    /outline:\s*2px solid var\(--ln-cream\)/.test(topLevelBlock(lcss, '.landing :focus-visible'))
      && /outline-offset:\s*3px/.test(topLevelBlock(lcss, '.landing :focus-visible')),
    'landing universal focus ring: 2px cream, offset 3px'
  );
  const skip = topLevelBlock(lcss, '.landing .ln-skip-link');
  check(
    /background:\s*var\(--ln-gold\)/.test(skip) && /z-index:\s*2100/.test(skip),
    'landing .ln-skip-link: gold pill above the grain veil (z-2100; r152 repaint)'
  );
  // 15-SL (قبول 14-a P3): التوأم الميت حُفر — ال layout الجذري لا يصيّر
  //    حبوبة تخطٍّ ذهبية إلى #main-content أبدًا (كانت على ال landing
  //    رابطًا إلى مرساة غير موجودة، وlanding.css كان يحجبها بقاعدة
  //    display:none). الآن: الرابط وهدفه في SiteChrome (أول Tab على
  //    صفحات المنتجات، الرابط قبل <main> نفسه)، الرئيسية تملك حبوبتها
  //    الجيرية الكنسية → #main (مثبتة أعلاه)، ولا هاك إخفاء يُصان.
  //    رابط تخطٍّ واحد حي لكل سطح.
  check(
    !/href="#main-content"/.test(layoutRaw)
      && !/body > a\[href="#main-content"\]/.test(lcss)
      && siteChromeRaw.includes('href="#main-content"')
      && siteChromeRaw.indexOf('href="#main-content"') < siteChromeRaw.indexOf('<main id="main-content"'),
    '15-SL: one functional skip link per surface — the root layout renders no #main-content pill (the dead landing twin excised with its landing.css hide hack), and SiteChrome owns the gold pill before its own #main-content target'
  );

  // F ── edge/a11y family: safe-area, RM active, @390, landscape.
  check(
    /env\(safe-area-inset-bottom/.test(lcss),
    'landing .landing-mobile-menu: safe-area padding-block-end (P4-06)'
  );
  check(
    /\.ln-btn-gold:active[^}]*transform:\s*none/.test(lrm129),
    'landing RM P4-07: :active transforms disabled under prefers-reduced-motion'
  );
  check(
    !/\.ln-trust-inner/.test(lcss) && !/@media \(max-width: 390px\)\s*\{\s*\}/.test(lcss),
    'r144: the @390 trust-inner tightening retired with the dead trust-band anatomy (no empty 390px block left behind)'
  );
  check(
    lcss.includes('@media (max-height: 560px) and (orientation: landscape)'),
    'landing landscape-phone hero compression block (P2-14)'
  );
  check(
    lcss.includes('@media (max-height: 560px) and (orientation: landscape)'),
    'landing landscape-phone hero compression block (P2-14)'
  );

  // G ── interaction tails: footer underline (P4-13), scroll invite (P4-12).
  check(
    /text-underline-offset:\s*4px/.test(topLevelBlock(lcss, '.landing .landing-footer-link:hover')),
    'landing footer link hover underline (P4-13)'
  );
  check(
    /scaleY\(1\.3\)/.test(topLevelBlock(lcss, '.landing .ln-hero-scroll:hover .ln-hero-scroll-line')),
    'landing scroll-invite hover scaleY(1.3) (P4-12)'
  );
  check(
    /\.landing-progress\s*\{[^}]*opacity:\s*1\s*!important/.test(lcss),
    'landing progress ribbon: opacity 1 !important guard (P3-32)'
  );

  // H ── TSX structural pins (P0-12 / P0-13 / P0-14).
  check(
    !/<div>\s*<p className="ln-role-desc"/.test(rolesSrc),
    'roles rows: desc + quote are direct li children (canonical grid placement — no wrapper div)'
  );
  check(
    /ln-stat-unit/.test(progressSrc),
    'progress stats ride the canonical .ln-stat-unit span for suffixes'
  );
  check(
    /LibyaFlag size=\{14\}/.test(footerSrc),
    'landing footer bottom cluster: 14px LibyaFlag glyph (P0-14)'
  );

  // I ── r142 «الكوكبة الحية»: the worlds registry + the constellation
  //     engine anatomy (the old products-constellation pins are retired
  //     with ProductsSection; the new pins assert the SAME craft
  //     discipline on the r142 architecture).
  check(
    worldsSrc.includes('id: "menu"') && worldsSrc.includes('id: "order"') && pageSrc.includes('WorldsSection'),
    'r142 worlds: the editorial worlds chapter is mounted (WorldsSection replaces products+roles)'
  );
  check(
    (worldsSrc.match(/token: "--ln-/g) || []).length === 3,
    'r152 worlds: exactly THREE world hues — --ln-menu / --ln-bot / --ln-order (token names only, never literals)'
  );
  check(
    worldsSrc.includes('swatch: "--ln-menu-true"') && worldsSrc.includes('swatch: "--ln-bot-true"') && worldsSrc.includes('swatch: "--ln-order-true"')
      && worldsSrc.includes('motif: "plate"') && worldsSrc.includes('motif: "circuit"') && worldsSrc.includes('motif: "route"'),
    'r152 foreshadow: every world carries its swatch token (the sibling\'s literal identity hex) + its motif (plate/circuit/route)'
  );
  check(
    worldsSrc.includes('menu.smart-link.ly') && worldsSrc.includes('bot.smart-link.ly') && worldsSrc.includes('order.smart-link.ly'),
    'r142 worlds: the three LIVE domains verbatim (the dock chips + preview card ride the same registry)'
  );
  check(
    (worldsSrc.match(/claims: \[/g) || []).length === 3,
    'r142 worlds: each world carries exactly THREE real claims (no invented marketing filler)'
  );
  check(
    orbitSrc.includes('getComputedStyle') && orbitSrc.includes('--ln-chain-metal')
      && orbitSrc.includes('--ln-gold') && orbitSrc.includes('--ln-ink'),
    'r160 sculpture: the STAGE (metal/rim/fog) resolves from landing.css tokens at mount (getComputedStyle — the canvas and the DOM share one palette; the studio rig temperatures are engine-internal)'
  );
  check(
    /new WebGLRenderer/.test(orbitSrc) && /MeshStandardMaterial/.test(orbitSrc) && /TorusGeometry/.test(orbitSrc),
    'r160 sculpture: plain three.js, MeshStandardMaterial + TorusGeometry (5–7 interlocked links — no r3f)'
  );
  check(
    orbitSrc.includes('LINKS = 7'),
    'r160 sculpture: 7 interlocked torus links (the ascending chain — رابط → منظومة)'
  );
  check(
    /pointerdown/.test(orbitSrc) && /pointermove/.test(orbitSrc) && /velY \*= 0\.92/.test(orbitSrc),
    'r160 sculpture: pointer-drag rotation with inertia (velocity decay 0.92)'
  );
  check(
    readFileSync(new URL('../src/components/landing/ChainSculptureMount.tsx', import.meta.url), 'utf8')
      .includes('ssr: false'),
    'r160 sculpture: mounted via the client wrapper (dynamic ssr:false lives in ChainSculptureMount — Server Components cannot pass it)'
  );

  // J ── marquee fill (P2-10): ≥15 items so one copy fills ≥2200px.
  {
    const block = pageSrc.match(/MARQUEE_ITEMS = \[([\s\S]*?)\]/)?.[1] ?? '';
    const items = (block.match(/"/g) ?? []).length / 2;
    check(items >= 15, `landing marquee: ≥15 items so the ×2 track fills ≥2200px viewports (found ${items})`);
  }

  // K ── chapter labels: the r142 canonical sequence (01 worlds → 02
  //     journey → 03 cockpit → finale unnumbered-04 → faq 05; platforms
  //     stays unlabelled).
  check(productsSrc.includes('001 — العوالم'), "r160 chapter label: '001 — العوالم' (S5 mono index sequence)");
  check(finaleSrc.includes('004 — الوصول'), "r160 chapter label: '004 — الوصول' (S5 mono index sequence)");
  check(!platformsSrc.includes('className="ln-label"'), 'platforms chapter carries NO ln-label (canonical campus is unlabelled)');
  check(faqSrc.includes('005 — الأسئلة'), 'r160 faq label follows the mono index sequence (005)');

  // L ── main landmark: focusable skip target (P0-28).
  check(
    /tabIndex=\{-1\}/.test(pageSrc) && /id="main"/.test(pageSrc),
    'landing main: id="main" + tabIndex -1 (focusable skip target)'
  );

  // M ── the ChainSculpture craft contract (r160 — the constellation
  //     port pins re-asserted on the NEW engine, values honest to it).
  check(/Math\.min\(window\.devicePixelRatio \|\| 1, 2\)/.test(orbitSrc), 'r160 sculpture: DPR hard cap 2 (retina paints ≤2× CSS px)');
  check(/Math\.min\(\(now - last\) \/ 1000, 0\.05\)/.test(orbitSrc), 'r160 sculpture: 50ms dt clamp (tab-return visual diet)');
  check(/new IntersectionObserver/.test(orbitSrc) && /document\.hidden/.test(orbitSrc), 'r160 sculpture: IntersectionObserver + document.hidden pause (offscreen the rAF stops)');
  check(orbitSrc.includes('prefers-reduced-motion') && orbitSrc.includes('poster frame'), 'r160 sculpture: reduced-motion → ONE static poster frame, no rAF, no drag');
  check(/renderer\.dispose\(\)/.test(orbitSrc) && /linkGeo\.dispose\(\)/.test(orbitSrc) && /linkMat\.dispose\(\)/.test(orbitSrc), 'r160 sculpture: full disposal on unmount (renderer + geometry + material + env)');
  check(pageSrc.includes('ChainSculptureMount') && !pageSrc.includes('EcosystemConstellation') && !pageSrc.includes('ConstellationDock'),
    'r160 hero: the page mounts the sculpture through the wrapper — the constellation + dock are retired from the render path');
  check(
    !existsSync(new URL('../src/components/landing/HeroOrbits.tsx', import.meta.url)) && !pageSrc.includes('HeroOrbits'),
    'the flat HeroOrbits SVG is retired from the render path (file deleted, no references)'
  );

  // N ── the OrbitScene CSS contract (entrance, dim, calm, RM off-switch).
  check(
    /animation:\s*ln-scene-in var\(--ln-t-slow\) var\(--ln-ease-out\) var\(--ln-t-fast\) forwards/.test(topLevelBlock(lcss, '.landing .ln-hero-canvas')),
    'landing .ln-hero-canvas: 380ms entrance + 160ms delay (ln-scene-in, forwards)'
  );
  check(
    /\.ln-hero-canvas\s*\{[^}]*--ln-canvas-op:\s*0\.35;\s*animation-name:\s*ln-scene-in-dim/.test(lcss),
    'landing ≤768px canvas dim: --ln-canvas-op 0.35 + ln-scene-in-dim (decorative recedes, text wins)'
  );
  check(
    /\[data-intro-seen='true'\] \.ln-hero-canvas\s*\{[^}]*animation-duration:\s*var\(--ln-t-fast\)/.test(lcss),
    'landing returning-visitor calm: [data-intro-seen] canvas entrance snaps to t-fast, no delay'
  );
  check(
    /\.ln-hero-canvas\s*\{[^}]*animation:\s*none/.test(lrm129),
    'landing RM off-switch: .ln-hero-canvas animation none under reduced motion'
  );

  // O ── token fixes (token-matrix SL rows): --ease-spring-snappy,
  //     --hover-lift — plus the canonical font stacks (pinned via
  //     THEME_FONTS above) and the landing-local Arabic-capable
  //     --ln-mono chain. r144 (P4-4SL): the --gold/--gold-ink/--gold-soft
  //     /--brand-purple pins retired WITH the dead tokens themselves —
  //     zero var() consumers repo-wide (grep-verified); the light pins
  //     had been resolving through the DARK declarations via the merged
  //     scope, so the family was doubly untruthful.
  check(
    !/--gold[\w-]*\s*:/.test(css) && !/--brand-purple\s*:/.test(css)
      && !/--warning[\w-]*\s*:/.test(css) && !/--info[\w-]*\s*:/.test(css)
      && !/--surface-raised\s*:/.test(css)
      && !/--gradient-smart|\-\-gradient-coming/.test(css),
    'r144 dead-token sweep: gold family / brand-purple / warning+info / surface-raised / service gradients stay deleted from styles.css (zero consumers was the verdict)'
  );
  pin(dark, 'dark', '--hover-lift', '-1px');
  pin(light, 'light', '--hover-lift', '-1px');
  pin(dark, 'dark', '--hover-lift-lg', '-3px');
  pin(light, 'light', '--hover-lift-lg', '-3px');
  pin(dark, 'dark', '--ease-spring-snappy', 'cubic-bezier(0.5, 1.6, 0.4, 1)');
  pin(light, 'light', '--ease-spring-snappy', 'cubic-bezier(0.5, 1.6, 0.4, 1)');
  pin(dark, 'dark', '--ring', '#FF4C00'); // r160 KODE: the orange focus ring (gold retired)
  {
    const landingScope129 = Object.assign(
      {},
      ...allTopLevelBlocks(lcss, '.landing').map(parseDecls)
    );
    pin(landingScope129, 'landing', '--ln-mono', "'IBM Plex Mono', 'IBM Plex Sans Arabic', ui-monospace, monospace");
    pin(landingScope129, 'landing', '--ln-grain-op', '0.075');
  }
}

// r126-W3d: on-accent ink consumption gate — the m15 doctrine finally wired.
// styles.css documents that filled CTAs carry --primary-fg ink because
// white-on-gold measures 1.89:1 (dark) / 3.8:1 (light). This gate makes the
// regression class (text-white sneaking back onto a gold fill) impossible.
// r128-F2b: the home's six gold marketing CTAs moved into the Orbit-Ink
// landing world (r128 R4) — their fills are .ln-btn-gold pills whose ink
// is carried by src/app/landing.css (color: var(--ln-ink) on the lime
// fill), so the tsx count splits per surface: the product pages keep
// their --primary-fg CTAs (floor 9 = the 9 surviving product surfaces),
// and the landing contributes its gold-pill class sites (floor 3).
{
  const tssx = readdirSync(new URL('../src', import.meta.url), { recursive: true })
    .filter((f) => String(f).endsWith('.tsx'))
    .map((f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8'))
    .join('\n');
  const onAccent = (tssx.match(/text-\[var\(--primary-fg\)\]/g) ?? []).length;
  const landingGold = (tssx.match(/ln-btn-gold/g) ?? []).length;
  check(onAccent >= 9 && landingGold >= 3,
    `on-accent ink doctrine: >=9 --primary-fg CTAs on product surfaces and >=3 ln-btn-gold pills on the landing (found ${onAccent} + ${landingGold})`);
  check(!/bg-(primary|\[var\(--primary\)\])[^"']*text-white/.test(tssx),
    'no text-white may ride a gold/primary fill — use text-[var(--primary-fg)]');
}

// ── r130 W2-6 · canonical differential pins ──────────────────────────────────
// Round-130 Wave-2 additions (audit W1-D + W1-G + W1-H smart-link rows).
// Headline lesson: the 404 value pins could not catch a MISSING RULE —
// the ≤560px constellation-CTA stacking defect (W1-D P1-1) survived four
// rounds because no pin asserted rule PRESENCE inside the media block.
// These pins are rule-presence (regex against the media block), token-
// presence (pin values), and negative TSX sweeps.
{
  const lcss130 = readFileSync(new URL('../src/app/landing.css', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');

  // A ── r144 (P4-4SL): the two ≤560px constellation stacking rules
  //     (r130 W1-D P1-1) retired WITH the dead constellation chapter —
  //     the pin now asserts the retirement (the dead chapter can never
  //     resurrect with its old mobile bugs).
  const block560 = allTopLevelBlocks(lcss130, '@media (max-width: 560px)').join('\n');
  check(
    !/\.ln-constellation/.test(block560) && !/\.ln-progress-stats/.test(block560),
    'r144: the ≤560px constellation-cta/browse stacking + progress-stats rules retired with their dead chapters (the live .ln-stat mobile rungs stay)'
  );

  // B ── the --motion-duration semantic layer (W1-G SL-P1-1): ladder
  //     aliases + the four semantic durations + the six ambient bands.
  //     pin() resolves the var() ladder aliases to their raw values.
  pinAll(dark, 'dark', {
    '--motion-duration-micro': '80ms',
    '--motion-duration-short': '160ms',
    '--motion-duration-medium': '240ms',
    '--motion-duration-long': '380ms',
    '--motion-duration-page': '320ms',
    '--motion-duration-reveal': '360ms',
    '--motion-duration-stat': '700ms',
    '--motion-duration-skeleton': '1200ms',
    '--motion-duration-ambient-pulse': '1.6s',
    '--motion-duration-ambient': '2.4s',
    '--motion-duration-ambient-slow': '3.6s',
    '--motion-duration-ambient-drift': '6s',
    '--motion-duration-ambient-cinema': '9s',
    '--motion-duration-ambient-scene': '22s',
  });
  // the raw ambient loops bind bands (no raw 2s/3s/4s/20s survivors).
  // r131 (A3 D3): the blob-pulse/float-icon clauses are retired with
  // their dead rules — nav-shimmer (MainNav scrolled shimmer-bar) and
  // grid-drift are the surviving ambient consumers; the bands
  // themselves stay pinned above in the r130 table.
  check(
    /nav-shimmer\s+var\(--motion-duration-ambient\)/.test(css)
      && /grid-drift\s+var\(--motion-duration-ambient-scene\)/.test(css),
    'ambient loops: nav-shimmer/grid-drift bind --motion-duration-ambient* bands'
  );
  // the RM belt resets DELAYS (W1-G F-5 / SL-P2-3, canonical base.css:317/320)
  {
    const rm130 = allTopLevelBlocks(css, '@media (prefers-reduced-motion: reduce)').join('\n');
    check(
      /animation-delay:\s*0s\s*!important/.test(rm130) && /transition-delay:\s*0s\s*!important/.test(rm130),
      'RM belt resets animation-delay + transition-delay to 0s !important'
    );
  }

  // C ── muted text tiers (W1-H SL-1): --text-muted/--text-faint both
  //     themes + the ::placeholder faint tier.
  pin(dark, 'dark', '--text-muted', '#8E97B8');
  pin(dark, 'dark', '--text-faint', '#7A83A0');
  pin(light, 'light', '--text-muted', '#6E6C65');
  pin(light, 'light', '--text-faint', '#74706A');
  check(
    /::placeholder\s*\{[^}]*color:\s*var\(--text-faint\)[^}]*opacity:\s*1/.test(css),
    'placeholder tier: ::placeholder { color: var(--text-faint); opacity: 1 } (canonical base.css:144-146)'
  );

  // D ── display-scale tokens support the unified page heads (W1-D §1):
  //     --fs-display-lg drives .ln-page-title; --sp-* ladder present.
  pin(dark, 'dark', '--fs-display-lg', 'clamp(34px, 4.8vw, 56px)');
  pin(dark, 'dark', '--fs-h2', '22px');
  pin(dark, 'dark', '--sp-4', '16px');
  check(
    /\.ln-page-title\s*\{[^}]*font-size:\s*var\(--fs-display-lg\)[^}]*font-weight:\s*700/.test(css),
    'ln-page-title: rides --fs-display-lg at weight 700 (Plex has no 800 cut)'
  );

  // E ── canonical reveal family (W1-D P2-11): 14px transition + 80ms
  //     steps + IO-gated .in-view — the on-load 24px/120ms animation is
  //     retired (keyframes stay for the scroll-driven family).
  check(
    /\.reveal-up\s*\{[^}]*translateY\(14px\)[^}]*transition:/.test(css)
      && /\.reveal-up\.in-view\s*\{[^}]*opacity:\s*1/.test(css)
      && /\.reveal-d-1\.in-view\s*\{[^}]*transition-delay:\s*80ms/.test(css),
    'reveal family: transition-based 14px / 80ms steps, IO-gated .in-view (canonical polish.css:470-488)'
  );

  // F ── negative TSX sweeps: hover recipe + weight honesty.
  {
    const tssx130 = readdirSync(new URL('../src', import.meta.url), { recursive: true })
      .filter((f) => String(f).endsWith('.tsx'))
      .map((f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8'))
      .join('\n');
    check(
      !/brightness-105/.test(tssx130),
      'no hover:brightness-105 — the hover recipe is the --accent-hover background shift'
    );
    check(
      !/font-extrabold/.test(tssx130),
      'no font-extrabold — IBM Plex tops out at 700 (800 asks for a cut that does not exist)'
    );
  }
}

// ── r131 F9 · type-scale CONSUMPTION pins (A3 D1/D4/D5 + D2/D3/D6/D7,
//    A10 themes, A12 logical props) ──────────────────────────────────────────
// Headline lesson (A3 §2 D1): the 434 value pins could not catch a
// DECLARED-BUT-UNCONSUMED token — r130 landed the full --fs-* ladder
// and then only 2 of 26 rungs were consumed while every inner heading
// kept riding raw Tailwind text-* steps. These pins assert CONSUMPTION
// (positive: the token appears at the defect site) plus negative sweeps
// (the retired raw steps may not come back), so the gap class that let
// the P1-1 defect survive four rounds is closed for the type scale.
{
  // comment-aware read: the negative sweeps below ban raw Tailwind steps
  // and retired class names from the CODE — r131 fix comments legitimately
  // cite them as history ("was raw text-xl 20px"), so strip /* */ and //
  // the same way the harness strips styles.css comments before matching.
  const read = (p) => {
    const raw = readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8');
    return raw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ');
  };
  const privacy = read('app/privacy/page.tsx');
  const terms = read('app/terms/page.tsx');
  const pricing = read('app/pricing/page.tsx');
  const contact = read('app/contact/page.tsx');
  const notFound = read('app/not-found.tsx');
  const errorPage = read('app/error.tsx');
  const offlinePage = read('app/offline/page.tsx');
  const globalError = read('app/global-error.tsx');
  const aboutPage = read('app/about/page.tsx');
  const contactForm = read('components/contact-form.tsx');
  const faq = read('components/faq-accordion.tsx');
  const layout = read('app/layout.tsx');
  const mainNav = read('components/main-nav.tsx');
  const backToTop = read('components/back-to-top.tsx');
  const siteChrome = read('components/site-chrome.tsx');

  // §0a2-promotion (phase6, P6-2-a2): the /pricing wells consume the
  // promoted identity classes — per-product wells + motifs live on all
  // three plan cards, the pastel var() consumers are extinct. The
  // motifs must compose the BASE class (`ln-motif ${plan.motif}` — the
  // P6-2-a4 fix: a modifier-only span is unpositioned and its absolute
  // pseudos escape to the card, painting a card-filling plate oval).
  check(
    pricing.includes('ln-well--menu') && pricing.includes('ln-well--bot') && pricing.includes('ln-well--order')
      && pricing.includes('ln-motif--plate') && pricing.includes('ln-motif--circuit') && pricing.includes('ln-motif--route')
      && pricing.includes('ln-motif ${plan.motif}')
      && !/var\(--c-/.test(pricing),
    'phase6 wells: /pricing plan cards ride the per-product foreshadow wells + motifs on the positioned .ln-motif base (the pastel var() consumers are extinct)'
  );

  // A ── legal pages (D1+D5): H2s consume --fs-h2; prose inherits the
  //     body 15/1.65 rule; 72ch reading measure (no leading-relaxed,
  //     no max-w-3xl — both were silently undoing the r130 body fix).
  for (const [name, src] of [['privacy', privacy], ['terms', terms]]) {
    check(
      src.includes('text-[length:var(--fs-h2)] font-bold'),
      `${name}: all section H2s consume the --fs-h2 22px rung (A3 D1)`
    );
    check(
      !/text-xl/.test(src),
      `${name}: no raw text-xl step on legal H2s (A3 D1 negative sweep)`
    );
    check(
      !/leading-relaxed/.test(src),
      `${name}: prose inherits the canonical 15/1.65 body rule — no leading-relaxed 1.625 override (A3 D5)`
    );
    check(
      src.includes('max-w-[72ch]'),
      `${name}: legal prose measure is 72ch (was max-w-3xl 768px ≈ 100+ ch/line at 15px) (A3 D5)`
    );
  }

  // B ── /pricing (D1+D4): one section-head grammar (ln-chapter-head
  //     anatomy: label + title + lede) with the title on the --fs-h2
  //     rung; card H2s on --fs-h3; the price on the metric ladder.
  check(
    !/text-2xl/.test(pricing),
    'pricing: no raw text-2xl step (was the centered bare section h2s — A3 D1/D4 negative sweep)'
  );
  check(
    !/text-4xl/.test(pricing),
    'pricing: no raw text-4xl price (was 36px, off the metric ladder 22/30/44 — A3 D4 negative sweep)'
  );
  check(
    pricing.includes('text-[length:var(--fs-h2)] font-bold text-foreground'),
    'pricing: section-head titles consume the --fs-h2 rung inside ln-chapter-head (A3 D1/D4)'
  );
  check(
    pricing.includes('text-[length:var(--fs-h3)] font-bold text-foreground'),
    'pricing: plan-card H2s consume the --fs-h3 card-title rung (A3 D1)'
  );
  check(
    pricing.includes('ln-mono text-[length:var(--fs-metric-lg)] font-bold'),
    'pricing: the price rides the --fs-metric-lg 30px mono tnum rung (A3 D4)'
  );
  check(
    (pricing.match(/ln-chapter-head/g) ?? []).length >= 3
      /* P13-2a KODE/ecosystem re-pin: «01 — القادم» retired WITH the
         قريباً story (T2) — the live ecosystem pricing chapter owns the
         numbered slot now; the FAQ label is unchanged. */
      && /ln-label[^>]*>01 — المنظومة الحيّة/.test(pricing)
      && /ln-label[^>]*>02 — الأسئلة/.test(pricing),
    'pricing: the live-ecosystem + FAQ section heads ride the ln-chapter-head anatomy with numbered ln-labels (A3 D4; P13-2a: قادمة → المنظومة الحيّة)'
  );
  check(
    !/text-center mb-8/.test(pricing),
    'pricing: no centered bare section head survives (A3 D4 negative sweep)'
  );

  // C ── /contact + 404 (D1): card H2s on --fs-body, the form H2 on
  //     --fs-h3, the 404 title on the --fs-display-md fluid rung.
  check(
    contact.includes('text-[length:var(--fs-body)]'),
    'contact: info-card H2s consume the --fs-body 15px rung (was raw text-sm 14px) (A3 D1)'
  );
  check(
    !/font-bold text-foreground text-sm/.test(contact),
    'contact: no raw text-sm on card H2s (A3 D1 negative sweep)'
  );
  check(
    contact.includes('text-[length:var(--fs-h3)]'),
    'contact: the form H2 consumes the --fs-h3 rung (A3 D1)'
  );
  check(
    notFound.includes('text-[length:var(--fs-display-md)] font-bold'),
    '404: the title rides the --fs-display-md rung clamp(28px→40px) (was raw text-2xl 24px) (A3 D1)'
  );
  check(
    !/text-2xl/.test(notFound),
    '404: no raw text-2xl step on the title (A3 D1 negative sweep)'
  );

  // C2 ── r132-F4 (A6 §4): the 500 + offline H1s join the scale — the
  //     r131-F9b swap landed 404 but missed these two boundary twins;
  //     text-3xl 30px is exactly --fs-h1 30px (zero visual change).
  check(
    errorPage.includes('text-[length:var(--fs-h1)] font-bold'),
    '500: the H1 rides the --fs-h1 30px rung (r131 F9b consumed 404 but missed this boundary — A6 §4)'
  );
  check(
    !/text-3xl/.test(errorPage),
    '500: no raw text-3xl step on the H1 (A6 §4 negative sweep)'
  );
  check(
    offlinePage.includes('text-[length:var(--fs-h1)] font-bold'),
    'offline: the H1 rides the --fs-h1 30px rung (A6 §4)'
  );
  check(
    !/text-3xl/.test(offlinePage),
    'offline: no raw text-3xl step on the H1 (A6 §4 negative sweep)'
  );

  // C3 ── r150 (20-IDEAL-CTA completion, §8 of the r150 mission): the
  //     inner-page CTA geometry — ONE grammar. The family 44/48/52
  //     control canon (r149) retires the last h-10 40px CTA rung: the
  //     whole inner-page CTA set (pricing ×2 / about / 500 pair /
  //     offline / 404 pair / contact submit + the global-error
  //     boundary's two inline buttons) re-bases on the FULL
  //     44/13/600/r10 canon: h-11 = 44px, --fs-sm 13px (this also
  //     resolves the deferred 14px no-rung question for BUTTONS — 13px
  //     IS the --fs-sm rung), 600, rounded-md = 10px, press 0.97.
  //     Body-copy text-sm is NOT a CTA and stays deferred. Legitimate
  //     non-button 40px sites (main-nav megamenu tile, about icon
  //     well) are icon WELLS, not controls, and keep their geometry.
  check(
    !/rounded-full[^"']*bg-primary|bg-primary[^"']*rounded-full/.test(pricing),
    'pricing: no pill CTAs survive — inner-page primaries ride the r10 rectangle grammar (A8 F-SL-1 + r131 fleet canon)'
  );
  check(
    pricing.includes('w-full h-11 px-5 rounded-md bg-primary') &&
      pricing.includes('h-11 px-5 rounded-md bg-primary') &&
      !/text-sm font-semibold|font-semibold text-sm/.test(pricing),
    'pricing: both CTAs ride the FULL fleet button canon 44/13/600/r10 (h-11/px-5/--fs-sm 13px/rounded-md — the r150 44px CTA canon; A8 F-SL-1 + G4)'
  );
  check(
    aboutPage.includes('h-11 px-5 rounded-md bg-primary') &&
      errorPage.includes('h-11 px-5 rounded-md bg-primary') &&
      errorPage.includes('h-11 px-5 rounded-md ln-card') &&
      offlinePage.includes('h-11 px-5 rounded-md bg-primary') &&
      notFound.includes('h-11 px-5 rounded-md bg-[var(--primary)]') &&
      notFound.includes('h-11 px-5 ln-card rounded-md') &&
      contactForm.includes('w-full h-11 px-5 rounded-md bg-primary'),
    'inner-page CTA set is uniform on the full 44/13/600/r10 canon (about/500 pair/offline/404 pair/contact submit — SO Button twin; r150 §8 44px completion)'
  );
  check(
    [aboutPage, errorPage, offlinePage, notFound, contactForm].every((f) =>
      /text-\[length:var\(--fs-sm\)\]/.test(f)
    ),
    'inner-page CTA labels consume the --fs-sm 13px rung (fleet canon type step; no raw text-sm on buttons)'
  );
  check(
    !/h-10 px-5/.test(aboutPage + errorPage + offlinePage + notFound + contactForm + pricing) &&
      globalError.includes('height: 44') && !/height: 40/.test(globalError),
    'the h-10 40px CTA rung is EXTINCT across the inner-page set + global-error rides 44px inline (r150 §8: one unresolved canonical inconsistency resolved)'
  );

  // C4 ── r132 (A6 §3/§6): micro-copy consumption — the identical-value
  //     swaps of the round: text-xs 12px → --fs-xs (contact page, footer
  //     strip, main-nav megamenu/mobile copy, contact-form errors/hints/
  //     fallbacks) and about's card titles + md quote → --fs-body-lg
  //     (17px rung, was raw text-lg 18px). read() strips comments, so
  //     the negatives ban the raw steps from CODE only (the r132
  //     history comments quote the retired steps verbatim).
  const footerChrome = read('components/footer.tsx');
  check(
    contact.includes('text-[length:var(--fs-xs)]')
      && footerChrome.includes('text-[length:var(--fs-xs)]')
      && mainNav.includes('text-[length:var(--fs-xs)]')
      && contactForm.includes('text-[length:var(--fs-xs)]')
      && ![contact, footerChrome, mainNav, contactForm].some((s) => /text-xs/.test(s)),
    'micro-copy: contact/footer/main-nav/contact-form consume the --fs-xs 12px rung; no raw text-xs survives in the four (r132 A6 §3/§6)'
  );
  check(
    aboutPage.includes('text-[length:var(--fs-body-lg)]')
      && !/text-lg/.test(aboutPage),
    'about: card titles + the md quote consume the --fs-body-lg 17px rung; no raw text-lg survives (was 18px off-ladder — r132 A6 §3/§6)'
  );

  // E0 ── r132 (A6 §2): the .ln-btn-text family (9 sites, ≈23 lines) and
  //      @keyframes reveal-scale are deleted. Sources are comment-stripped
  //      (module css for styles.css; read() here for landing.css), so the
  //      r132 history comments that quote the dead names cannot trip the
  //      gate; the live gold/ghost pair must stay.
  check(
    !/\.ln-btn-text/.test(read('app/landing.css'))
      && !/reveal-scale/.test(css)
      && /\.ln-btn-gold:active/.test(read('app/landing.css'))
      && /\.ln-btn-ghost:active/.test(read('app/landing.css')),
    'dead-CSS sweep (r132 A6 §2): no .ln-btn-text selector or reveal-scale keyframe survives; the live ln-btn-gold/ln-btn-ghost pair stays'
  );

  // D ── FaqAccordion (D1+D2): flat ln-card, question on --fs-body/600.
  check(
    faq.includes('ln-card rounded-2xl overflow-hidden'),
    'faq: the last glass content surface is flat .ln-card (hairline + border-shift hover, A3 D2)'
  );
  check(
    !/glass/.test(faq),
    'faq: no glass surface survives on the accordion (A3 D2 negative sweep)'
  );
  check(
    faq.includes('text-[length:var(--fs-body)] font-semibold'),
    'faq: the question consumes the --fs-body rung at weight 600 (was raw text-sm 14px/500, A3 D1)'
  );
  check(
    !/text-sm font-medium/.test(faq),
    'faq: no raw text-sm/500 question run (A3 D1 negative sweep)'
  );

  // E ── dead-CSS sweep (D3): the deleted r128-era families may not
  //     return; the surviving mechanism families stay.
  check(
    !/\.blob-[0-3]/.test(css) && !/blob-pulse/.test(css)
      && !/\.floating-icon-[0-5]/.test(css) && !/float-icon/.test(css)
      && !/cta-shine/.test(css) && !/\.hero-section/.test(css)
      && !/\.hero-content/.test(css) && !/showcase-tl/.test(css)
      && !/phone-frame/.test(css) && !/phone-shift/.test(css)
      && !/phone-tilt/.test(css) && !/browser-parallax/.test(css)
      && !/line-draw-scroll/.test(css) && !/badge-pop/.test(css)
      && !/reveal-scroll-strong/.test(css) && !/reveal-scroll-stagger/.test(css)
      && !/border-draw/.test(css),
    'dead-CSS sweep: no blob/floating-icon/cta-shine/view-timeline family survives (A3 D3)'
  );
  check(
    !/@utility gradient-text/.test(css) && !/gradient-text-mid/.test(css)
      && !/@utility section-padding/.test(css) && !/@utility glass-card/.test(css)
      && !/\.glass-card/.test(css) && !/--gradient-text-end/.test(css),
    'dead-CSS sweep: gradient-text/section-padding/glass-card utilities + their tokens are gone (A3 D3)'
  );
  check(
    /\.reveal-scroll\s*\{/.test(css) && /\.menu-pop\s*\{/.test(css)
      && /\.acc\s*\{/.test(css) && /\.shimmer-bar\s*\{/.test(css)
      && /\.magnetic-btn\s*\{/.test(css) && /\.grid-drift\s*\{/.test(css),
    'dead-CSS sweep: the LIVE mechanism families stay (reveal-scroll/menu-pop/acc/shimmer-bar/magnetic-btn/grid-drift)'
  );

  // F ── label halo + stat radius (D7): the halo follows the label's
  //     own ink per theme; .ln-stat joins its 20px siblings.
  pin(dark, 'dark', '--label-halo', '#FF4C00'); /* r160: follows --primary-text orange */
  /* phase6 (P6-2-a2) light gold ruling: --label-halo chains
     --primary-text, which migrated copper-deep #5C3416 → text-grade
     deep gold #8A6420 (5.13:1 on cream ≥ 4.5) — re-pinned, not
     weakened: the chain itself is pinned via BRIDGE_LIGHT. */
  pin(light, 'light', '--label-halo', '#B23E00'); /* r160: text-grade orange twin */
  check(
    /\.ln-stat\s*\{[^}]*border-radius:\s*var\(--r-2xl\)/.test(css),
    '.ln-stat: radius rides var(--r-2xl) 20px — landing + ln-card sibling parity (A3 D7)'
  );

  // G ── A10 themes: one resolution path (boot script + enableSystem
  //     explicitly off), toggle keys off resolvedTheme, copper wordmark
  //     on cream.
  check(
    /enableSystem=\{false\}/.test(layout),
    'theme: enableSystem EXPLICITLY off — next-themes v0.4.6 defaults it true, so omission is not off (r130 SO ruling: one resolution path, boot script == provider, both dark-default)'
  );
  check(
    /localStorage\.getItem\('theme'\)/.test(layout)
      && /classList\.add\('light'\)/.test(layout)
      && /classList\.add\('dark'\)/.test(layout),
    'theme: pre-paint boot script in <head> reads the stored key and paints .light/.dark before first paint'
  );
  check(
    /resolvedTheme === "dark" \? "light" : "dark"/.test(mainNav)
      && !/theme === "dark"/.test(mainNav),
    'theme: the toggle keys off resolvedTheme (never the raw theme string) — A10 SL-2'
  );
  check(
    /\.logo-light\s*\{\s*display:\s*none;\s*\}/.test(css)
      && /\.light \.logo-light\s*\{[^}]*display:\s*block/.test(css)
      && /\.light \.logo-dark\s*\{[^}]*display:\s*none/.test(css),
    'logo: dual-variant wordmark — gold (default/no-JS) vs copper selected by .light (A10 F1)'
  );
  check(
    mainNav.includes('logo-light.png') && read('components/footer.tsx').includes('logo-light.png'),
    'logo: nav + footer both render the dual-variant wordmark (A10 F1)'
  );

  // H ── A12 logical props: skip-link / dropdown / back-to-top.
  //     15-SL: حبوبة التخطّي انتقلت من ال layout إلى SiteChrome —
  //     النقطة تلاحق موضعها الجديد (start-4 المنطقية بقيت سليمة).
  check(
    siteChrome.includes('focus:start-4') && !/focus:right-4/.test(siteChrome),
    'a12: skip link rides focus:start-4 (logical, was physical right-4) — 15-SL: pinned at its SiteChrome home, not the layout'
  );
  check(
    mainNav.includes('top-full end-0') && !/top-full right-0/.test(mainNav),
    'a12: services dropdown anchors at end-0 (logical, was physical right-0)'
  );
  check(
    backToTop.includes('fixed bottom-6 end-6') && !/bottom-6 right-6/.test(backToTop),
    'a12: back-to-top rides the end-6 logical corner (was physical right-6)'
  );
}

/* ═══ r133 F6 · A7 tail: the 14px split (R16), letter-spacing law (R12),
   404 display-art pin, dead-duplicate delete, CountUp separator, browse
   arrow direction, maskable-192 ═════════════════════════════════════ */
{
  const read = (p) => {
    const raw = readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8');
    return raw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ');
  };
  const faq = read('components/faq-accordion.tsx');
  const about = read('app/about/page.tsx');
  const footerProd = read('components/footer.tsx');
  const pricing = read('app/pricing/page.tsx');
  const mainNav = read('components/main-nav.tsx');
  const contactForm = read('components/contact-form.tsx');
  const terms = read('app/terms/page.tsx');
  const privacy = read('app/privacy/page.tsx');
  const notFound = read('app/not-found.tsx');
  const countUp = read('components/ui/CountUp.tsx');
  const landingCss = readFileSync(new URL('../src/app/landing.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ');
  const stylesCss = readFileSync(new URL('../src/app/styles.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ');
  const manifest = readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8');
  const count = (s, re) => (s.match(re) || []).length;
  const FS_BODY = /text-\[length:var\(--fs-body\)\]/g;

  // 1 ── R16 the 14px split: prose rides --fs-body 15px; 14px stays a
  //     DOCUMENTED UI-chrome rung. The prose files carry ZERO code
  //     text-sm; the chrome list is FROZEN by exact count (a new prose
  //     text-sm — or a dropped chrome site — flips a count and fails).
  check(count(faq, /\btext-sm\b/g) === 0 && count(faq, FS_BODY) === 2,
    'r16 prose: faq-accordion answer + question ride --fs-body (zero code text-sm)');
  check(count(about, /\btext-sm\b/g) === 0 && count(about, /\btext-base\b/g) === 0 && count(about, FS_BODY) === 4,
    'r16 prose: about values-desc/founder pair/quote-mobile ride --fs-body (no raw text-sm/text-base)');
  check(count(pricing, /\btext-sm\b/g) === 0 && count(pricing, FS_BODY) === 6,
    'r16 prose: pricing subtitle/period/features ride --fs-body (zero code text-sm; P13-2a: 3 → 6 — the live-ecosystem mini-tables add subtitle/plan-name/period-note on the same rung)');
  check(count(footerProd, FS_BODY) === 1,
    'r16 prose: footer brand blurb rides --fs-body');
  check(count(footerProd, /\btext-sm\b/g) === 8,
    'r16 chrome freeze: footer keeps EXACTLY its 8 sanctioned 14px chrome sites (heads/links/contact rows)');
  check(count(mainNav, /\btext-sm\b/g) === 6,
    'r16 chrome freeze: main-nav keeps EXACTLY its 6 sanctioned 14px chrome sites (nav/megamenu/mobile)');
  check(count(contactForm, /\btext-sm\b/g) === 7 && count(contactForm, /\btext-base\b/g) === 1,
    'r16 chrome freeze: contact-form keeps its 7 label/status 14px sites (r137: + the optional phone label) + the ONE 16px iOS-zoom-floor input (r10)');
  check(count(terms, /\btext-sm\b/g) === 1 && count(privacy, /\btext-sm\b/g) === 1,
    'r16 chrome freeze: terms/privacy keep their single 14px timestamp each');
  check(!/--fs-body-md/.test(stylesCss),
    'r133 A7 §2.1: the dead --fs-body-md 15px duplicate stays deleted (zero consumers, unpinned)');

  // 2 ── R12 the Arabic letter-spacing law on the ln-label/ln-mono
  //     devices (madarek A8-N2 twin — the propagation source fixed in
  //     the same round). tabular-nums keeps the alignment role.
  check(/\.landing \.ln-mono\s*\{[^}]*letter-spacing:\s*0[;\s]/.test(landingCss),
    'r12: .landing .ln-mono letter-spacing 0 (hero eyebrow/trust/products-note mix Arabic)');
  check(/\.landing \.ln-label\s*\{[^}]*letter-spacing:\s*0[;\s]/.test(landingCss),
    'r12: .landing .ln-label letter-spacing 0 (mixed-script chapter labels)');
  check(/\.ln-label\s*\{[^}]*letter-spacing:\s*0[;\s]/.test(stylesCss),
    'r12: product .ln-label twin letter-spacing 0 (inner-page heads)');
  check(/\.landing \.ln-hero-scroll \.ln-mono\s*\{[^}]*letter-spacing:\s*0/.test(landingCss),
    'r12: hero-scroll «تابع الرحلة» letter-spacing 0 (was 0.22em on pure Arabic)');
  /* r144 (P4-4SL): the progress-label pin retired WITH the dead
     .ln-progress chapter; the r142 wave shipped new tracked devices the
     old sweep (0.01/0.08/0.2/0.22em) could not see — three carried
     DIRECT Arabic runs (.ln-marquee-tag 0.06em «بث المنظومة»،
     .ln-mock-intent 0.05em «منيو»، .ln-mock-ticket-head 0.04em
     «طلب جديد») and three wrappers tracked nothing but their mono
     children. All six declarations are excised; the sweep now freezes
     the WHOLE tracked-declaration inventory at the three sanctioned
     Latin-only devices. */
  check(!/\.ln-progress-label/.test(landingCss),
    'r144: the progress-label ls-0 pin retired with the dead .ln-progress chapter');
  check(/\.landing \.ln-btn-ghost\s*\{[^}]*letter-spacing:\s*0/.test(landingCss),
    'r12: ghost-pill labels letter-spacing 0 (Arabic «تواصل معنا» — was 0.01em)');
  check(count(landingCss, /letter-spacing:\s*0\.0\d+em/g) === 3
      && /\.landing \.ln-eco-tip b\s*\{[^}]*letter-spacing:\s*0\.02em/.test(landingCss)
      && /\.landing \.ln-world-host\s*\{[^}]*letter-spacing:\s*0\.04em/.test(landingCss)
      && /\.landing \.ln-ground-cell-tag\s*\{[^}]*letter-spacing:\s*0\.06em/.test(landingCss),
    'r144 tracked-inventory freeze: exactly THREE tracked declarations survive — the Latin-only .ln-eco-tip b (world.name)/.ln-world-host (domains)/.ln-ground-cell-tag (INSTANT·AUTO·SCAN·ONE LINK)');
  check(!/\.ln-marquee-tag\s*\{[^}]*letter-spacing/.test(landingCss)
      && !/\.ln-mock-intent[^{]*\{[^}]*letter-spacing/.test(landingCss)
      && !/\.ln-mock-auto\s*\{[^}]*letter-spacing/.test(landingCss)
      && !/\.ln-mock-ticket-head\s*\{[^}]*letter-spacing/.test(landingCss)
      && !/\.ln-cockpit-status\s*\{[^}]*letter-spacing/.test(landingCss)
      && !/\.ln-cockpit-scope-label\s*\{[^}]*letter-spacing/.test(landingCss)
      && !/\.ln-ground-status\s*\{[^}]*letter-spacing/.test(landingCss),
    'r144: the six r142 Arabic-tracking violations carry NO letter-spacing (marquee-tag «بث المنظومة»/mock-intent «منيو»/mock-ticket-head «طلب جديد» + the three inert mono-only wrappers)');
  check(!/letter-spacing:\s*0\.(08|22|2|01)em/.test(landingCss)
      && !/letter-spacing:\s*0\.0[2-7]em/.test(stylesCss)
      && !/letter-spacing:\s*0\.08em/.test(stylesCss),
    'r12 negative sweep (r144-widened): no retired tracked value (0.01/0.08/0.2/0.22em) anywhere, and NO tracked device at all in styles.css — landing carries only the frozen 3-declaration inventory above');

  // 2b ── r144 polish wave (P4-4SL): the 24/7 truth, the marquee veils,
  //      the mobile floors, and the constellation open-state semantics.
  //      Every new rule the wave ships is pinned here so it can't silently
  //      regress the way the r142 tracking devices did.
  const page144 = read('app/page.tsx');
  const platforms144 = read('components/landing/PlatformsSection.tsx');
  const contact144 = read('app/contact/page.tsx');
  const site144 = read('lib/site.ts');
  const eco144 = read('components/landing/ChainSculpture.tsx'); /* r160: the sculpture carries the canvas-semantics twin */
  check(
    count(page144, /تواصل واتساب مباشر/g) === 2 && !page144.includes('24/7'),
    'r144 claims: the homepage carries the TRUE WhatsApp claim twice (hero meta + marquee) and the unverifiable «دعم واتساب 24/7» promise is gone (comments stripped)'
  );
  check(
    platforms144.includes('tag: "INSTANT"') && !platforms144.includes('tag: "24/7"')
      && !platforms144.includes('على مدار الساعة'),
    'r144 claims: the WhatsApp ground-cell tells the instant-orders truth (tag INSTANT) — no 24/7 support promise anywhere in the platforms console'
  );
  check(
    !contact144.includes('24/7') && !contact144.includes('مدار الساعة'),
    'r144 claims: /contact support hours are the office 9–9 truth (no 24/7 on the meta description or the hours card)'
  );
  check(
    site144.includes('support: "خلال أوقات العمل"') && !site144.includes('"24/7"'),
    'r144 claims: the ONE registry keeps one honest support value (خلال أوقات العمل) — the r9 "genuinely 24/7" blessing is revoked'
  );
  check(
    /\.landing \.ln-marquee::before[\s\S]*?\.landing \.ln-marquee::after/.test(landingCss)
      && /linear-gradient\(90deg, var\(--ln-ink\) 12%, transparent\)/.test(landingCss)
      && /linear-gradient\(270deg, var\(--ln-ink\) 12%, transparent\)/.test(landingCss),
    'r144 polish: the broadcast band fades into its ground at BOTH physical viewport edges (symmetric veils — direction-neutral seam, documented)'
  );
  check(
    /\.landing \.ln-hero\s*\{[^}]*padding-inline: max\(7vw, 22px\)/.test(landingCss),
    'r144 polish: the hero rides a safe mobile inline floor (max 7vw / 22px) — the H1 terminal glyph keeps its edge breathing at 360–420'
  );
  check(
    /\.landing \.landing-footer-link\s*\{[^}]*width: auto[^}]*padding-block: 10px/.test(landingCss),
    'r144 polish: footer links become full-width ≥44px touch rows on mobile (width auto + 10px block padding under the 768 block)'
  );
  check(
    eco144.includes('setAttribute("role", "img")') && eco144.includes('aria-label'),
    'r160 semantics: the sculpture canvas carries role=img + an Arabic scene label (the WebGL scene is named; the hero text stays the content twin)'
  );
  check(
    /link\.rotation\.z = i \* Math\.PI \* 0\.5/.test(eco144)
      && /Math\.sin\(i \* 0\.85\)/.test(eco144),
    'r160 sculpture: each link counter-rotates 90° against its neighbour (real chain weave) and steps a gentle spiral — the ascending chain geometry'
  );

  // 3 ── A7 §2.3: the 404 numeral is DOCUMENTED display-art — raw
  //     text-9xl 128px, intentionally off the ladder; do not tokenize.
  check(/text-9xl font-bold leading-none/.test(notFound),
    '404 numeral: keeps raw text-9xl 128px display-art (off-ladder by design — --fs-mega max 104px would be a 24px visual change)');

  // 4 ── A7 §4-1: CountUp separator stability — the mid-animation
  //     formatter must use the same decimal separator as the settled
  //     value string (en dot; ar-LY renders "99,9" → final-frame flip).
  check(/new Intl\.NumberFormat\('en',/.test(countUp) && !/ar-LY/.test(countUp),
    'CountUp: formatter locale en — no comma-decimal mid-stat flip on 99.9');

  // 5 ── r144 (P4-4SL): the constellation-browse hover-nudge pin retired
  //     WITH the dead browse pill — the RTL-leftward-arrow LESSON stays
  //     enforced by its live carriers (the world CTA ArrowLeft + the
  //     inner-page group-hover twin).
  check(!/\.ln-constellation-browse/.test(landingCss),
    'r144: the browse-arrow hover pin retired with the dead .ln-constellation-browse (the RTL-leftward lesson lives on in the live carriers)');

  // 6 ── A7 §1 (A6 probe): the no-JS reveal contract — the landing's
  //     (0,2,0) .landing .reveal-up must carry its OWN scripting:none
  //     reveal clause (the styles.css (0,1,0) one alone loses the
  //     cascade; without this a no-JS visitor sees no below-fold
  //     chapter — empirical probe on #products h2).
  const landingNoJs = /@media \(scripting: none\)\s*\{\s*\.landing \.reveal-up\s*\{\s*opacity:\s*1;\s*transform:\s*none;?\s*\}/.test(landingCss);
  check(landingNoJs,
    'landing no-JS: @media (scripting: none) reveals .landing .reveal-up at matching specificity (content must never stay hidden)');

  // 7 ── A11/A7 §4-4: maskable-192 joins the manifest (safe-zone twin
  //     of the 512 art; SB ships both sizes too).
  check(manifest.includes('/icon-192-maskable.png') && manifest.includes('"purpose": "maskable"'),
    'manifest: the 192x192 maskable icon entry ships next to its 512 twin');
  check(existsSync(new URL('../public/icon-192-maskable.png', import.meta.url)),
    'public/icon-192-maskable.png must exist on disk (the manifest points at it)');
}

/* ═══ r134 (R134-W2-SL) · Wave-2 fix pins — drawer a11y, r133-A10
   micro-interaction ports (autofill/caret + input hover + easing
   bridge), contact-form 44px/r10 recipe, تواصل معنا unification, «»
   quote canon, wa.me prefill, azure well 3:1, external-link
   announcements, og alt family form, immutable maskable-192 ═══════ */
{
  // comment-aware read: negative pins ban strings from CODE — r134 fix
  // comments legitimately cite the retired spellings as history.
  const read = (p) => {
    const raw = readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8');
    return raw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ');
  };
  const header = read('components/landing/LandingHeader.tsx');
  const aboutPage = read('app/about/page.tsx');
  const rolesSrc = read('components/landing/WorldsSection.tsx');
  const pricingPage = read('app/pricing/page.tsx');
  const footerProd = read('components/footer.tsx');
  const privacyPage = read('app/privacy/page.tsx');
  const termsPage = read('app/terms/page.tsx');
  const contactFormSrc = read('components/contact-form.tsx');
  const siteSrc = read('lib/site.ts');
  const seoSrc = read('lib/seo.ts');
  const nextConfig = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');
  const landingCss134 = readFileSync(new URL('../src/app/landing.css', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');

  // A ── fix 1: the landing mobile drawer carries the MainNav Escape
  //     contract (close + focus return to the burger).
  const drawerBlock = header.slice(header.indexOf('landing-mobile-menu'));
  check(
    /onKeyDown=\{\(e\) => \{/.test(drawerBlock)
      && drawerBlock.includes('burgerRef.current?.focus()')
      && drawerBlock.includes('Escape'),
    'r134-1: landing mobile drawer — Escape closes + focus returns to the burger (main-nav.tsx:392-398 pattern)'
  );

  // B ── fix 4: no aria-haspopup over-promise on the megamenu trigger
  //     (disclosure pattern — the product twin dropped it in r13).
  check(
    !/aria-haspopup/.test(header),
    'r134-4: no aria-haspopup on the landing megamenu trigger (aria-expanded/aria-controls carry the real disclosure contract)'
  );
  check(
    /aria-controls="landing-megamenu"/.test(header) && /id="landing-megamenu"/.test(header),
    'r134-4: the megamenu trigger ↔ panel pair is wired via aria-controls/id (product-twin shape)'
  );

  // C ── fix 5: the four external CTAs announce «رابط خارجي» (the
  //     site convention: footer.tsx:106, main-nav.tsx:303/421).
  check(
    (header.match(/ابدأ مجاناً — Smart Menu، رابط خارجي/g) ?? []).length === 2,
    'r134-5: both header CTAs (desktop + mobile drawer) announce «ابدأ مجاناً — Smart Menu، رابط خارجي»'
  );
  check(
    pricingPage.includes('ابدأ الآن — ${plan.title}، رابط خارجي'),
    'r134-5: both pricing CTAs announce «ابدأ الآن — <product>، رابط خارجي»'
  );

  // D ── fix 2: the about pull-quote glyph rides the LOGICAL end corner.
  check(
    aboutPage.includes('top-4 end-4') && !/top-4 right-4/.test(aboutPage),
    'r134-2: about decorative quote anchors at top-4 end-4 (logical, was physical right-4)'
  );

  // E ── fix 6: the «» quote canon on Arabic pull-quotes.
  check(
    aboutPage.includes('«التكنولوجيا') && aboutPage.includes('احتياجاتهم.»')
      && !/&ldquo;|&rdquo;/.test(aboutPage),
    'r134-6: the about pull-quote rides the «» canon (no Latin curly entities)'
  );
  check(
    !/[“”]/.test(rolesSrc + landingCss134.slice(0, 2000)),
    'r134-6: the r142 Arabic copy keeps the «» canon — no lone Latin curly quotes on the rebuilt surfaces'
  );

  // F ── fix 3: the r9 «تواصل معنا» unification — zero «اتصل بنا»
  //     survives in shipped chrome (footer/privacy/terms).
  check(
    !footerProd.includes('اتصل بنا') && !privacyPage.includes('اتصل بنا') && !termsPage.includes('اتصل بنا')
      && footerProd.includes('تواصل معنا') && privacyPage.includes('تواصل معنا') && termsPage.includes('تواصل معنا'),
    'r134-3: footer/privacy/terms headings ride the unified «تواصل معنا» (no «اتصل بنا» survives)'
  );

  // G ── fix 7: the manifest maskable-192 icon rides the immutable
  //     cache list (r133 wired the manifest; the list missed it).
  check(
    nextConfig.includes('"icon-192-maskable.png"'),
    'r134-7: next.config.ts immutableFiles carries icon-192-maskable.png (year-long immutable cache)'
  );

  // H ── fix 8: the wa.me prefill helper — every human WhatsApp CTA
  //     carries a source-identifying Arabic opener.
  check(
    /export function whatsappUrl\(surface: string\): string/.test(siteSrc)
      && siteSrc.includes('encodeURIComponent')
      && siteSrc.includes('مرحباً، أتواصل معكم من موقع الربط الذكي — '),
    'r134-8: site.ts ships whatsappUrl(surface) with the URL-encoded Arabic opener'
  );
  check(
    read('components/contact-form.tsx').includes('whatsappUrl("نموذج التواصل")')
      && footerProd.includes('whatsappUrl("تذييل الصفحة")')
      && read('app/contact/page.tsx').includes('whatsappUrl("صفحة التواصل")')
      && read('app/offline/page.tsx').includes('whatsappUrl("صفحة عدم الاتصال")')
      && read('emails/contact-emails.tsx').includes('whatsappUrl("بريد التأكيد")'),
    'r134-8: all five WhatsApp CTA surfaces consume the prefilled helper (contact-form/footer/contact/offline/confirmation email)'
  );
  check(
    !read('lib/schema.ts').includes('whatsappUrl'),
    'r134-8: JSON-LD keeps the bare SITE.whatsapp.url (machines don\'t type openers)'
  );

  // I ── r144 (P4-4SL): the .ln-role-ico.azure 3:1 fix pin retired WITH
  //     the dead roles chapter (its deep contrast NOTE lives in git
  //     history). r152 (phase5): the live megamenu sibling itself is
  //     re-toned — azure (violet) is retired with Orbit-Ink and the
  //     accent-toned well is SIGNAL: a gold 0.16 wash + gold icon
  //     (7.37:1 on the washed panel — one accent, zero second hue).
  check(
    !/\.ln-role-ico/.test(landingCss134)
      && !/\.ln-menu-ico\.azure|\.ln-platform-ico\.azure/.test(landingCss134)
      && !/rgb\(122 107 242/.test(landingCss134)
      && /\.landing \.ln-menu-ico\.signal\s*\{[^}]*rgb\(233 180 76 \/ 0\.16\)[^}]*var\(--ln-gold\)/.test(landingCss134)
      && /\.landing \.ln-platform-ico\.signal\s*\{[^}]*rgb\(233 180 76 \/ 0\.14\)/.test(landingCss134),
    'r152: role-ico.azure retired with the roles chapter; the live wells are signal-toned (gold 0.16/0.14 washes + gold icon — violet fully excised from landing.css)'
  );

  // I2 ── r160 (KODE): the FORESHADOW render pins retired WITH the
  //     motif/identity-strip anatomy (the type-card worlds replace it);
  //     re-pinned to the new truth: black chapter 001, hairline type-
  //     cards, real links, no motif devices in the render path.
  check(
    /\.landing \.ln-world-card\s*\{[^}]*border-block-end:\s*1px solid rgba\(255, 255, 255, 0\.22\)/.test(landingCss134)
      && /\.landing \.ln-worlds--kode\s*\{[^}]*background:\s*#050507/.test(landingCss134)
      && /html\.light \.landing \.ln-worlds--kode\s*\{[^}]*background:\s*#050507/.test(landingCss134),
    'r160 worlds: chapter 001 is the BLACK stage in BOTH themes with hairline-ruled type-cards (the KODE inverted chapter)'
  );
  check(
    read('components/landing/WorldsSection.tsx').includes('ln-world-card')
      && read('components/landing/WorldsSection.tsx').includes('data-world={w.id}')
      && read('components/landing/WorldsSection.tsx').includes('ln-world-claims')
      && (read('components/landing/WorldsSection.tsx').match(/href=\{w\.url\}/g) ?? []).length === 1,
    'r160 worlds: minimal type-cards carry the real anatomy (data-world + claims + the WORLDS.map renders the three LIVE product links)'
  );
  check(
    !read('components/landing/WorldsSection.tsx').includes('ln-motif')
      && !read('components/landing/WorldsSection.tsx').includes('MockFrame'),
    'r160 worlds: the CSS mocks + motif devices are retired from the render path (type-led cards, S3 discipline)'
  );
  check(
    /\[data-world="menu"\] \.ln-mock-thumb\s*\{[^}]*border-radius:\s*var\(--ln-radius-pill\)/.test(landingCss134),
    'r152 menu mock: the dish avatars go plate-round (the plate motif echoes inside the mock)'
  );

  // J ── fix 10a: the r133-A10 autofill/caret port (madarek base.css:
  //     104-125; the Smart-Menu globals.css twin) — pinned in the
  //     Smart-Menu/SO style: caret token, both autofill engines.
  check(css.includes('caret-color: var(--accent-ink);'),
    'r134-10a: caret rides the theme accent (--accent-ink; was the UA blue/black default)');
  check(css.includes('input:-webkit-autofill,') && css.includes('input:autofill,'),
    'r134-10a: both autofill engines are themed (-webkit-autofill hover+focus + Firefox :autofill)');
  check(css.includes('-webkit-box-shadow: 0 0 0 1000px var(--card) inset;'),
    'r134-10a: the Chromium autofill cover is the 1000px inset --card box-shadow');

  // K ── fix 10c: the default-transition easing bridge — bare
  //     transition-* utilities settle on the canon exponential curve.
  //     (SO parity pins this as theme-scope motion(@theme); the SL
  //     spelling rides the var(--ease-out) chain.)
  pin(theme, 'theme', '--default-transition-timing-function', 'cubic-bezier(0.16, 1, 0.3, 1)');

  // L ── fixes 10b + 11: the contact-form input recipe — 44px
  //     min-height + r-md 10px + hover border-strengthen (error keeps
  //     the destructive border on hover — the SO doctrine).
  const inputBase = contactFormSrc.match(/const inputBase =\s*"([^"]+)"/)?.[1] ?? '';
  check(
    inputBase.includes('min-h-11') && inputBase.includes('rounded-md'),
    'r134-11: inputBase rides the family input recipe — 44px min-height (min-h-11) + r-md 10px'
  );
  check(
    !inputBase.includes('rounded-xl') && inputBase.includes('text-base'),
    'r134-11: the 12px rounded-xl input corners are retired (the 16px iOS zoom floor stays)'
  );
  check(
    contactFormSrc.includes('border-[var(--input-border)] hover:border-[var(--border-strong)]'),
    'r134-10b: resting inputs strengthen their border on hover (Smart-Menu input.tsx:39-42 twin)'
  );
  check(
    /bad\s*\?\s*`\$\{inputBase\} border-\[var\(--destructive\)\]`/.test(contactFormSrc),
    'r134-10b: the error branch keeps its destructive border — NO hover override (invalid stays loud)'
  );

  // M ── fix 14: the og:image alt rides the family Arabic-prefix form.
  check(
    seoSrc.includes('alt: "الربط الذكي — SmartLink"'),
    'r134-14: OG_IMAGE.alt rides the family form «الربط الذكي — SmartLink» (Smart-Menu/Smart-Order prefix convention)'
  );
}

/* ═══ r137 — ليبي أولاً + صدق الأسطول: the LYD money seam, the phone
   seam port, JSON-LD timeZone, and Smart-Order as the third live
   product (comment-aware reads — the decision comments cite retired
   spellings as history) ═══════════════════════════════════════════ */
{
  const read = (p) => {
    const raw = readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8');
    return raw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ');
  };
  const money = read('lib/money.ts');
  const phone = read('lib/phone.ts');
  const rules = read('lib/contact-rules.ts');
  const contactForm = read('components/contact-form.tsx');
  const schema = read('lib/schema.ts');
  const site = read('lib/site.ts');
  /* URLs need the RAW source: the comment-stripping `//.*$` rule eats
     every `https://…` literal (the scheme carries its own `//`). */
  const siteRaw = readFileSync(new URL('../src/lib/site.ts', import.meta.url), 'utf8');
  const worldsSrc = readFileSync(new URL('../src/components/landing/worlds.ts', import.meta.url), 'utf8');
  const pricing = read('app/pricing/page.tsx');

  // A ── the LYD display seam: Western digits + ar-LY dot grouping +
  //     « د.ل» — hand-rolled (hydration-safe), the SO formatLyd twin.
  check(
    /export function formatLyd/.test(money)
      && money.includes('\\B(?=(\\d{3})+(?!\\d))')
      && money.includes('د.ل'),
    'r137-1: lib/money.ts ships formatLyd — Western digits + ar-LY dot grouping + « د.ل» (fleet seam: madarek formatNum / SO formatLyd twins, hydration-safe hand-rolled grouping)'
  );
  // B ── honesty over invention — P13-2a re-truth: the seam no longer
  //     waits; the REAL sibling ladders (0/19/29/129/299) live on the
  //     page now. The LAW survives unchanged and is STRENGTHENED: zero
  //     hand-spelled digit+«د.ل» pairs anywhere (metadata prose included
  //     — it rides formatLyd too), and the page must actually consume
  //     the seam (formatLyd( wired into the render).
  check(
    !/\d\s*د\.ل/.test(pricing) && /formatLyd\(/.test(pricing),
    'r137-1: every LYD amount on /pricing rides formatLyd — zero hand-spelled digit+«د.ل» pairs (P13-2a: the seam carries the live sibling ladders now; the r137 no-invention law holds)'
  );
  // C ── the phone seam: the Smart-Menu r136 Eastern-digit fold + the
  //     Libyan contract (the r138 fleet-unified shape: mobile 09 at
  //     9–10 digits + landline 0[1-9] at 10 — the SO r138-SO twin) in
  //     ONE module.
  check(
    /export function normalizeCustomerPhone/.test(phone)
      && phone.includes('/[٠-٩]/g')
      && phone.includes('export const LIBYAN_PHONE_RE = /^(?:09\\d{7,8}|0[1-9]\\d{8})$/')
      && phone.includes('00218')
      && /export function normalizeLibyanPhone/.test(phone),
    'r137-2: lib/phone.ts — the Smart-Menu r136 fold (Eastern digits) + the Libyan contract /^(?:09\\d{7,8}|0[1-9]\\d{8})$/ (r138 fleet unification: mobile 09 9–10 digits + landline 0[1-9] at 10, the SO r138-SO twin) + +218/00218 acceptance, normalized to the local form'
  );
  // D ── the shared contract: the phone pieces ride lib/contact-rules
  //     (the r10 doctrine — form and API can never drift), and the form
  //     field is the WhatsApp-first optional LTR box.
  check(
    rules.includes('PHONE_ERROR') && rules.includes('PHONE_MAX')
      && rules.includes('normalizeLibyanPhone'),
    'r137-2: contact-rules re-exports the phone contract (PHONE_ERROR/PHONE_MAX/normalizeLibyanPhone) — one module serves the form AND the API'
  );
  check(
    contactForm.includes('رقم الهاتف (واتساب) — اختياري')
      && contactForm.includes('dir="ltr"')
      && contactForm.includes('placeholder="09XXXXXXXX"')
      && contactForm.includes('fieldErrors.phone'),
    'r137-2: the contact form ships the optional WhatsApp-first phone field — Arabic label, LTR box, 09XXXXXXXX placeholder, per-field error channel'
  );
  // E ── JSON-LD: the opening hours carry an explicit timeZone.
  check(
    schema.includes('timeZone: "Africa/Tripoli"'),
    'r137-3: openingHoursSpecification carries timeZone "Africa/Tripoli" (no crawler-local interpretation)'
  );
  // F ── Smart-Order truth: SITE.products.order + the JSON-LD entities.
  check(
    siteRaw.includes('https://order.smart-link.ly')
      && site.includes('order: {')
      && site.includes('Smart Order — متجر الطلبات الرقمي'),
    'r137-4: SITE.products carries the third LIVE product (order.smart-link.ly) in the exact menu/bot shape'
  );
  check(
    schema.includes('#smart-order-org') && schema.includes('service-smart-order'),
    'r137-4: JSON-LD carries Smart-Order as subOrganization + Service (a live product was invisible to crawlers)'
  );
  // G ── the landing constellation: three live nodes; the e-store
  //     coming-soon placeholder is retired (a live store product made
  //     it a contradiction).
  check(
    worldsSrc.includes('https://menu.smart-link.ly')
      && worldsSrc.includes('https://bot.smart-link.ly')
      && worldsSrc.includes('https://order.smart-link.ly')
      && !worldsSrc.includes('قريباً'),
    'r137-4: the r142 worlds ride THREE live links — the «متجر إلكتروني — قريباً» placeholder era is over'
  );
  // H ── the pricing page markets the third product honestly (free
  //     base plan per its own published catalog).
  check(
    pricing.includes('title: "Smart Order"')
      && pricing.includes('SITE.products.order.url'),
    'r137-4: /pricing ships the Smart-Order plan card (free base plan — «مجانية للأبد» on its own pricing page)'
  );
}

/* ═══ r138 — توحيد الهاتف (عقد الأسطولة الموحّد — قرار r138-SO) +
   إكمال صدق الأسطول: the phone contract is the fleet's ONE shape
   (mobile 09 at 9–10 digits + landline 0[1-9] at 10 — the Smart-Order
   r138-SO twin), wa.me rendering stays mobile-only (no dead links for
   landlines), and the three-product truth reaches the surfaces the
   r137 wave missed (root metadata, Organization description, landing
   FAQ, legal pages) */
{
  const read = (p) => {
    const raw = readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8');
    return raw.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ');
  };
  const phone = read('lib/phone.ts');
  const emails = read('emails/contact-emails.tsx');
  const layout = read('app/layout.tsx');
  const schema = read('lib/schema.ts');
  const faq = read('components/landing/LandingFaq.tsx');
  const privacy = read('app/privacy/page.tsx');
  const terms = read('app/terms/page.tsx');

  // A ── (r138-SL) عقد الأسطولة الموحّد: الرسالة تسمّي العائلتين —
  //     الأرضي 021… مقبول الآن (قرار r138-SO) فلا تنعَت رقمًا ليبيًا
  //     صحيحًا بالخطأ؛ المحمول أولًا لأن الحقل «واتساب أولاً».
  check(
    phone.includes('أو أرضي 0211234567'),
    'r138-1: PHONE_ERROR names BOTH families (محمول وأرضي) — the fleet-wide contract (r138-SO) accepts landlines and the message must not call a correct landline wrong'
  );
  // A2 ── the trunk-restore gate is the SO twin: ONLY a mobile missing
  //      its trunk (9xxxxxxx/9xxxxxxxx) gains the 0 — a blind prepend
  //      would mint a landline out of garbage (123456789).
  check(
    phone.includes('digits.startsWith("9") && (digits.length === 8 || digits.length === 9)'),
    'r138-1: the trunk-restore gate is mobile-only (the SO twin) — landline-without-trunk and garbage reject; no blind prepend may mint a landline'
  );
  // A3 ── wa.me stays MOBILE-only: the owner email links 09… numbers
  //      and renders a landline as plain callable text (WhatsApp-first
  //      is a rendering behavior, not an acceptance gate).
  check(
    emails.includes('phone.startsWith("09")'),
    'r138-1: the owner email gates the wa.me link on the 09 prefix — a landline renders as plain text, never a dead link'
  );
  // B ── the three-product truth reaches the homepage SERP description
  //     (the root layout metadata — r137 updated the pricing page only,
  //     leaving the site's primary card speaking two products).
  check(
    layout.includes('ومتجر الطلبات الرقمي'),
    'r138-2: the root metadata description names all THREE products (menu/bot/order — the homepage SERP/OG card matches the pricing-page truth)'
  );
  // C ── the Organization JSON-LD description matches its own three
  //     subOrganizations (was a two-product description riding the same
  //     object as a three-product subOrganization list).
  check(
    schema.includes('ومتجر الطلبات الرقمي'),
    'r138-2: the Organization JSON-LD description names the third product (consistent with its own subOrganization ×3 + Service ×3)'
  );
  // D ── the landing FAQ no longer claims «حالياً» two products with the
  //     third hiding behind «قريباً» — Smart Order is live.
  check(
    faq.includes('وSmart Order (متجر الطلبات الرقمي)'),
    'r138-2: the landing FAQ offers all three live products (the two-product «حالياً نقدم خدمة» claim was false since r137)'
  );
  // E ── the legal pages' service enumerations carry the third product.
  check(
    terms.includes('<li><strong>Smart Order:</strong>')
      && privacy.includes('(Smart Order)'),
    'r138-2: terms/privacy enumerate Smart Order among the platform services (legal texts match the marketing truth)'
  );
}

/* ═══ r140 — صدق الثلاثية في أسطح نجت من موجتي r137/r138 (تدقيق
   A140-SL #2–#5): فصل الأدوار ثلاثي (جمهور Smart Order الحيّ له دور)،
   محطة الرحلة 02 تعدّ ثلاث خدمات، وصف الميغامينو ثلاثي، ووصف الـPWA
   في الـmanifest صريح بلا «والمزيد» — الدبوس الجديد يثبّت نص وصف
   الـmanifest الذي كان يمرّ من كل البوابات (parity يثبّت أيقونة
   الـmaskable فقط، فانحدر الوصف إلى ما قبل r137 بلا إنذار) ═══════ */
{
  /* الـmanifest يُقرأ خامًا (ملف JSON لا تعليقات فيه، لكن القاعدة
     نفسها تسري: قارئ التعليقات يأكل كل https://… حرفيًا). */
  const manifestRaw = readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8');

  check(
    manifestRaw.includes('المنيو الرقمي للمطاعم، والبوت الذكي لفيسبوك، ومتجر الطلبات الرقمي')
      && !manifestRaw.includes('والمزيد'),
    'r140-1: the PWA manifest description names all THREE products explicitly (menu/bot/order — no «والمزيد» escape hatch; the WebAPK install sheet rides the same fleet truth as the root metadata)'
  );
}

/* ═══ phase6 (P6-2-a2) — chapter rhythm + the five-route composition:
   the .ln-chapter utility (landing §0i rhythm + gold hairline), the
   --head/--prose variants, the legal TOC lockstep, the contact grid
   recompose, and the negative sweeps that keep the centered islands
   and narrow head caps extinct. ═════════════════════════════════ */
{
  const lnChapterRule = css.match(/\.ln-chapter\s*\{([^}]*)\}/)?.[1] ?? '';
  check(
    /padding-block:\s*clamp\(60px, 9vh, 84px\)/.test(lnChapterRule)
      && /border-block-end:\s*1px solid var\(--chapter-line\)/.test(lnChapterRule),
    'phase6 rhythm: .ln-chapter rides the landing fluid clamp(60px, 9vh, 84px) + the --chapter-line accent hairline'
  );
  /* P13-2a KODE retirement — re-pin: gold → orange hairlines (the
     alpha grades keep the phase6 structure; light rides the deep
     text-orange #B23E00 grade). */
  pin(dark, 'chapter-line-dark', '--chapter-line', 'rgb(255 76 0 / 0.16)');
  pin(light, 'chapter-line-light', '--chapter-line', 'rgb(178 62 0 / 0.25)');
  check(
    /\.ln-chapter--head\s*\{/.test(css) && /\.ln-chapter--prose\s*\{/.test(css)
      && /\.ln-toc\s*\{/.test(css) && /\.ln-card--keyline\s*\{/.test(css),
    'phase6 composition utilities: the --head/--prose chapter variants, the legal .ln-toc, and the gold-keyline card all exist in styles.css'
  );

  const read6 = (p) => readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ');
  const pages = {
    about: read6('app/about/page.tsx'),
    pricing: read6('app/pricing/page.tsx'),
    contact: read6('app/contact/page.tsx'),
    privacy: read6('app/privacy/page.tsx'),
    terms: read6('app/terms/page.tsx'),
  };
  const minChapters = { about: 4, pricing: 4, contact: 2, privacy: 2, terms: 2 };
  for (const [name, src] of Object.entries(pages)) {
    check(
      (src.match(/ln-chapter\b/g) ?? []).length >= minChapters[name],
      `phase6 rhythm: /${name} composes as .ln-chapter chapters (≥${minChapters[name]})`
    );
  }
  check(
    !/max-w-[\w[\]-]+ mx-auto/.test(pages.about + pages.pricing + pages.contact)
      && !/ln-chapter-head max-w/.test(pages.about + pages.pricing + pages.contact),
    'phase6 composition: no centered content islands or capped heads survive on about/pricing/contact (full-width composition; measures are start-aligned at the element)'
  );
  for (const [name, src] of [['privacy', pages.privacy], ['terms', pages.terms]]) {
    const tocIds = [...src.matchAll(/id:\s*"([\w-]+)",\s*label:/g)].map((m) => m[1]);
    const tocLabels = [...src.matchAll(/label:\s*"([^"]+)"\s*\}/g)].map((m) => m[1]);
    check(
      tocIds.length >= 10 && src.includes('aria-label="محتويات الصفحة"')
        && tocIds.every((id) => src.includes(`id="${id}"`)),
      `phase6 TOC: ${name} ships the semantic nav + every TOC id rides a real <section> (no dead anchors)`
    );
    check(
      tocLabels.every((label) => src.includes(`>${label}</h2>`)),
      `phase6 TOC: every ${name} TOC label mirrors its section H2 exactly (label drift breaks the nav contract)`
    );
  }
  check(
    pages.contact.includes('lg:grid-cols-5') && pages.contact.includes('lg:col-span-3')
      && pages.contact.includes('ln-card--keyline'),
    'phase6 contact: the recomposed grid — form island (col-span-3, primary action at the reading start) + the gold-keyline info rail'
  );
}

/* ═══ phase10 (P10-1c) — امتداد سياسة الأرقام الغربية (E1) ما بعد
   الرئيسية + إصلاحا درجة التوكن والإيموجي على حدود الأخطاء:
   (1) كل ملفات نطاق المسارات غير الرئيسية (المسارات التسعة + كروم
   المنتج المشترك + القوالب البريدية + مكتبات الميتا) تخلو من أي
   رقم عربي-هندي في الكود بعد تجريد التعليقات (التعليقات تاريخ
   موثق؛ المدخلات في phone.ts/money.ts تطبيع محصون بعقود r137)؛
   (2) حبر أيقونة حد 500 يركب --primary-text (درجة النص) لا
   --primary (درجة التعبئة) — عقد m15 «حبر الأيقونات يركب درجة
   النص» (التوأم: أيقونة المؤسس على /about)؛
   (3) الحد الجذري global-error يتقاعد عن إيموجي ⚠️ لصالح مخطط
   alert-triangle المُضمَّن (توأم SO P9-3-d؛ مذهب «قيم فقط»). ═══ */
{
  const read10 = (p) => readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ');
  const ARABIC_INDIC = /[\u0660-\u0669\u06F0-\u06F9]/;
  const ROUTES10 = [
    'app/about/page.tsx', 'app/contact/page.tsx', 'app/pricing/page.tsx',
    'app/privacy/page.tsx', 'app/terms/page.tsx', 'app/offline/page.tsx',
    'app/not-found.tsx', 'app/error.tsx', 'app/global-error.tsx',
  ];
  const CHROME10 = [
    'components/site-chrome.tsx', 'components/main-nav.tsx', 'components/footer.tsx',
    'components/contact-form.tsx', 'components/faq-accordion.tsx',
    'components/back-to-top.tsx', 'components/current-year.tsx',
    'components/gen-art-background.tsx', 'components/ui/CountUp.tsx',
    'components/reveal-observer.tsx', 'components/theme-color-sync.tsx',
  ];
  const META10 = [
    'app/layout.tsx', 'lib/site.ts', 'lib/seo.ts', 'lib/schema.ts',
    'lib/content-dates.ts', 'emails/contact-emails.tsx',
  ];
  check(
    ROUTES10.every((p) => !ARABIC_INDIC.test(read10(p))),
    'P10-1c digits: the nine non-landing routes render ZERO Arabic-Indic codepoints (E1 extended beyond the landing — comment-stripped source; the landing-only comment numerals stay legal)'
  );
  check(
    CHROME10.every((p) => !ARABIC_INDIC.test(read10(p))),
    'P10-1c digits: the shared product chrome (nav/footer/forms/FAQ/islands) renders ZERO Arabic-Indic codepoints'
  );
  check(
    META10.every((p) => !ARABIC_INDIC.test(read10(p)))
      && !ARABIC_INDIC.test(
        readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8')
      ),
    'P10-1c digits: metadata/JSON-LD libs + the contact email templates + the PWA manifest render ZERO Arabic-Indic codepoints (Western digits with Arabic text — the E1 law)'
  );

  const errorPage10 = read10('app/error.tsx');
  const globalError10 = read10('app/global-error.tsx');
  check(
    errorPage10.includes('text-[var(--primary-text)]')
      && ![...ROUTES10, ...CHROME10].map((p) => read10(p))
        .some((s) => s.includes('text-[var(--primary)]')),
    'P10-1c icon ink: the 500-boundary alert icon rides --primary-text (the text/ink grade — light #8A6420 ≈4.3:1 on the gold wash); the bare fill-grade text-[var(--primary)] spelling is extinct across the route scope (the about Quote watermark text-primary/30 is a different, deliberate device)'
  );
  check(
    !globalError10.includes('\u26A0')
      && globalError10.includes('stroke="#FF4C00"')
      && globalError10.includes('m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z'),
    'P10-1c emoji retirement: global-error carries the inline lucide alert-triangle SVG in the KODE safety-orange ink (#FF4C00 — P13-2a KODE retirement, was the Madarek gold #E9B44C) — the ⚠️ text emoji is gone (SO P9-3-d twin; the boundary keeps its zero-dependency values-only doctrine)'
  );
}

/* ═══ 4-a (3-a audit fixes): the P1 a11y re-inks + the P2 truth/discipline
   wave. Every rule the fix ships is pinned here so the grades cannot
   silently drift back the way the §16e day-leak did. Measured evidence
   (computed-style sweeps, dev + live, both themes): journey furniture
   1.47:1/2.30:1 → 6.1:1 both stages; cockpit .ln-trust cluster in the
   day 1.24–2.70:1 → 5.88–18:1; .ln-stat-unit day miss 2.56:1 → 8.6:1;
   .ln-label day grades 4.74–5.24:1 (paper) and 6.1:1 (held-black
   chapters); .ln-world-host 8.97:1 on the held-black chapter 001. ═══ */
{
  const strip = (p) => readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
  const lcss4a = strip('app/landing.css');
  const faq4a = strip('components/landing/LandingFaq.tsx');
  const contact4a = strip('components/contact-form.tsx');

  // P1-1 · the journey flood furniture joins the flood ink
  check(
    /\.landing \.ln-journey-row-n\s*\{[^}]*color:\s*var\(--ln-flood-ink\)/.test(lcss4a)
      && /\.landing \.ln-journey-row-tag\s*\{[^}]*color:\s*var\(--ln-flood-ink\)/.test(lcss4a),
    '4-a P1: the #journey flood furniture (step numerals + mono tags) rides the flood ink var(--ln-flood-ink) — the .ln-mono grey (1.47:1 dark / 2.30:1 light on the orange) can never inherit back'
  );
  // P1-2 · the cockpit night-hold: the whole readout family, unit included
  check(
    /html\.light \.landing \.ln-cockpit \.ln-trust\s*\{[^}]*background:\s*#0B0B10/.test(lcss4a)
      && /html\.light \.landing \.ln-cockpit \.ln-cockpit-status \.ln-mono,\s*html\.light \.landing \.ln-cockpit \.ln-cockpit-scope-label \.ln-mono\s*\{[^}]*color:\s*#A9ACB4/.test(lcss4a)
      && /html\.light \.landing \.ln-cockpit \.ln-stat-unit\s*\{[^}]*color:\s*#A9ACB4/.test(lcss4a),
    '4-a P1: the cockpit day night-hold covers the whole console family (.ln-trust ground #0B0B10 + status/scope mono + the stat unit — the unit was the hold\'s one miss at 2.56:1)'
  );
  // P1-2b · the label grade source: token, never a raw orange, at base scope
  check(
    /\.landing \.ln-label\s*\{[^}]*color:\s*var\(--ln-gold\)/.test(lcss4a)
      && !/\.landing \.ln-label\s*\{[^}]*color:\s*#FF4C00/.test(lcss4a),
    '4-a P1: the chapter eyebrow rides var(--ln-gold) at base scope — the day block resolves the text-grade #B23E00 (4.74–5.24:1 on paper/ink-2; the raw #FF4C00 spellings live ONLY inside the held-black chapters 001/003 where they measure 6.1:1)'
  );
  // P1-3 · the world-card host chips stay night-grey on the held-black chapter
  check(
    /\.landing \.ln-world-host\s*\{[^}]*color:\s*#A9ACB4/.test(lcss4a),
    '4-a P1: the world-card domain chips keep the night grey #A9ACB4 (8.97:1 on chapter 001\'s both-theme black — the r160 day-hold pin above is the other half of the pair; a paper flip would fail this grade loudly, not silently)'
  );
  // P1-4 · the hero fold: the centered measure + the height-budget clamp
  // + the min-width: 0 RTL-clip guard (without it the nowrap lines'
  // max-content pinned the content grid item to the inline-start edge
  // and spilled line 3 off the LEFT viewport edge at 1025–1280:
  // live-measured −36/−38/−45px — 1440 alone survived).
  // P20-A1 (value-only re-anchor): the lh re-anchor 0.92 → 0.97 moved
  // the budget divisor 2.76 → 2.91 — the lockup's 500px box at 1440×900
  // unchanged. P20-A2 (value-only re-anchor): 0.97 → 1.08 — PIXEL PROOF
  // on the live 1440 render measured a 14px white-descender/orange-
  // tashkeel OVERLAP at 0.97 (the Kufi 800 diacritic stacks outgrew the
  // ink-box model); 1.08 clears the raster ink (~10px measured gap) and
  // the divisor follows 3 × 1.08 = 3.24 — the total-height budget keeps
  // the 500px box and the CTA fold margin exactly true. The label's
  // “390 untouched” claim died with the P20-A1 lockup-integrity block
  // (below) — 390 is now the nowrap + 12.6vw viewport-fit lockup, pinned
  // separately.
  check(
    /@media \(min-width: 1025px\)\s*\{[^}]*\.ln-hero--kode \.ln-hero-content\s*\{[^}]*max-inline-size:\s*1280px[^}]*min-inline-size:\s*0/.test(lcss4a)
      && /\.ln-hero--kode \.ln-hero-title\s*\{[^}]*max-inline-size:\s*none;\s*min-inline-size:\s*0/.test(lcss4a)
      && /\.ln-hero--kode \.ln-hero-line\s*\{\s*white-space:\s*nowrap/.test(lcss4a)
      && /@media \(min-width: 1025px\) and \(max-height: 960px\)\s*\{[^}]*\.ln-hero--kode \.ln-hero-title\s*\{[^}]*min\(var\(--ln-h1\), calc\(\(100svh - 400px\) \/ 3\.24\)\)/.test(lcss4a),
    '4-a P1: the KODE lockup takes the full 1280 measure with nowrap lines (the designed 3-line block, not the 5-line wrap) + the short-stage height budget (100svh−400px)/3.24 + min-inline-size: 0 on the content/title (the RTL clip guard — line 3 measured −45px off-viewport at 1280 without it) — full lockup + both CTAs in-fold at 1440×900/1080, every line in-viewport at 1025–1440'
  );
  // P20-A1 · lockup integrity below 1025px: the desktop nowrap grammar
  // + the viewport-fit scale. At f8e8210 the clamp floor (56px) and the
  // 13vw mid-band outgrew the 335px/86vw measures and the "3-line"
  // lockup ragged-wrapped into 5 lines (mid-word orphaned أ at 390,
  // Range rects 2/2/3; 1/2/3 at 768–1000). The block pins the three
  // load-bearing declarations: nowrap lines, min-inline-size: 0 on both
  // the content and the title (the same RTL auto-min trap), and
  // font-size: min(var(--ln-h1), 12.6vw) — the widest line (7.42em)
  // then fits the viewport at every width (390→364px ≤ 390).
  check(
    /@media \(max-width: 1024px\)\s*\{[^@]*\.ln-hero--kode \.ln-hero-content\s*\{[^}]*min-inline-size:\s*0/.test(lcss4a)
      && /@media \(max-width: 1024px\)\s*\{[^@]*\.ln-hero--kode \.ln-hero-title\s*\{[^}]*min-inline-size:\s*0;[^}]*font-size:\s*min\(var\(--ln-h1\), 12\.6vw\)/.test(lcss4a)
      && /@media \(max-width: 1024px\)\s*\{[^@]*\.ln-hero--kode \.ln-hero-line\s*\{\s*white-space:\s*nowrap/.test(lcss4a)
      && /--ln-h1-lh:\s*1\.08/.test(lcss4a),
    'P20-A1: the 3-line KODE lockup holds at EVERY width — below 1025px the nowrap + min-inline-size: 0 + viewport-fit scale (min(--ln-h1, 12.6vw)) replace the ragged 5-line wrap (orphaned أ at 390 measured), and the measured-ink lh 1.08 keeps the raster ink of adjacent lines from colliding (P20-A2 pixel-proof: 0.97 left a 14px overlap; 1.08 leaves a clean dark band)'
  );
  // P1-4b · the scroll cue's §3 absolute-era offsets are swept in the kode
  // layer: §16 switched the cue to a grid item (position: relative) but
  // left bottom: calc(100% - 100svh + 95px) + left: 50% + translate: -50% 0
  // alive — bottom resolved against the cue's OWN ~100px grid row =
  // ≈ −705px and left added +½ the area: the invite painted ~700px below
  // the hero, off-center, over chapter 001's first world card (measured
  // y 1628–1728 at 1440×900). The reset pins it to its designed grid row.
  check(
    /\.ln-hero--kode \.ln-hero-scroll\s*\{[^}]*position:\s*relative[^}]*bottom:\s*auto[^}]*left:\s*auto[^}]*translate:\s*none/.test(lcss4a),
    '4-a P1: the hero scroll cue rides the kode grid (position: relative) with the §3 absolute-era offsets swept (bottom/left/translate reset) — the cue stays in its designed last-row home inside the hero instead of painting ~700px below it over the worlds chapter'
  );
  // P2-5 · the currency word-space joins formatLyd's «19 د.ل» — on the
  // side that FACES the number: the readout line is .ln-mono plaintext
  // (first strong char = the Arabic unit → the line runs RTL: number
  // right, unit left) while the unit element itself is ltr — so
  // inline-START resolved to the outer edge and the pair stayed glued
  // (measured 0px); inline-END lands the 0.3em between «19» and «د.ل»
  // (measured 7.2px).
  check(
    /\.landing \.ln-stat-unit\s*\{[^}]*margin-inline-end:\s*0\.3em/.test(lcss4a)
      && !/\.landing \.ln-stat-unit\s*\{[^}]*margin-inline-start/.test(lcss4a),
    '4-a P2: the stat unit rides a word-space on its number-facing edge (margin-inline-end 0.3em ≈ 7px at 24px — the plaintext-RTL line makes inline-start the OUTER edge, a gap nobody sees) — «19د.ل» gluing is dead; formatLyd\'s one spelling regime holds on the landing readout too'
  );
  // P2-6 · the FAQ future-horizon tail stays dead (comment-stripped source)
  check(
    !faq4a.includes('مع خطط لإطلاق المزيد من الخدمات قريباً')
      && faq4a.includes('وSmart Order (متجر الطلبات الرقمي).'),
    '4-a P2: FAQ answer 1 carries the live trio and NO future-horizon tail — the JSON-LD mirrors it (the P14 family\'s one survivor, swept with its source)'
  );
  // P2-7 · the contact subject select placeholder grade
  check(
    contact4a.includes('value={subject}')
      && contact4a.includes('!subject && "text-[var(--text-faint)]"')
      && contact4a.includes('setSubject("")'),
    '4-a P2: the contact subject select is controlled for the placeholder grade — «اختر الموضوع» rides the same --text-faint tier as the text inputs\' ::placeholder, a real choice flips to --foreground, and reset-after-send keeps the pair in lockstep'
  );
}


/* ═══ P18-W2-b (KODE craft pass): the r160 leak sweep + the instrument
   grammar completion. Every rule the pass ships is pinned here so the
   retired families (sand washes, indigo washes, the glass console, the
   generic FAQ cards, the weak footer heads) can never silently recur.
   Evidence: the seams/washes carried pre-r160 Madarek literals that
   painted NOTHING on the r160 near-black stage (3% sand over #050507
   ≈ 0.4% luminance); the indigo rgba(13,20,40,·) washes violated the
   r160 3-color discipline; .ln-ground was the page's one surviving
   glassmorphism surface after §16e flattened the cockpit. ═══ */
{
  const stripW2b = (p) => readFileSync(new URL(`../src/${p}`, import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
  const lcssW2b = stripW2b('app/landing.css');
  const finaleW2b = stripW2b('components/landing/FinaleCta.tsx');

  // W2b-1 · the breath seams paint again (KODE P4 — a dead seam is a
  // broken transition): the footer + trust gradients re-anchor to the
  // stage-cream family, and the day twins hold their grounds (the
  // trust twin rides the kept-black cockpit chapter; the footer twin
  // keeps the ink-on-paper fade).
  check(
    /\.landing \.landing-footer::before\s*\{[^}]*rgba\(255,255,255,0\.03\)[^}]*\}/.test(lcssW2b)
      && /\.landing \.ln-trust::before\s*\{[^}]*rgba\(255,255,255,0\.03\)[^}]*\}/.test(lcssW2b)
      && /html\.light \.landing \.ln-trust::before\s*\{[^}]*rgba\(255,255,255,0\.03\)/.test(lcssW2b)
      && /html\.light \.landing \.landing-footer::before\s*\{[^}]*rgba\(7,11,22,0\.04\)/.test(lcssW2b)
      && !/\.landing-footer::before\s*\{[^}]*242,?239,?230/.test(lcssW2b)
      && !/\.ln-trust::before\s*\{[^}]*242,?239,?230/.test(lcssW2b),
    'P18-W2-b: the footer/trust breath seams PAINT on both stages (stage-cream 3% night; the trust day twin joins its kept-black chapter, the footer twin keeps ink-on-paper) — the retired sand literals are gone from both seam blocks'
  );

  // W2b-2 · the console washes join the 3-color discipline: the cockpit
  // status strip + scope dial + stat cells and the ground status strip +
  // cell hover re-anchor from the retired Orbit-Ink indigo
  // rgba(13,20,40,·) to the stage-cream family.
  check(
    /\.landing \.ln-cockpit-status\s*\{[^}]*rgb\(255 255 255 \/ 0\.03\)/.test(lcssW2b)
      && /\.landing \.ln-ground-status\s*\{[^}]*rgb\(255 255 255 \/ 0\.03\)/.test(lcssW2b)
      && /\.landing \.ln-cockpit-readout \.ln-stat\s*\{[^}]*rgb\(255 255 255 \/ 0\.03\)/.test(lcssW2b)
      && /radial-gradient\(circle at center, transparent 58%, rgb\(255 255 255 \/ 0\.30\) 59%/.test(lcssW2b)
      && !/13, ?20, ?40/.test(
        (lcssW2b.match(/\.landing \.ln-cockpit-status\s*\{[^}]*\}/) ?? ['x'])[0]
          + (lcssW2b.match(/\.landing \.ln-cockpit-scope\s*\{[^}]*\}/) ?? ['x'])[0]
          + (lcssW2b.match(/\.landing \.ln-cockpit-readout \.ln-stat\s*\{[^}]*\}/) ?? ['x'])[0]
          + (lcssW2b.match(/\.landing \.ln-ground-status\s*\{[^}]*\}/) ?? ['x'])[0]),
    'P18-W2-b: the cockpit + ground console washes ride the stage-cream family (3% strips/cells, 0.30/0.24/0.05 scope rings) — the retired indigo rgba(13,20,40,·) literals are extinct in every live console block (the r160 3-color law holds)'
  );

  // W2b-3 · the ground console joins §16e's flat instrument grammar:
  // transparent ground, NO backdrop blur, square corners, the token
  // hairline (flips both stages) — the page's last glassmorphism
  // surface is retired.
  check(
    /\.landing \.ln-ground\s*\{[^}]*background:\s*transparent[^}]*border-radius:\s*0[^}]*\}/.test(lcssW2b)
      && /\.landing \.ln-ground\s*\{[^}]*backdrop-filter:\s*none/.test(lcssW2b)
      && /\.landing \.ln-ground\s*\{[^}]*border:\s*1px solid var\(--ln-line\)/.test(lcssW2b),
    'P18-W2-b: .ln-ground is the flat framed instrument (transparent, no blur, radius 0, var(--ln-line) hairline — the §16e cockpit twin) — the retired glass panel treatment can never inherit back'
  );

  // W2b-4 · the FAQ rows join the worlds/journey hairline grammar and
  // the questions take the display voice's small rung.
  check(
    /\.landing \.ln-faq-list\s*\{[^}]*gap:\s*0/.test(lcssW2b)
      && /\.landing \.ln-faq-item\s*\{[^}]*border:\s*0;[^}]*border-block-end:\s*1px solid var\(--ln-line-soft\)[^}]*border-radius:\s*0;[^}]*background:\s*transparent/.test(lcssW2b)
      && /\.landing \.ln-faq-q\s*\{[^}]*font-family:\s*var\(--font-display-arabic\)[^}]*font-weight:\s*700[^}]*font-size:\s*clamp\(16\.5px, 1\.5vw, 19px\)/.test(lcssW2b)
      && !/\.ln-faq-item\s*\{[^}]*242 239 230/.test(lcssW2b),
    'P18-W2-b: the FAQ rides flat hairline rows (gap 0 + single border-block-end seams, transparent ground) with Kufi-700 clamp(16.5–19px) questions — the rounded-card-on-dead-sand-wash generic treatment is extinct'
  );

  // W2b-5 · the footer heads join the mono micro-label family (the
  // instrument closes the page — KODE P6).
  check(
    /\.landing \.landing-footer-heading\s*\{[^}]*font-family:\s*var\(--ln-mono\)[^}]*font-size:\s*11px[^}]*color:\s*var\(--ln-gold\)/.test(lcssW2b),
    'P18-W2-b: the footer column heads are the mono micro-label voice (var(--ln-mono) 11px gold — 5.88:1 night / 4.74:1 day on the ink-2 surfaces) — no more 12px sans heads smaller than the links they govern'
  );

  // W2b-6 · one strict chapter-label grammar: the finale drops its lone
  // Latin suffix (the console chips TELEMETRY/BROADCAST/SCAN own that
  // grammar; the five chapter labels are 00n — Arabic).
  check(
    finaleW2b.includes('004 — الوصول')
      && !finaleW2b.includes('ACCESS'),
    'P18-W2-b: the finale label reads «004 — الوصول» — the only Latin-suffixed chapter label is gone; the five chapters share one grammar and the bilingual suffixes stay with the console chips'
  );

  // W2b-7 · the CTA scale rungs: the hero pair owns the second rung
  // (19px > the 17px sub, ≫ the 12px meta) and the finale xl pair
  // outranks its 16.5px lede.
  check(
    /\.ln-hero-actions \.ln-btn-gold,\s*\.landing \.ln-hero-actions \.ln-btn-ghost\s*\{[^}]*font-size:\s*clamp\(16px, 1\.32vw, 19px\)/.test(lcssW2b)
      && /\.landing \.ln-cta-actions \.ln-btn-gold\.xl,\s*\.landing \.ln-cta-actions \.ln-btn-ghost\.xl\s*\{[^}]*font-size:\s*17px/.test(lcssW2b),
    'P18-W2-b: the conversion rows own their scale rungs (hero clamp(16–19px) above the sub-headline; finale xl 17px above the lede) — the primary action no longer collapses into the furniture row'
  );
}

if (failures.length > 0) {
  console.error(`✗ KODE parity snapshot FAILED (${failures.length} assertion(s)):`);
  for (const f of failures) console.error(`  • ${f}`);
  process.exit(1);
}

/* r144 (P4-4SL) — the self-count assertion. The suite now pins its own
   size: a pin added or removed without bumping EXPECTED_ASSERTIONS
   fails here, so the doc-vs-reality drift class (CLAUDE.md said 538
   while the suite actually ran 535) can never silently recur. Rule:
   EVERY intentional pin change bumps EXPECTED_ASSERTIONS in the same
   commit, and CLAUDE.md's count line quotes this constant's value.
   r148: 525 → 524 — the retired dead-consumer pin
   (.ln-journey-path-light --sp pin) left WITH the dead CSS it was
   protecting (19-AUDIT-SL D3; the ONLY authorized retirement of the
   r148 wave).
   r150: 524 → 525 — the 44px CTA-canon completion pin (§8): the
   inner-page set + global-error prove the h-10 40px rung extinct
   (one intentional pin added with the source change it protects).
   r152 (phase5): 525 → 537 — the مدارك Night repaint + the foreshadow
   system: the landing token surface re-anchored to the family values
   (night/sand/gold; the 4 lime/violet pins retired with Orbit-Ink,
   10 added: gold pair + the three §0a2 world lit+true pairs + night
   glass pair) and SIX foreshadow checks (worlds swatch/motif registry,
   gold-bloom engine, motif devices on --ln-world-true, identity strip,
   eco-card motif, plate-round menu mock).
   phase6 (P6-2-a2): 537 → 509 — the §0a2 PROMOTION: the 54 pastel
   family pins (9 families × bg/ink/deep × 2 themes) retired WITH the
   tokens (zero var() consumers after the /pricing well migration —
   the r144 doctrine: pinning deleted tokens is how drift hides); added
   18 product-scope foreshadow pins (lit/true/well × 3 worlds × 2
   themes) + the extinction sweep + the two-sheet drift gate (6) + the
   /pricing well-consumption pin (1) + the R4 re-truth.
   phase6 (P6-2-a2, commit 2): 509 → 524 — the chapter-rhythm wave: the
   .ln-chapter rule pin + both --chapter-line grades + the composition
   utilities check + 5 route-adoption pins + the centered-island/head-cap
   negative sweep + 4 TOC lockstep pins (ids ride real sections; labels
   mirror the H2s) + the contact grid-recompose pin.
   phase9 (P9-3-a): 524 → 548 — the LIGHT STAGE (mission E3): 17 day-token
   pins (html.light .landing §15a — the full color surface flips, night
   values byte-identical) + 7 structural checks (one-light-block,
   completeness, night-stays-default, luminous-CTA pair, toggle TSX
   contract, toggle 44px CSS, engine MutationObserver repaint)
   (the R4 gate was EXTENDED, not weakened: html.light .landing is the
   sanctioned day scope, every other leak class still fails).
   phase10 (P10-1c): 548 → 553 — the E1 digits policy extended beyond
   the landing: three comment-stripped codepoint sweeps (the nine
   non-landing routes + the shared product chrome + metadata/emails/
   manifest) + the 500-boundary icon ink-grade pin + the global-error
   inline alert-triangle SVG pin (⚠️ emoji retirement, SO P9-3-d twin).
   4-a (3-a audit fixes): 551 → 560 — the P1/P2 wave pins: journey
   flood furniture re-ink, cockpit day night-hold family (trust ground
   + console mono + stat unit), label token-grade source, world-host
   night-grey, hero fold (1280 measure + min-inline-size: 0 RTL-clip
   guard + nowrap + the (100svh−400px)/3.24 height budget), the scroll
   cue offset sweep, the stat-unit word-space, the FAQ future-
   horizon ban, and the contact select placeholder grade. */
const EXPECTED_ASSERTIONS = 568;
check(
  passed + 1 === EXPECTED_ASSERTIONS,
  `self-count: the suite must run exactly ${EXPECTED_ASSERTIONS} assertions (ran ${passed + 1}) — bump EXPECTED_ASSERTIONS with every intentional pin change`
);

if (failures.length > 0) {
  console.error(`✗ parity self-count gate FAILED:`);
  for (const f of failures) console.error(`  • ${f}`);
  process.exit(1);
}

console.log(`✓ KODE parity snapshot: ${passed} assertions passed (styles.css product tokens + landing.css KODE layer == the r160 canonical values — ink/paper/safety-orange + the ChainSculpture engine/worlds/CTA contracts; born as the r126 Madarek parity snapshot, re-pinned P12-2a r160)`);
