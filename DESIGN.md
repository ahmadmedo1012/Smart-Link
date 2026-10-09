# DESIGN.md — the Smart-Link design language

> Context file for design/UX work. These are the system's laws as verified
> in code — follow them; change them only deliberately and update this file
> in the same commit.
>
> **Upstream source:** the Madarek design system (`madarek/frontend/src/styles/
> tokens.css` — the sibling-family single source of truth; it stands alone,
> no intermediate digest). See the family canon at
> `madarek/DESIGN.md` (§1a landing world, §1b product theme, §5 recipes,
> §8 adoption). **Token SSOT in this repo:** `src/app/styles.css` (the
> product layer: `:root` = night, `.light` = cream, `@theme inline` =
> Tailwind bridge) + `src/app/landing.css` (the Orbit-Ink layer, scoped
> `.landing`). If this file and the CSS disagree, the CSS wins — fix the doc.

## Identity — two sheets, one repo (never mixed)

Smart-Link paints **two deliberate worlds** (the madarek §1a/§1b split):

1. **The product layer** (`styles.css`) — gold-on-night (default) /
   copper-on-cream (`.light`). Madarek night world: ground `#070B16`
   night-indigo, surfaces `#0D1428 / #121A36`, ink `#F2EFE6` warm sand,
   accent `#E9B44C` gold (hover `#F5D48A` · strong `#C9962F` · soft
   `#2C2312` · on-accent ink `#05070F`), hairlines `#1B2444 / #263052`,
   secondary text `#C3C8DC`. Light mode is a first-class parity mode:
   cream ground `#FBFAF9`, white cards, ink `#191918`, copper accent
   `#B57438` (hover `#9A5F25` · strong/deep `#5C3416` · soft `#F4E4D2` ·
   fg `#1A0F06`), hairlines `#E9E7E2 / #D9D6D0`. All dual-lightness
   (both layers AA-verified).
2. **The Orbit-Ink landing layer** (`landing.css`, scoped `.landing`,
   r128) — painted identically in BOTH themes (intentional dark stage):
   ink ground `--ln-ink #252A3E`, scene step `--ln-ink-2 #1C2032`, cream
   type `#F5F3E7` (12.75:1 AAA) / `--ln-cream-dim #C9C6B4` (8.26:1),
   ONE lime accent `#DFEDB2 / #B9D778` (11.42 / 8.82:1), violet accent-2
   `#7A6BF2` (large-text/icon wells only; its well recipe is
   per-ground-tuned for WCAG 1.4.11 — see Components), hairlines
   `rgba(245,243,231,0.14 / 0.07)`, grain veil `--ln-grain-op 0.075`.

**Hard isolation (parity-enforced):** styles.css declares no `--ln-*`
tokens; every `--ln-*` declaration in landing.css lives inside a
`.landing`-scoped block. The landing imports BOTH sheets but only the
home route renders `.landing`.

**Token-name bridge** (Smart-Link keeps its own utility vocabulary over
Madarek values): `--background/--card/--foreground/--muted-foreground/
--border/--border-strong`, `--primary` = the gold/copper accent,
`--primary-fg` = on-accent ink, `--accent` = the 15% translucent wash,
`--destructive(+--ink)`, 9 pastel families `--c-{peach·mint·lavender·sky·
yellow·rose·sand·grey·copper}-{bg/-ink/-deep}` in both themes.

## Color

- **Tokens only.** Raw hexes are banned outside the two sheets
  (sanctioned raw-hex sites: email templates — email clients have no
  CSS vars, see `src/emails/contact-emails.tsx` — and the OrbitScene
  canvas triplets, which cannot read CSS vars at all).
- Status: `--success/--warning/--info` base = fill/stroke duty,
  `-ink` = the text-grade variant; `-deep` companions carry AA text on
  tinted grounds. Status boxes on the contact form derive their tints
  via `oklch(from var(--destructive) …)` color-mix.
- Muted tiers: `--text-muted #8E97B8` (dark) / `#6E6C65` (light) =
  6.80 / 5.04:1; `--text-faint #7A83A0` / `#74706A` = 5.22 / 4.72:1 —
  `::placeholder` rides `--text-faint` with `opacity: 1`.

## Typography

- **IBM Plex Sans Arabic is THE family** (body + display + headings),
  self-hosted 400/500/600/700 × {arabic, latin} subsets (8 faces) +
  IBM Plex Mono 400/500 latin (2 faces) — the 10-face `@font-face`
  manifest in styles.css, `font-display: swap`, the 400/700 arabic cuts
  preloaded (~86 KB, layout.tsx). Weights ≤ 700 (no 800 exists — no
  `font-extrabold`).
- **No letter-spacing on Arabic, ever** (r133 R12 — tracking breaks
  cursive joins; every `.ln-*` device carries `letter-spacing: 0`).
  No synthetic italics on Arabic; emphasis = weight + accent ink.
- Western/Latin digits only in UI (Arabic-Indic digits appear in code
  comments only); tabular numerals via the mono voice (`.ln-mono`).
- Type ladder (`--fs-*`, styles.css): `xxs 11 · xs 12 · sm 13 (buttons)
  · body 15 (prose) · body-lg 17 · h3 18 · h2 22 · h1 30 · metric
  22/30/44 · display-md clamp(28,3.6vw,40) · display-lg clamp(34,4.8vw,
  56) · display-xl clamp(40,6vw,72) · mega clamp(48,8.4vw,104)`.
  The **14px split** (r133 R16): prose rides `--fs-body` 15px; 14px is
  a frozen UI-chrome rung (exact-count parity-pinned: footer 8 ·
  main-nav 6 · contact-form 6 labels). The 404 numeral is documented
  display-art (`text-9xl` 128px, off-ladder by design).

## Shape, space, elevation

- Radius ladder: `--r-xs 6 · sm 8 · md 10 · lg 12 · xl 16 · 2xl 20 ·
  3xl 28 · full 9999px`, bridged into Tailwind at full width
  (`@theme --radius-xs…3xl`) — never ad-hoc px radii.
- Inner-page CTAs: the r131 fleet button canon **40/13/600/r10**
  (`h-10` 40px · `--fs-sm` 13px · 600 · `rounded-md` 10px · press
  `active:scale-[0.97]` · gold fill + `--primary-fg` ink — never
  white-on-gold).
- Elevation `--elev-1..5` (dark = fill-led + inset white top-light;
  light = two-layer black); glass `rgba(11,16,32,0.78)` dark /
  `rgba(251,250,249,0.78)` light. The **landing bans glass entirely**.

## Motion

- Madarek ladder: `--t-micro 80 / --t-fast 160 / --t-base 240 /
  --t-slow 380 / --t-slower 520 / --t-cinema 720ms`; semantic layer
  `--motion-duration-*` (page 320 · reveal 360 · stat 700 · skeleton
  1200ms + six ambient bands); 7 canonical easings (`--ease-out`
  `cubic-bezier(0.16,1,0.3,1)` is the exponential settle).
- **r134 default-transition bridge** (`@theme inline`): every bare
  `transition-*` utility settles on the canon curve —
  `--default-transition-timing-function: var(--ease-out)`.
- `[dir=rtl]` flips `--motion-direction: -1` (logical translations).
- **Reduced motion** = the universal 0.01ms belt (animation +
  transition + DELAYS reset to 0s) **plus** the token-zeroing layer
  (`:root --t-* → 0ms`); the marquee's raw 42s loop carries its own
  RM off-switch; OrbitScene falls back to a single `drawStatic()` frame.

## Components (the contact form is the product's one form — keep it canonical)

- **Inputs** (r134, family recipe): 44px min-height (`min-h-11`) +
  `rounded-md` (10px) + 16px text (the iOS zoom floor — Safari auto-
  zooms under 16px) + placeholder `--text-faint`; focus = the canonical
  recipe `--state-input-focus-border` (accent border) + 3px 22%-alpha
  halo (`--state-input-focus-halo`); hover strengthens the resting
  border (`hover:border-[var(--border-strong)]`) — invalid fields keep
  their destructive border on hover. Browser surfaces are themed
  (r134): `caret-color: var(--accent-ink)` + Chromium autofill cover
  (1000px inset `--card` box-shadow + `-webkit-text-fill-color`) +
  Firefox `:autofill`.
- **Landing pills (sanctioned exemption, madarek §1a):** the landing's
  primary CTA is a **46px pill** (`min-block-size: 46px`, xl 48px) —
  lime fill, the ONE lime-filled surface; ghost pills stay cream on a
  hairline. The compact header CTA re-skin (r129 ruling) is 44px/12px.
  These pill heights are landing-world vocabulary and do NOT migrate to
  product surfaces, which ride the 40/13/600/r10 canon above.
- **Focus rings, two worlds:** product = universal `*:focus-visible`
  2px `var(--ring)` outline, offset 2px (gold `#E9B44C` dark / copper
  `#5C3416` light); landing = 2px `--ln-cream` outline, offset 3px.
  Never mix the two sub-languages.
- Icon wells: tone-coded (`gold/mist/azure`); the **azure well recipe
  is per-ground** — `.ln-menu-ico.azure` 0.16 on the ink-2 panel,
  `.ln-platform-ico.azure` 0.14 over the cream-tinted cell,
  `.ln-role-ico.azure` 0.12 on the plain-ink ground (each recomputed
  ≥ 3:1 for WCAG 1.4.11 — the violet icon is lighter than the well, so
  a STRONGER wash lowers contrast; verify before tuning).
- Icons: lucide named imports only. Forward motion in RTL points LEFT.

## RTL & layout

Arabic RTL-first (`lang="ar" dir="rtl"`); logical properties throughout
(`end-*`/`ms-*`/`pe-*`; no physical left/right in app CSS — the r131
A12 fleet rule). Numeric/Latin runs (phones, URLs) get `dir="ltr"`
isolation. Touch targets ≥ 44px. The landing carries `overflow-x: clip`
+ safe-area insets; content-visibility below the fold.

## Copy canon (Arabic)

فصحى only — no dialect; «تواصل معنا» (never «اتصل بنا», r9/r134);
«تعذّر» over «فشل» for user-facing failures; «…» guillemets for
pull-quotes (never Latin curly quotes, r134); «جارٍ» spelling;
،؛؟ punctuation; Western digits in UI. One display format per constant
(SITE in `lib/site.ts` — single source for emails/URLs/phone);
WhatsApp CTAs carry a per-surface prefilled opener
(`whatsappUrl(surface)` in `lib/site.ts`); JSON-LD keeps machine
URLs bare.

## SEO/metadata conventions

Title template `%s | SmartLink`. OG cards: `og-smartlink.jpg`
1200×630, `og:image:alt` = the family Arabic-prefix form
«الربط الذكي — SmartLink» (r134); `og:locale ar_AR`;
`metadataBase` = `SITE.url`. `manifest.webmanifest`: night+gold
identity; viewport `themeColor` dual cream/night.

## Enforcement — how this system is gated

`npm run test:parity` (`tests/parity.mjs`, 520 assertions): pins every
product token (both themes), the `@theme inline` bridges, the 10-face
font manifest, the prefers-contrast port, the RM belt + token zeroing,
the full landing `--ln-*` surface, the marquee seam arithmetic, the
scope isolation in both directions (R4), per-file type-scale
consumption + negative sweeps, and the r134 fix set (drawer Escape,
autofill/caret, easing bridge, input recipe, wa.me prefill, og alt).
`npm run lint` (ESLint 9, 0/0) + `npm run build` (13 static pages) +
`npm run test:e2e` (Playwright, 302 tests) run in CI
(`ci.yml` — parity was wired in r126).

## Do's and Don'ts

- Do keep the two sheets isolated — a product page never consumes
  `--ln-*`; the landing never consumes glass.
- Do reuse the SITE constants (`lib/site.ts`) — never hardcode emails,
  URLs, or phone formats.
- Don't put white text on gold fills (`--primary-fg` exists because
  white-on-gold is 1.89:1).
- Don't track (letter-space) Arabic — ever.
- Don't use raw Tailwind type steps (`text-sm` on prose, `text-xl`
  headings) — consume the `--fs-*` ladder.
- Don't animate layout properties; transform/opacity only.
- Don't invent token values — extend at the composition layer; if a
  product needs a different value, that's a family change (madarek
  §8), not a local override.
