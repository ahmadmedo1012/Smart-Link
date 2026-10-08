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
 * r127-F6 (A6 drift wave): (1) the WRONG dark-ring pin is corrected —
 *   --ring dark is now #C9962F (canonical cascade: dark
 *   --state-focus-ring-color → --accent-strong; fleet-convergent with
 *   Smart-Menu/Bot/Order), was the off-canonical #E9B44C that made
 *   convergence impossible without a test change; (2) the
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
  // r127-F6: corrected pin — canonical cascade resolves dark
  // --state-focus-ring-color → --accent-strong (7.38:1 on night);
  // the old #E9B44C pin enshrined the one fleet outlier as "canonical".
  '--ring': '#C9962F',
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
  '--font-heading': '"IBM Plex Sans Arabic", "Tajawal", system-ui, sans-serif',
  '--font-serif': '"IBM Plex Serif", Georgia, serif',
  '--font-mono': '"IBM Plex Mono", "IBM Plex Sans Arabic", ui-monospace, "SFMono-Regular", monospace',
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

if (failures.length > 0) {
  console.error(`✗ Madarek parity snapshot FAILED (${failures.length} assertion(s)):`);
  for (const f of failures) console.error(`  • ${f}`);
  process.exit(1);
}

// r126-W3d: on-accent ink consumption gate — the m15 doctrine finally wired.
// styles.css documents that filled CTAs carry --primary-fg ink because
// white-on-gold measures 1.89:1 (dark) / 3.8:1 (light). This gate makes the
// regression class (text-white sneaking back onto a gold fill) impossible.
{
  const tssx = readdirSync(new URL('../src', import.meta.url), { recursive: true })
    .filter((f) => String(f).endsWith('.tsx'))
    .map((f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8'))
    .join('\n');
  const onAccent = (tssx.match(/text-\[var\(--primary-fg\)\]/g) ?? []).length;
  check(onAccent >= 13, `--primary-fg must be consumed by >=13 on-accent CTAs (found ${onAccent})`);
  check(!/bg-(primary|\[var\(--primary\)\])[^"']*text-white/.test(tssx),
    'no text-white may ride a gold/primary fill — use text-[var(--primary-fg)]');
}

console.log(`✓ Madarek parity snapshot: ${passed} assertions passed (src/app/styles.css == canonical tokens.css values)`);
