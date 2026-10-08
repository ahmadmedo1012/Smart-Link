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
  '--background': '#070B16', // Madarek --bg (neutral-50 night)
  '--card': '#0D1428', // Madarek --surface (neutral-0)
  '--foreground': '#F2EFE6', // Madarek --text (neutral-900 sand)
  '--muted-foreground': '#C3C8DC', // Madarek --text-secondary
  '--border': '#1B2444', // Madarek hairline (neutral-200)
  '--border-strong': '#263052',
};
const GROUNDS_LIGHT = {
  '--background': '#FBFAF9',
  '--card': '#FFFFFF',
  '--foreground': '#191918',
  '--muted-foreground': '#4F4D48',
  '--border': '#E9E7E2',
  '--border-strong': '#D9D6D0',
};
const ACCENT_DARK = {
  '--accent-solid': '#E9B44C', // Madarek --accent (their --accent is the 15% wash twin)
  '--accent-hover': '#F5D48A',
  '--accent-soft': '#2C2312',
  '--accent-strong': '#C9962F',
  '--accent-ink': '#E9B44C',
  '--accent-fg': '#05070F',
};
const ACCENT_LIGHT = {
  '--accent-solid': '#B57438',
  '--accent-hover': '#9A5F25',
  '--accent-soft': '#F4E4D2',
  '--accent-strong': '#5C3416',
  '--accent-ink': '#5C3416',
  '--accent-fg': '#1A0F06',
};
const STATUS_DARK = {
  '--success': '#7FD39A', '--success-ink': '#7FD39A',
  '--warning': '#ECC97D', '--warning-ink': '#ECC97D',
  '--destructive': '#F0938F', '--destructive-ink': '#F0938F', // Madarek --danger/-ink
  '--info': '#8FBBF2', '--info-ink': '#8FBBF2',
};
const STATUS_LIGHT = {
  '--success': '#4FA66D', '--success-ink': '#1F4F30',
  '--warning': '#D6A330', '--warning-ink': '#6B4C0B',
  '--destructive': '#DD6E78', '--destructive-ink': '#6B2128',
  '--info': '#5C8FCE', '--info-ink': '#1F3D63',
};
const FAMILIES_DARK = {
  peach: ['#2C1A16', '#F2A07F', '#FCD9C4'],
  mint: ['#0F241C', '#7FD39A', '#C9EAD3'],
  lavender: ['#221B3A', '#B7A0F4', '#DCD2F9'],
  sky: ['#14213A', '#8FBBF2', '#C9DCEE'],
  yellow: ['#2C2410', '#ECC97D', '#F8E5B5'],
  rose: ['#2C1620', '#F0938F', '#FACDD2'],
  sand: ['#241F14', '#D9C18C', '#EFE2C5'],
  grey: ['#161D33', '#A9B0C8', '#D5DAE8'],
  copper: ['#2C2312', '#E9B44C', '#F5D48A'],
};
const FAMILIES_LIGHT = {
  peach: ['#FFE9DC', '#E07856', '#6B2D1A'],
  mint: ['#DCF1E2', '#4FA66D', '#1F4F30'],
  lavender: ['#ECE6FA', '#8A6FE0', '#3F2D7A'],
  sky: ['#DDEBF7', '#5C8FCE', '#1F3D63'],
  yellow: ['#FCF1CD', '#D6A330', '#6B4C0B'],
  rose: ['#FCE0E2', '#DD6E78', '#6B2128'],
  sand: ['#F1ECDF', '#B59868', '#5A4623'],
  grey: ['#EFECE7', '#6B665E', '#2D2A24'],
  copper: ['#F4E4D2', '#B57438', '#5C3416'],
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
  '--primary': '#E9B44C', // Madarek --accent dark (gold)
  '--primary-text': '#E9B44C', // Madarek --accent-ink dark (10.3:1 as text)
  '--primary-fg': '#05070F', // Madarek --accent-fg dark (text ON gold)
  // r130: re-adjudicated vs madarek tokens.css:233 — dark ring resolves
  // through var(--accent) = #E9B44C (gold). The r127/r129 "#C9962F
  // cascade" reading conflated the LIGHT-side --accent-strong path.
  '--ring': '#E9B44C',
  '--accent': 'rgb(233 180 76 / 0.15)', // translucent wash semantics
  '--input-border': 'color-mix(in oklab, #C3C8DC 70%, #0D1428)', // resolved r13 3:1 border recipe
};
const BRIDGE_LIGHT = {
  '--primary': '#B57438', // Madarek --accent light (copper)
  '--primary-text': '#5C3416', // Madarek --accent-ink light (10.29:1)
  '--primary-fg': '#1A0F06', // Madarek --accent-fg light (4.95:1)
  '--ring': '#5C3416', // --state-focus-ring-color light = --accent-strong
  '--accent': 'rgb(181 116 56 / 0.12)',
  '--input-border': 'color-mix(in oklab, #4F4D48 80%, #FFFFFF)',
};

// ── r126: glass + shadow stacks (the runtime side of @theme utilities) ──────

const GLASS_DARK = {
  '--glass-bg-strong': 'rgba(13, 20, 40, 0.92)',
  '--glass-border': 'rgba(142, 151, 184, 0.12)',
  '--glass-shadow': '0 8px 16px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  '--glass-shadow-lg': '0 16px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.07)',
};
const GLASS_LIGHT = {
  '--glass-bg-strong': 'rgba(255, 255, 255, 0.9)',
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
  '--t-glow': '0 0 30px rgb(233 180 76 / 0.25)',
  '--t-glow-strong': '0 0 60px rgb(233 180 76 / 0.35)',
};
const SHADOWS_LIGHT = {
  '--shadow-card': '0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.06)', // = --elev-1
  '--shadow-card-h': '0 1px 2px rgba(15, 15, 15, 0.04), 0 6px 18px rgba(15, 15, 15, 0.06)',
  '--shadow-pop': '0 1px 2px rgba(15, 15, 15, 0.04), 0 8px 24px rgba(15, 15, 15, 0.08)',
  '--shadow-modal': '0 12px 36px rgba(15, 15, 15, 0.10), 0 32px 80px rgba(15, 15, 15, 0.14)',
  '--t-shadow-lg': '0 1px 2px rgba(15, 15, 15, 0.04), 0 8px 24px rgba(15, 15, 15, 0.08)',
  '--t-shadow-xl': '0 12px 36px rgba(15, 15, 15, 0.10), 0 32px 80px rgba(15, 15, 15, 0.14)',
  '--t-glow': '0 0 30px rgb(181 116 56 / 0.12)',
  '--t-glow-strong': '0 0 60px rgb(181 116 56 / 0.2)',
};

// ── r126: surfaces, scrollbar, gen-art, gradients ───────────────────────────

const SURFACES_DARK = { '--surface-raised': '#121A36', '--surface-sunken': '#0D1428' };
const SURFACES_LIGHT = { '--surface-raised': '#F1EFEC', '--surface-sunken': '#F7F6F3' };
const SCROLLBAR_DARK = {
  '--scrollbar-thumb': 'rgba(142, 151, 184, 0.20)',
  '--scrollbar-thumb-hover': 'rgba(142, 151, 184, 0.34)',
};
const SCROLLBAR_LIGHT = {
  '--scrollbar-thumb': 'rgba(25, 25, 24, 0.16)',
  '--scrollbar-thumb-hover': 'rgba(25, 25, 24, 0.28)',
};
const GENART_DARK = { '--genart-accent': '#8E97B8', '--genart-accent-dim': 'rgb(142 151 184 / 0.04)' };
const GENART_LIGHT = { '--genart-accent': '#6F6C66', '--genart-accent-dim': 'rgb(111 108 102 / 0.04)' };
const GRADIENTS_DARK = {
  '--gradient-text-mid': '#E9B44C',
  '--gradient-text-end': '#F5D48A',
  '--grid-line': 'rgb(233 180 76 / 0.1)',
  '--gradient-smart-menu': 'linear-gradient(135deg, rgb(242 160 127 / 0.25), rgb(242 160 127 / 0.1))',
  '--gradient-smart-bot': 'linear-gradient(135deg, rgb(183 160 244 / 0.25), rgb(183 160 244 / 0.1))',
  '--gradient-coming-soon': 'linear-gradient(135deg, rgb(127 211 154 / 0.25), rgb(127 211 154 / 0.1))',
};
const GRADIENTS_LIGHT = {
  '--gradient-text-mid': '#B57438',
  '--gradient-text-end': '#9A5F25',
  '--grid-line': 'rgb(181 116 56 / 0.06)',
  '--gradient-smart-menu': 'linear-gradient(135deg, rgb(224 120 86 / 0.15), rgb(224 120 86 / 0.06))',
  '--gradient-smart-bot': 'linear-gradient(135deg, rgb(138 111 224 / 0.15), rgb(138 111 224 / 0.06))',
  '--gradient-coming-soon': 'linear-gradient(135deg, rgb(79 166 109 / 0.15), rgb(79 166 109 / 0.06))',
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
  '--font-heading': '"IBM Plex Sans Arabic", system-ui, sans-serif',
  '--font-serif': '"IBM Plex Serif", Georgia, serif',
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

// ── r126: the 12-face @font-face manifest (m15 IBM Plex port) ───────────────

const FONT_MANIFEST = [
  ['plex-sans-arabic-400-normal-arabic.woff2', 'IBM Plex Sans Arabic', '400', 'normal'],
  ['plex-sans-arabic-500-normal-arabic.woff2', 'IBM Plex Sans Arabic', '500', 'normal'],
  ['plex-sans-arabic-600-normal-arabic.woff2', 'IBM Plex Sans Arabic', '600', 'normal'],
  ['plex-sans-arabic-700-normal-arabic.woff2', 'IBM Plex Sans Arabic', '700', 'normal'],
  ['plex-sans-arabic-400-normal-latin.woff2', 'IBM Plex Sans Arabic', '400', 'normal'],
  ['plex-sans-arabic-500-normal-latin.woff2', 'IBM Plex Sans Arabic', '500', 'normal'],
  ['plex-sans-arabic-600-normal-latin.woff2', 'IBM Plex Sans Arabic', '600', 'normal'],
  ['plex-sans-arabic-700-normal-latin.woff2', 'IBM Plex Sans Arabic', '700', 'normal'],
  ['plex-serif-400-italic-latin.woff2', 'IBM Plex Serif', '400', 'italic'],
  ['plex-serif-500-italic-latin.woff2', 'IBM Plex Serif', '500', 'italic'],
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
pin(dark, 'glass-dark', '--glass-bg', 'rgba(11, 16, 32, 0.78)');
pin(light, 'glass-light', '--glass-bg', 'rgba(251, 250, 249, 0.78)');

for (const [family, [bg, ink, deep]] of Object.entries(FAMILIES_DARK)) {
  pin(dark, 'family-dark', `--c-${family}-bg`, bg);
  pin(dark, 'family-dark', `--c-${family}-ink`, ink);
  pin(dark, 'family-dark', `--c-${family}-deep`, deep);
}
for (const [family, [bg, ink, deep]] of Object.entries(FAMILIES_LIGHT)) {
  pin(light, 'family-light', `--c-${family}-bg`, bg);
  pin(light, 'family-light', `--c-${family}-ink`, ink);
  pin(light, 'family-light', `--c-${family}-deep`, deep);
}

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

// r126: the 12-face font manifest — a renamed file or a dropped
// font-display: swap used to pass 134/134.
const fontFaceBlocks = allTopLevelBlocks(css, '@font-face');
check(fontFaceBlocks.length === 12, `font-face manifest must declare exactly 12 faces (got ${fontFaceBlocks.length})`);
for (const [file, family, weight, style] of FONT_MANIFEST) {
  const block = fontFaceBlocks.find((b) => b.includes(`url('/fonts/${file}')`));
  if (block === undefined) {
    failures.push(`font-face for /fonts/${file} is missing from styles.css`);
    continue;
  }
  const ok =
    block.includes(`font-family: '${family}'`) &&
    block.includes(`font-weight: ${weight}`) &&
    block.includes(`font-style: ${style}`) &&
    block.includes('font-display: swap') &&
    /unicode-range:\s*U\+/.test(block);
  check(ok, `font-face ${file} must carry family '${family}', weight ${weight}, style ${style}, font-display: swap and a unicode-range`);
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

  // 1 ── the --ln-* token surface (canonical Orbit-Ink, PORT-KIT §1).
  //     The motion aliases pin the CHAIN (var(--t-*)/var(--ease-*)) —
  //     those tokens are not redefined inside .landing, so resolve()
  //     leaves the reference verbatim; --ln-t-reveal resolves through
  //     the in-scope 360ms bridge to its canonical value.
  pinAll(landingScope, 'landing', {
    '--ln-ink':         '#252A3E',
    '--ln-ink-2':       '#1C2032',
    '--ln-cream':       '#F5F3E7',
    '--ln-cream-dim':   '#C9C6B4',
    '--ln-lime':        '#DFEDB2',
    '--ln-lime-deep':   '#B9D778',
    '--ln-violet':      '#7A6BF2',
    '--ln-violet-deep': '#4E2FB8',
    '--ln-line':        'rgba(245, 243, 231, 0.14)',
    '--ln-line-soft':   'rgba(245, 243, 231, 0.07)',
    '--ln-grain-op':    '0.075', /* r129: canonical landing-local P3-22 lift (Madarek landing.css:58) — ruling adopted over PORT-KIT R7's 0.05 */
    '--ln-radius-pill': 'var(--r-full)',
    '--ln-h1':          'clamp(2.75rem, 8.2vw, 6.75rem)',
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

  // 3 ── --sp consumers: the useSectionProgress scrub surface. The
  //     chapter wash and the journey light path are the two canonical
  //     producers-to-css contracts.
  check(
    /opacity:\s*calc\(var\(--sp,\s*0\)\s*\*\s*0\.5\)/.test(topLevelBlock(lcss, '.landing .ln-chapter::before')),
    'landing --sp consumer: .ln-chapter::before opacity calc(var(--sp, 0) * 0.5)'
  );
  check(
    /stroke-dashoffset:\s*calc\(1\s*-\s*var\(--sp,\s*0\)\)/.test(topLevelBlock(lcss, '.landing .ln-journey-path-light')),
    'landing --sp consumer: .ln-journey-path-light stroke-dashoffset calc(1 - var(--sp, 0))'
  );

  // 4 ── scroll-spy selectors (R2): the observer writes
  //     header[data-active-section]; these six selectors are the css half
  //     of the contract, on the shipped anchor set.
  for (const anchor of ['trust', 'products', 'journey', 'progress', 'platforms', 'roles']) {
    check(
      lcss.includes(`.landing header[data-active-section="${anchor}"] .landing-nav-link[href="#${anchor}"]`),
      `landing scroll-spy selector for #${anchor} (R2)`
    );
  }

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

  // 7 ── R4 scope isolation, both directions: the product css declares
  //     no --ln-* tokens, and every --ln-* declaration in landing.css
  //     lives inside a .landing-scoped (or at-rule-nested) block.
  check(
    !/--ln-[\w-]+\s*:/.test(css),
    'R4 isolation: product styles.css declares no --ln-* tokens'
  );
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
      if (!prelude.startsWith('.landing') && !prelude.startsWith('@') && /--ln-[\w-]+\s*:/.test(lcss.slice(open + 1, j - 1))) {
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
  //     itself never fails the suite.
  {
    const before = failures.length;
    const passedBefore = passed;
    pin({ ...landingScope, '--ln-ink': '#070B16' }, 'landing-neg', '--ln-ink', '#252A3E');
    check(
      failures.length === before + 1 && passed === passedBefore,
      'negative control: a drifted --ln-ink value FAILS the landing pin'
    );
    failures.length = before;
  }
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
  const productsSrc = read('ProductsSection.tsx');
  const rolesSrc = read('RolesSection.tsx');
  const progressSrc = read('ProgressSection.tsx');
  const platformsSrc = read('PlatformsSection.tsx');
  const finaleSrc = read('FinaleCta.tsx');
  const faqSrc = read('LandingFaq.tsx');
  const footerSrc = read('LandingFooter.tsx');
  const orbitSrc = read('OrbitScene.tsx');
  const lrm129 = allTopLevelBlocks(lcss, '@media (prefers-reduced-motion: reduce)').join('\n');

  // A ── P4-18 label halo + the resting micro-depth family (P3-28..35).
  check(
    /radial-gradient\(ellipse at center, var\(--ln-lime\) 0%, transparent 70%\)/.test(topLevelBlock(lcss, '.landing .ln-label::before')),
    'landing .ln-label::before: lime halo radial (P4-18)'
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
  check(
    /inset 0 1px 0 rgba\(245,\s*243,\s*231,\s*0\.04\)/.test(topLevelBlock(lcss, '.landing .ln-progress-visual')),
    'landing .ln-progress-visual: inset top-light (P3-29)'
  );
  check(
    /box-shadow:\s*0 1px 2px rgba\(0,\s*0,\s*0,\s*0\.06\)/.test(topLevelBlock(lcss, '.landing .ln-role-row:hover')),
    'landing .ln-role-row:hover: shadow 0 1px 2px rgba(0,0,0,0.06) (P3-35)'
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
    /background:\s*var\(--ln-lime\)/.test(skip) && /z-index:\s*2100/.test(skip),
    'landing .ln-skip-link: lime pill above the grain veil (z-2100)'
  );
  check(
    /body > a\[href="#main-content"\]\s*\{\s*display:\s*none/.test(lcss),
    'landing route: the layout global gold skip pill is hidden (canonical lime pill owns the route)'
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
    /@media \(max-width: 390px\)[^@]*\.ln-trust-inner[^}]*font-size:\s*12\.5px/.test(lcss),
    'landing @390 trust band tightening'
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

  // I ── the products constellation anatomy (P0-11 + P1-4, ruling CANONICAL).
  check(
    /DOT_SIZE/.test(productsSrc) && /inlineSize:\s*8/.test(productsSrc),
    'products constellation dots: 8×8px canonical pins (not 13px)'
  );
  check(
    !/rgba\(245,\s*243,\s*231,\s*0\.45\)/.test(productsSrc),
    'products constellation idle dots ≥ canonical 0.65 alpha (P2-13)'
  );
  check(
    productsSrc.includes('rgba(245,243,231,0.65)') && !/var\(--ln-lime\)"?,\s*$/.test(productsSrc.split('DOT_REST')[0]),
    'products constellation: uniform cream 0.65 idle — no permanently-lime dots (one-pop lime roster)'
  );
  check(
    /RING_COUNT = 6/.test(productsSrc) && /RING_STEP = 36/.test(productsSrc) && /RING_BASE = 66/.test(productsSrc),
    'products constellation: six concentric rings on the 36-unit module (66…246)'
  );
  check(
    /REST_CYCLE_MS = 4000/.test(productsSrc) && /is-resting/.test(productsSrc),
    'products constellation: ~4s resting-life cycle (is-resting, RM-gated, IO-paused)'
  );
  check(
    /scale\(1\.45\)/.test(topLevelBlock(lcss, '.landing .ln-constellation-dot.is-resting')),
    'landing .ln-constellation-dot.is-resting: scale 1.45 + flat ring (canonical)'
  );
  check(
    /ln-constellation-browse/.test(productsSrc) && /ln-constellation-cta/.test(productsSrc),
    'products constellation: registry CTA strip + browse pill (canonical anatomy)'
  );
  check(
    /min-block-size:\s*46px/.test(topLevelBlock(lcss, '.landing .ln-constellation-browse')),
    'landing .ln-constellation-browse: the canonical 46px ghost pill'
  );
  check(
    /role="status"/.test(productsSrc),
    'products constellation tip: React-state role=status (canonical, anchored at the node)'
  );

  // J ── marquee fill (P2-10): ≥15 items so one copy fills ≥2200px.
  {
    const block = pageSrc.match(/MARQUEE_ITEMS = \[([\s\S]*?)\]/)?.[1] ?? '';
    const items = (block.match(/"/g) ?? []).length / 2;
    check(items >= 15, `landing marquee: ≥15 items so the ×2 track fills ≥2200px viewports (found ${items})`);
  }

  // K ── chapter labels: canonical sequence (ruling-gated → CANONICAL).
  check(rolesSrc.includes('04 — المجتمع'), "roles chapter label: '04 — المجتمع' (canonical sequence)");
  check(finaleSrc.includes('05 — الوصول'), "finale CTA label: '05 — الوصول' (canonical sequence)");
  check(!platformsSrc.includes('className="ln-label"'), 'platforms chapter carries NO ln-label (canonical campus is unlabelled)');
  check(faqSrc.includes('06 — الأسئلة'), 'faq label follows the canonical sequence (06)');

  // L ── main landmark: focusable skip target (P0-28).
  check(
    /tabIndex=\{-1\}/.test(pageSrc) && /id="main"/.test(pageSrc),
    'landing main: id="main" + tabIndex -1 (focusable skip target)'
  );

  // M ── the OrbitScene canvas port — palette triplets + engine constants.
  check(orbitSrc.includes('245,243,231'), 'OrbitScene: cream triplet 245,243,231 hardcoded (canvas cannot read CSS vars)');
  check(orbitSrc.includes('223,237,178'), 'OrbitScene: lime triplet 223,237,178 hardcoded');
  check(orbitSrc.includes('122,107,242'), 'OrbitScene: violet triplet 122,107,242 hardcoded');
  check(orbitSrc.includes('0.00016'), 'OrbitScene: omega in rad/ms (0.00016 inner ring — never rescaled)');
  check(/biasX/.test(orbitSrc) && pageSrc.includes('biasX={-0.35}'), 'OrbitScene: biasX prop + hero mount biasX={-0.35} (RTL physical sign)');
  check(orbitSrc.includes('smartlink.intro.seen'), "OrbitScene: per-product sessionStorage intro key 'smartlink.intro.seen'");
  check(
    /Math\.min\(window\.devicePixelRatio \|\| 1, 1\.5\)/.test(orbitSrc),
    'OrbitScene: DPR hard cap 1.5 (retina paints ≤2.25× CSS px)'
  );
  check(orbitSrc.includes('TRAIL_MAX = 16'), 'OrbitScene: TRAIL_MAX 16 ring buffer (visual diet)');
  check(orbitSrc.includes("'80px 0px'"), "OrbitScene: IntersectionObserver rootMargin '80px 0px' (offscreen pause)");
  check(orbitSrc.includes('prefers-reduced-motion: reduce') && orbitSrc.includes('drawStatic'), 'OrbitScene: reduced-motion → single drawStatic() composed frame');
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

  // O ── token fixes (token-matrix SL rows): the canonical gold family,
  //     --brand-purple, --ease-spring-snappy, --hover-lift — plus the
  //     canonical font stacks (pinned via THEME_FONTS above) and the
  //     landing-local Arabic-capable --ln-mono chain.
  pin(dark, 'dark', '--gold', '#E9B44C');
  pin(light, 'light', '--gold', '#D6A330');
  pin(dark, 'dark', '--gold-ink', '#ECC97D');
  pin(light, 'light', '--gold-ink', '#6B4C0B');
  pin(dark, 'dark', '--gold-soft', '#2C2410');
  pin(light, 'light', '--gold-soft', '#FCF1CD');
  pin(dark, 'dark', '--brand-purple', '#B7A0F4');
  pin(light, 'light', '--brand-purple', '#8A6FE0');
  pin(dark, 'dark', '--hover-lift', '-1px');
  pin(light, 'light', '--hover-lift', '-1px');
  pin(dark, 'dark', '--hover-lift-lg', '-3px');
  pin(light, 'light', '--hover-lift-lg', '-3px');
  pin(dark, 'dark', '--ease-spring-snappy', 'cubic-bezier(0.5, 1.6, 0.4, 1)');
  pin(light, 'light', '--ease-spring-snappy', 'cubic-bezier(0.5, 1.6, 0.4, 1)');
  pin(dark, 'dark', '--ring', '#E9B44C'); // r130 ruling: gold, per madarek tokens.css:233 cascade
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

  // A ── rule-presence: the two ≤560px constellation-CTA stacking rules
  //     (canonical landing.css:1708-1709, ported r130 W1-D P1-1).
  const block560 = allTopLevelBlocks(lcss130, '@media (max-width: 560px)').join('\n');
  check(
    /\.ln-constellation-cta\s*\{[^}]*flex-direction:\s*column[^}]*align-items:\s*stretch[^}]*text-align:\s*center/.test(block560),
    '560px rule presence: .ln-constellation-cta { flex-direction: column; align-items: stretch; text-align: center }'
  );
  check(
    /\.ln-constellation-browse\s*\{[^}]*justify-content:\s*center/.test(block560),
    '560px rule presence: .ln-constellation-browse { justify-content: center }'
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
  // the raw ambient loops bind bands (no raw 2s/3s/4s/20s survivors)
  check(
    /nav-shimmer\s+var\(--motion-duration-ambient\)/.test(css)
      && /blob-pulse\s+var\(--motion-duration-ambient-slow\)/.test(css)
      && /float-icon\s+var\(--motion-duration-ambient-drift\)/.test(css)
      && /grid-drift\s+var\(--motion-duration-ambient-scene\)/.test(css),
    'ambient loops: nav-shimmer/blob-pulse/float-icon/grid-drift bind --motion-duration-ambient* bands'
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

if (failures.length > 0) {
  console.error(`✗ Madarek parity snapshot FAILED (${failures.length} assertion(s)):`);
  for (const f of failures) console.error(`  • ${f}`);
  process.exit(1);
}

console.log(`✓ Madarek parity snapshot: ${passed} assertions passed (styles.css product tokens + landing.css Orbit-Ink layer == canonical values)`);
