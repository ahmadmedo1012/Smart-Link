# DESIGN.md — the Smart-Link design language

> Context file for design/UX work. These are the system's laws as verified
> in code — follow them; change them only deliberately and update this file
> in the same commit.
>
> **Constitution version: Phase 5 (r152) — «مدارك Night: The Ecosystem
> Observatory».** The hub KEEPS and now truly OWNS the family identity
> (ink night · sand · luminous gold) and FORESHADOWS its three siblings'
> new worlds inside itself. **Token SSOT in this repo:** `src/app/styles.css`
> (the product layer: `:root` = night, `.light` = cream, `@theme inline` =
> Tailwind bridge) + `src/app/landing.css` (the مدارك Night landing layer,
> scoped `.landing`). If this file and the CSS disagree, the CSS wins —
> fix the doc.

## Identity — one family, one night, four worlds

Smart-Link is the UMBRELLA HUB of the ecosystem. The Phase-5 mission gave
its three siblings their own distinct worlds; the hub's job is to be the
one place where the family identity lives intact AND the one place where
you can see all three worlds at a glance.

1. **The product layer** (`styles.css`, every route except `/`) —
   gold-on-night (default) / copper-on-cream (`.light`). Night world:
   ground `#070B16` night-indigo, surfaces `#0D1428 / #121A36`, ink
   `#F2EFE6` warm sand, accent `#E9B44C` gold (hover `#F5D48A` · strong
   `#C9962F` · soft `#2C2312` · on-accent ink `#05070F`), hairlines
   `#1B2444 / #263052`, secondary text `#C3C8DC`. Light mode is a
   first-class parity mode: cream ground `#FBFAF9`, white cards, ink
   `#191918`, copper accent `#B57438` (hover `#9A5F25` · strong/deep
   `#5C3416` · soft `#F4E4D2` · fg `#1A0F06`), hairlines `#E9E7E2 /
   #D9D6D0`. All dual-lightness (both layers AA-verified).
2. **The مدارك Night landing layer** (`landing.css`, scoped `.landing`,
   r152) — painted identically in BOTH themes (intentional dark stage).
   It carries the SAME family values as the product night world —
   `--ln-ink #070B16` (the ground), `--ln-ink-2 #0D1428` (the surface
   step), `--ln-cream #F2EFE6` sand (17.09:1 AAA) / `--ln-cream-dim
   #C3C8DC` (11.81:1 AAA), the gold pair `--ln-gold #E9B44C` (10.39:1) /
   `--ln-gold-deep #F5D48A` (hover, 13.73:1), sand hairlines
   `rgba(242,239,230,0.14 / 0.07)`, night glass `rgba(13,20,40,0.72 /
   0.9)`, grain veil `--ln-grain-op 0.075`. The r128–r151 Orbit-Ink
   palette (ink `#252A3E` · lime `#DFEDB2` · violet `#7A6BF2`) is
   RETIRED — its return is the negative control's planted failure.

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

## Color architecture

- **Tokens only.** Raw hexes are banned outside the two sheets
  (sanctioned raw-hex sites: email templates — email clients have no
  CSS vars, see `src/emails/contact-emails.tsx` — and the canvas
  triplets, which cannot read CSS vars at all: the engine resolves
  `--ln-*` tokens at boot via getComputedStyle).
- **The §0a2 product-foreshadow pairs** (r152 — NEW canonical tokens,
  parity-pinned). The hub advertises its siblings' Phase-5 identities:

  | world | sibling identity | lit grade (text/fill/node) | true hex (swatch/motif) |
  |---|---|---|---|
  | Smart Menu | warm culinary terracotta | `--ln-menu #E07A5F` — 6.66:1 | `--ln-menu-true #C2452D` — 3.91:1 non-text |
  | SmartBot | circuit-petrol signal teal | `--ln-bot #17C3A4` — 8.78:1 | `--ln-bot-true #17C3A4` (the one identity hex that is its own lit grade) |
  | Smart Order | operational daylight orange | `--ln-order #EF7A35` — 7.02:1 | `--ln-order-true #D14900` — 4.37:1 non-text |

  **Grade law:** the LIT grade (consumed as the local `--ln-world`)
  carries world text, ghost/CTA fills (with night ink on the fill), and
  canvas nodes — every one ≥ 4.5:1 on `#070B16` in BOTH directions. The
  TRUE hex (consumed as `--ln-world-true`) carries the swatch chips, the
  motif devices, and decorative edges ONLY — non-text ≥ 3:1 (WCAG
  1.4.11); terracotta (3.91) and orange (4.37) miss the 4.5 text floor
  and are NEVER body text. `worlds.ts` is the registry: `token` (lit) /
  `swatch` (true) / `motif` per world.
- **Gold is the ONE hub accent.** The gold appears on: the brand chip,
  the conversion pills, the skip pill, chapter label halos, the hero's
  one accent word, the beam head, the live dots, the cockpit sweep, the
  selection pair, the finale orbit traveller, the canvas core bloom,
  the signal icon wells. One accent per chapter — the roster discipline
  the lime carried in Orbit-Ink now carries the family gold.
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
  comments and as deliberate chapter furniture — the worlds' giant
  `٠١/٠٢/٠٣` numerals); tabular numerals via the mono voice
  (`.ln-mono`, whose fallback chain keeps Arabic-capable runs RTL).
- Type ladder (`--fs-*`, styles.css): `xxs 11 · xs 12 · sm 13 (buttons)
  · body 15 (prose) · body-lg 17 · h3 18 · h2 22 · h1 30 · metric
  22/30/44 · display-md clamp(28,3.6vw,40) · display-lg clamp(34,4.8vw,
  56) · display-xl clamp(40,6vw,72) · mega clamp(48,8.4vw,104)`.
  The **14px split** (r133 R16): prose rides `--fs-body` 15px; 14px is
  a frozen UI-chrome rung (exact-count parity-pinned: footer 8 ·
  main-nav 6 · contact-form 6 labels). The 404 numeral is documented
  display-art (`text-9xl` 128px, off-ladder by design). The landing's
  own display rung: `--ln-h1 clamp(2.75rem, 8.2vw, 6.75rem)` at
  `--ln-h1-lh 1.12` (the Arabic display floor with tashkeel).

## Layout & geometry

- Radius ladder: `--r-xs 6 · sm 8 · md 10 · lg 12 · xl 16 · 2xl 20 ·
  3xl 28 · full 9999px`, bridged into Tailwind at full width
  (`@theme --radius-xs…3xl`) — never ad-hoc px radii. The landing's
  pill radius IS `--ln-radius-pill: var(--r-full)`.
- Landing vertical rhythm (r151): the desktop section paddings resolve
  onto the 4/8 grid at the 1440×900 reference — hero 128/128 ·
  chapters 112 · finale 144 · FAQ 80 (the vh-clamps keep scaling around
  those floors; the ≤768 density pass is the sanctioned mobile
  exception).
- One border/surface system: the landing's surfaces are `--ln-ink`
  ground → `--ln-glass`/`--ln-glass-strong` panels (backdrop-blur 16px)
  → `--ln-ink-2` consoles → hairlines `--ln-line`/`--ln-line-soft`.
  Deep panel washes are `rgba(13,20,40,0.25–0.35)` (the surface step,
  never a new hue). Elevation on the product layer: `--elev-1..5`
  (dark = fill-led + inset white top-light; light = two-layer black);
  the landing's depth is its glass + the single sanctioned hero radial
  (α ≤ 0.12) + canvas nebulas.
- The hero composition is asymmetric under RTL: the copy column hugs
  the reading start (inline-start = right); the living constellation
  sits opposite (`biasX -0.35`), canvas contained by both axes.
- Touch targets ≥ 44px everywhere (the r148–r151 floors: chips, eco
  close halo, world CTAs at 48, header pills at 44); `overflow-x: clip`
  + safe-area insets on the landing; content-visibility below the fold.

## Components (the contact form is the product's one form — keep it canonical)

- **Inputs** (r134, family recipe): 44px min-height (`min-h-11`) +
  `rounded-md` (10px) + 16px text (the iOS zoom floor) + placeholder
  `--text-faint`; focus = the canonical recipe
  `--state-input-focus-border` + 3px 22%-alpha halo; hover strengthens
  the resting border — invalid fields keep their destructive border on
  hover. Browser surfaces are themed (caret + both autofill engines).
- **Landing pills (sanctioned exemption):** the landing's primary CTA
  is a **48px pill** (finale pair 52; compact header pair 44) — gold
  fill + `--ln-ink` text (10.39:1), the ONE gold-filled primary CTA
  surface; ghost pills stay sand on a hairline; the world CTAs ride the
  same 48px pill in the LIT world hue with night ink. Every landing CTA
  is radius-full. These pill heights are landing-world vocabulary and
  do NOT migrate to product surfaces, which ride the 44/13/600/r10
  fleet canon below.
- **Inner-page CTA canon (r150):** 44/13/600/r10 — `h-11` 44px ·
  `--fs-sm` 13px · 600 · `rounded-md` · press `active:scale-[0.97]` ·
  gold fill + `--primary-fg` ink (never white-on-gold — 1.89:1).
- **Focus rings, two worlds:** product = universal `*:focus-visible`
  2px `var(--ring)` outline, offset 2px; landing = 2px `--ln-cream`
  outline, offset 3px — ONE ring color on the landing. The single
  documented exception class: pills filled with a LIGHT surface (the
  gold `ln-btn-gold`; the world-filled `ln-eco-card-cta`) take the
  `--ln-ink` outline — the ring must survive its own fill edge.
- **Icon wells:** tone-coded (`gold/mist/signal`) — the azure (violet)
  tone retired with Orbit-Ink; `signal` = the gold-tinted well
  (0.16 wash on the ink-2 panel, 0.14 over the cream-tinted ground
  cell — per-ground recipes, both ≥ 3:1 for WCAG 1.4.11).
- **The constellation engine** (`EcosystemConstellation` + `ecosystem/`):
  a SmartLink core (sand nucleus + GOLD bloom + breathing hairline
  ring) orbited by the three product nodes on tilted ellipses in their
  lit world hues, joined by pulsing data links. Craft laws: DPR 1.5
  cap, 48ms dt clamp, allocation-free draw, IO/visibility pause,
  returning-visitor calm (sessionStorage), reduced-motion = ONE
  composed static frame, ZERO hex in TSX (all hues read from tokens at
  boot; the token layer refusing to resolve fails the canvas safe).
- **The foreshadow devices (r152):** `.ln-motif--plate` (terracotta
  serving circle: rim + center), `.ln-motif--circuit` (teal trace +
  node dots), `.ln-motif--route` (orange dashed line + origin dot +
  destination ring) — all logical-property insets (RTL-mirroring), all
  painted from `--ln-world-true`. They open every world panel (the
  identity strip: motif + live domain), replace the eco-card's hue dot
  in the hero glass card, and echo inside the mocks (menu dish thumbs
  go plate-round via `[data-world="menu"]`).
- Icons: lucide named imports only. Forward motion in RTL points LEFT.

## Motion

- Madarek ladder: `--t-micro 80 / --t-fast 160 / --t-base 240 /
  --t-slow 380 / --t-slower 520 / --t-cinema 720ms`; semantic layer
  `--motion-duration-*` (page 320 · reveal 360 · stat 700 · skeleton
  1200ms + ambient bands); 7 canonical easings (`--ease-out`
  `cubic-bezier(0.16,1,0.3,1)` is the exponential settle).
- **r134 default-transition bridge** (`@theme inline`): every bare
  `transition-*` utility settles on the canon curve.
- `[dir=rtl]` flips `--motion-direction: -1` (logical translations).
- **Reduced motion** = the universal 0.01ms belt + token-zeroing layer
  (`--t-* → 0ms`); the marquee's raw 42s loop carries its own RM
  off-switch; the constellation falls back to one `drawStatic()` frame;
  the crest, orbit rings, eco card, live dots each carry their kill.

## RTL & layout

Arabic RTL-first (`lang="ar" dir="rtl"`); logical properties throughout
(`end-*`/`ms-*`/`pe-*`; no physical left/right in app CSS — the r131
A12 fleet rule; the marquee veils and the hero scroll invite are the
documented direction-neutral exceptions). Numeric/Latin runs (phones,
URLs, world names) get `dir="ltr"` isolation. Copy canon: فصحى only;
«تواصل معنا»; «تعذّر» over «فشل»; «…» guillemets; ،؛؟ punctuation;
Western digits in UI; ONE display format per constant (SITE in
`lib/site.ts` — never hardcode emails/URLs/phone; WhatsApp CTAs carry
the per-surface prefilled `whatsappUrl(surface)`); JSON-LD keeps
machine URLs bare.

## Asset direction

- Photography/art is generated in-repo: the seeded-SVG
  `GenArtBackground` (product pages, strokes on `--genart-accent`
  theme tokens) and `public/images/ecosystem/family.webp` (the finale
  crest — plate + robot ball + gold-threaded box, masked circular,
  9s float). No stock, no remote images (CSP keeps the surface
  minimal).
- The canvas paints its own light (gold nebula, sand horizon, world
  glows) — never ship a bitmap sky.
- Icons: lucide-react named imports, 16px on pills, `strokeWidth 1.7`
  on console glyphs.
- OG card `og-smartlink.jpg` 1200×630; `manifest.webmanifest` rides the
  night+gold identity; viewport `themeColor` dual cream/night.

## SEO/metadata conventions

Title template `%s | SmartLink`. `og:image:alt` = the family
Arabic-prefix form «الربط الذكي — SmartLink» (r134); `og:locale ar_AR`;
`metadataBase` = `SITE.url`. New pages MUST go through `pageMetadata()`
in `lib/seo.ts` (Next merges openGraph shallowly).

## Enforcement — how this system is gated

`npm run test:parity` (`tests/parity.mjs`, **537 assertions**): pins
every product token (both themes), the `@theme inline` bridges, the
10-face font manifest, the prefers-contrast port, the RM belt + token
zeroing, the FULL مدارك Night landing surface (the family values + the
§0a2 foreshadow pairs + night glass), the marquee seam arithmetic, the
scope isolation in both directions (R4), per-file type-scale
consumption + negative sweeps, the r134 fix set, and the r152
foreshadow devices (motifs on `--ln-world-true`, the identity strips,
the eco-card motif, the gold-bloom engine, the plate-round mock echo).
The negative control plants the RETIRED Orbit-Ink ground as the drift.
`npm run lint` (ESLint 9, 0/0) + `npm run build` (13 static pages) +
`npm run test:e2e` (Playwright, 302+ tests) run in CI (`ci.yml`).

## Do's and Don'ts

- Do keep the two sheets isolated — a product page never consumes
  `--ln-*`; the landing never consumes product glass.
- Do reuse the SITE constants (`lib/site.ts`) — never hardcode emails,
  URLs, or phone formats.
- Do give every world surface BOTH grades: text/CTAs in the lit grade,
  swatches/motifs in the true hex — never the reverse.
- Don't put white text on gold fills (`--primary-fg` exists because
  white-on-gold is 1.89:1); on the landing, night ink on gold.
- Don't track (letter-space) Arabic — ever.
- Don't use raw Tailwind type steps (`text-sm` on prose, `text-xl`
  headings) — consume the `--fs-*` ladder.
- Don't animate layout properties; transform/opacity only.
- Don't invent token values — extend at the composition layer; if a
  product needs a different value, that's a family change, not a local
  override.
- Don't resurrect the Orbit-Ink palette (lime/violet/`#252A3E` ink) —
  the parity negative control exists to catch exactly that.
- Don't write world-true hexes as text or CTA fills — they are
  swatch/motif/edge furniture only.
