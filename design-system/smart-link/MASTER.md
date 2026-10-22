# Design System Master File

> **P13-2a (truth pass):** this file was AUTO-GENERATED and its original
> palette/typography/component recipes (glass white + system blue, Inter,
> gsap) NEVER matched this repo's code. The sections below were re-pinned
> to the real tokens; the generic recipe/keyword sections that remain are
> auto-generated guidance, not this project's system. The SSOT is
> `src/app/styles.css` + `src/app/landing.css` — if anything here
> disagrees with the CSS, **the CSS wins; fix this file**.

---

**Project:** smart-link
**Generated:** 2026-10-14 00:29:32 · **Token truth re-pinned:** P13-2a (r160 KODE)
**Category:** Spatial Computing OS / App
**Design Dials:** Variance 8/10 (Bold / Asymmetric) | Motion 6/10 (Standard)

---

## Global Rules

### Color Palette (KODE, r160 — the real tokens)

Dark (`:root`, the default theme) — near-black stage + white + safety orange:

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background (stage) | `#050507` | `--background` |
| Foreground (stage text) | `#FFFFFF` | `--foreground` |
| Card | `#0B0B10` | `--card` |
| Accent/CTA fill | `#FF4C00` | `--primary` / `--accent-solid` |
| On-accent ink | `#050507` | `--primary-fg` / `--accent-fg` |
| Accent as text | `#FF4C00` | `--primary-text` (6.1:1, accent-size text) |
| Accent hover | `#FF6A2E` | `--accent-hover` / `--accent-strong` |
| Accent soft | `#221008` | `--accent-soft` |
| Muted foreground | `#A9ACB4` | `--muted-foreground` |
| Border | `#17171F` | `--border` |
| Ring (focus) | `#FF4C00` | `--ring` |
| World tokens (menu/bot/order, lit+true) | `#FF4C00` | `--ln-{menu,bot,order}[-true]` |
| World wells | `#221008` | `--ln-{menu,bot,order}-well` |

Light (`.light`) — paper + ink + the same orange:

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background (paper) | `#F4F2ED` | `--background` |
| Foreground (ink) | `#0A0A0A` | `--foreground` |
| Card | `#FFFFFF` | `--card` |
| Accent/CTA fill | `#FF4C00` | `--primary` |
| On-accent ink | `#0A0A0A` | `--primary-fg` |
| Accent as text | `#B23E00` (5.2:1 on paper) | `--primary-text` |
| Accent hover | `#E04400` | `--accent-hover` |
| Accent soft | `#FFE3D6` | `--accent-soft` |
| Muted foreground | `#55534E` | `--muted-foreground` |
| Border | `#E9E7E2` | `--border` |
| Ring (focus) | `#B23E00` | `--ring` |

**Color Notes:** the landing layer (`landing.css`, scoped `.landing`) rides
the same 3-color discipline with `--ln-ink #050507` / `--ln-cream` white /
orange flood accents; filled CTAs always carry the on-accent ink
(6.1:1 dark / 5.9:1 light — white-on-orange is only 3.3:1; W21-H
recomputed, the old ≈6.3:1/5.8:1/2.8:1 figures were the retired gold's). The retired
Madarek values (night `#070B16` · gold `#E9B44C` · cream `#FBFAF9` ·
per-product terracotta/teal/orange worlds) are HISTORY — never
re-introduce them as current.

### Typography (the real fonts)

- **Body/UI font:** IBM Plex Sans Arabic 400–700 (self-hosted woff2 in `public/fonts/`; `@font-face` in `src/app/styles.css`)
- **Display Arabic:** Noto Kufi Arabic 700/800 (next/font — the hero 3-line lockup + r160 display rules)
- **Display Latin:** Bodoni Moda 700 (next/font — the Latin wordmark)
- **Mono:** IBM Plex Mono (self-hosted; the status chrome `SCROLL — تصفّح`, `[ SMART LINK — 001 ]` labels)
- **Mood:** ink/paper/safety-orange, studio-lit sculpture, flat orange floods, mono status chrome
- **NO Google Fonts request at all** — everything self-hosted or next/font-bundled; never add a `fonts.googleapis.com` import.

**CSS Import:** none — the fonts are wired in `src/app/layout.tsx` (next/font) and `src/app/styles.css` (@font-face).

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #FFFFFF;
  color: #0F172A;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #000000;
  border: 2px solid #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #888888;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #FFFFFF;
  outline: none;
  box-shadow: 0 0 0 3px #FFFFFF20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Brutalism

**Keywords:** Raw, unpolished, stark, high contrast, plain text, default fonts, visible borders, asymmetric, anti-design

**Best For:** Design portfolios, artistic projects, counter-culture brands, editorial/media sites, tech blogs

**Key Effects:** No smooth transitions (instant), sharp corners (0px), bold typography (700+), visible grid, large blocks

### Page Pattern

**Pattern Name:** Immersive/Interactive Experience

- **Conversion Strategy:** Measure engagement for the specific audience and device mix. Performance trade-off. Provide skip option. Mobile fallback essential. Provide skip, keyboard, reduced-motion, and non-3D fallback paths. Pause animation when offscreen/hidden and preserve the completed final state when reduced motion is enabled.
- **CTA Placement:** After interaction complete + Skip option for impatient users
- **Section Order:** Full-screen interactive element > Guided product tour > Key benefits revealed > CTA after completion

---

## Motion

**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`

```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```

**Framework notes:** grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger; Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately

- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI
- ⚡ Group DOM writes; avoid interleaving layout reads (getBoundingClientRect) between staggered tweens

---

## Anti-Patterns (Do NOT Use)

- ❌ 2D design
- ❌ No spatial depth

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
