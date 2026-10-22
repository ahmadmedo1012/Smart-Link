# DESIGN.md — the Smart-Link design language

> Context file for design/UX work. These are the system's laws as verified
> in code — follow them; change them only deliberately and update this file
> in the same commit.
>
> **Constitution version: Phase 13 (P13-2a) — ACTIVE SYSTEM: KODE (r160,
> «الرابط والمنظومة»)**. Per the CSS-wins law below, the operative system
> is what `styles.css`/`landing.css` declare today, and that is KODE:
> near-black stage `#050507` · paper `#F4F2ED` · safety orange `#FF4C00`
> (light text-grade `#B23E00` · on-fill ink `#050507`/`#0A0A0A` · hover
> `#E04400`) · white stage text · mono status chrome · display fonts
> **Noto Kufi Arabic 700/800** (hero lockup/headings) + **Bodoni Moda 700**
> (Latin) over IBM Plex Sans Arabic. The landing hero is the
> **ChainSculpture** WebGL chain (7 interlocked links, drag-rotatable,
> theme-aware) behind a 3-line Kufi type-block; the product worlds ride
> the unified KODE orange wells (`--ln-{menu,bot,order}` = `#FF4C00` /
> well `#221008` — the per-product terracotta/teal/orange hues retired
> with r160). Every Madarek-identity statement in the sections below is
> **historical lineage** (m15 bridge → phase5 «مدارك Night» r152 →
> phase6 gold-on-cream → r160 KODE), kept for archaeology — do NOT
> re-introduce night/gold `#070B16`/`#E9B44C` or gold-on-cream rulings
> as if current. **Token SSOT in this repo:**
> `src/app/styles.css` (the product layer: `:root` = KODE night,
> `.light` = KODE paper, `@theme inline` = Tailwind bridge) +
> `src/app/landing.css` (the landing layer, scoped `.landing` — KODE
> stage, night default + `html.light .landing` paper stage §15/§16b).
> If this file and the CSS disagree, **the CSS wins — fix the doc.**
>
> Previous constitution version (Phase 9, P9-3-a — historical record):
> Phase-5 «مدارك Night: The Ecosystem Observatory» + the Phase-6
> additions + the Phase-9 dual-stage landing (gold-on-cream light
> ruling · §0a2 foreshadow promotion to the product pages · genart
> observatory re-tone · the product-page chapter rhythm · the landing's
> working DAY stage). The hub then kept the family identity
> (ink night · sand · luminous gold) and foreshadowed its three
> siblings' worlds inside itself — all superseded by r160 KODE above.

## Identity — one family, one night, four worlds

Smart-Link is the UMBRELLA HUB of the ecosystem. The Phase-5 mission gave
its three siblings their own distinct worlds; the hub's job is to be the
one place where the family identity lives intact AND the one place where
you can see all three worlds at a glance.

1. **The product layer** (`styles.css`, every route except `/`) — KODE
   night (default) / KODE paper (`.light`). Night world: ground `#050507`
   near-black stage, surfaces `#0B0B10`, stage text `#FFFFFF` white,
   accent `#FF4C00` safety orange (hover brightens `#FF6A2E` · strong
   `#FF6A2E` · soft `#221008` · on-accent ink `#050507` 6.1:1), hairlines
   `#17171F / #26262E`, secondary text `#A9ACB4`. Light mode is a
   first-class parity mode: paper ground `#F4F2ED`, white cards, ink
   `#0A0A0A`, the orange-on-paper family (r160 — fill `#FF4C00` with
   `--primary-fg` ink `#0A0A0A` 5.9:1 · text-grade `#B23E00` 5.2:1 on
   paper · hover darkens `#E04400` · soft `#FFE3D6`), hairlines
   `#E9E7E2 / #D9D6D0`. The Madarek gold-on-night / gold-on-cream
   families (m15 → phase6) are RETIRED history (see the header's lineage
   note). All dual-lightness (both layers AA-verified).
2. **The KODE landing layer** (`landing.css`, scoped `.landing`, r160) —
   night stage by DEFAULT (the header toggle flips a real DAY stage,
   §15). It carries the SAME 3-color discipline as the product night
   world — `--ln-ink #050507` (the ground), `--ln-ink-2 #0B0B10` (the
   surface step), `--ln-cream #FFFFFF` stage white (20.3:1) /
   `--ln-cream-dim #A9ACB4` grey secondary (9.0:1), the orange pair
   `--ln-gold #FF4C00` (6.1:1 — the token NAME is the landing's accent
   slot, not a hue promise) / `--ln-gold-deep #FF6A2E` (hover, 7.1:1),
   white hairlines `rgba(255,255,255,0.16 / 0.08)`, flat night panels
   `rgba(11,11,16,0.92 / 0.97)` (glass retired), grain veil
   `--ln-grain-op 0.075`; §15's paper stage flips `--ln-ink #F4F2ED` /
   `--ln-cream #0A0A0A` (17.7:1) / text-grade `--ln-gold #B23E00` (5.2:1).
   The §0a2 world tokens all collapse onto `#FF4C00` (S3: the landing
   uses ONLY the stage palette). The r128–r151 Orbit-Ink palette (ink
   `#252A3E` · lime `#DFEDB2` · violet `#7A6BF2`) is RETIRED — its return
   is the negative control's planted failure.

**Hard isolation (parity-enforced, R4 re-truthed for phase6):**
styles.css declares EXACTLY the 9 promoted §0a2 tokens
(`--ln-{menu,bot,order}` × lit/true/well) per theme — nothing else in
the `--ln-*` namespace; every other `--ln-*` declaration in
landing.css lives inside a `.landing`-scoped block. The landing
imports BOTH sheets but only the home route renders `.landing`; a
product page never consumes the landing's surface tokens.

**Token-name bridge** (Smart-Link keeps its own utility vocabulary over
the KODE values): `--background/--card/--foreground/--muted-foreground/
--border/--border-strong`, `--primary` = the safety-orange fill
(`#FF4C00`, both themes), `--primary-text` = the text-grade accent
(`#FF4C00` night, 6.1:1 accent-size / `#B23E00` paper, 5.2:1),
`--primary-fg` = on-accent ink (`#050507` / `#0A0A0A`), `--accent` = the
translucent wash (orange 15% night / 12% paper), `--destructive
(+--ink)`, the accent family `--accent-{solid,hover,soft,strong,ink,fg}`
(hover `#FF6A2E` night / `#E04400` paper · soft `#221008` / `#FFE3D6` ·
strong `#FF6A2E` / `#B23E00` — the icon-well ground/ink pair, W21-A),
and the promoted §0a2 product identities (below) — the nine pastel
families `--c-*-{bg,ink,deep}` are RETIRED from both themes (phase6).

## Phase-6 additions (P6-2 — the finishing wave)

Four rulings landed on top of the r152 constitution (all
parity-pinned; see the enforcement numbers):

1. **The §0a2 foreshadow promotion to the product pages.** The three
   product-foreshadow identities left the landing scope: `styles.css`
   now declares the `--ln-{menu,bot,order}` LIT/TRUE/WELL tokens per
   theme (the landing keeps its `.landing`-scoped twins with IDENTICAL
   values — parity pins the two sheets equal; a one-sheet change is
   drift, not a decision). First consumer: the `/pricing` plan cards.
   The pastel icon wells are RETIRED (the nine families with their 54
   pins + extinction path); each card wears its product's identity —
   LIT icon ink on the WELL ground (`.ln-well--{menu,bot,order}`;
   night wells `#2E1A14/#0F2320/#2B1608` — lit ink ≥ 4.5:1 on the well
   in BOTH directions, both themes) + the TRUE-hex motif beside the
   title + LIT check bullets on mini-wells. The identity is the only
   difference between the cards: all three plans stay «مجاني» (no
   invented tiers) and the CTAs keep the family gold — the hub sells
   in gold, the siblings deliver in their own worlds.
2. **The light-theme gold ruling (coordinator decision).** Copper is
   retired from the light theme — one family, one accent, both
   themes. Computed law (measured, not eyeballed): fill `#E9B44C`
   carries `--primary-fg` ink `#1A0F06` at **9.96:1**; the TEXT grade
   is deep gold `#8A6420` at **5.13:1** on cream (≥ 4.5 — the ruling's
   floor); hover darkens to `#C9962F` (7.08:1 with the fill ink); the
   wash rides the dark twin's **15%** alpha; ring/focus = `#8A6420`
   (the accent-strong resolver pattern). The halo, glow, and grid
   hairline re-pinned on the family; the quiet-touch chrome
   (nav/footer/accordion/product-page icons + hover/focus inks) rides
   `--primary-text` instead of `--primary` fills — night keeps its
   gold 10.4:1, light gains the readable deep gold where the copper
   fill-on-cream grade used to sit at 1.82:1.
3. **The genart observatory re-tone.** The r126 neutral-gray genart
   stroke tokens are retired: `--genart-accent` = `#E9B44C` (night) /
   `#C9962F` (cream) — the generative grounds paint night-gold
   observatory hairlines and rings at the same generation opacities
   (0.01–0.08). Purely decorative `aria-hidden` furniture; ZERO
   geometry/seed change (the SVG is deterministic and server-rendered).
4. **The chapter rhythm utility.** `.ln-chapter` (styles.css, the
   unlayered bridge — not scoped `.landing`): supporting routes are
   single-brief documents, not scroll narratives, so they adopt the
   landing's compact fluid chapter scale `clamp(60px, 9vh, 84px)` at
   EVERY viewport, each chapter closing on the gold hairline
   `--chapter-line` (night `rgb(233 180 76 / 0.16)` · cream
   `rgb(138 100 32 / 0.25)` — the deep gold at whisper alpha; the
   luminous gold would sit at 1.8:1 on cream and vanish). Variants:
   `--head` (the page-head chapter — no top rhythm, a half-step
   bottom) and `--prose` (legal bodies — the half cadence, the
   sections keep their `space-y-6` flow inside ONE chapter).

## Phase-9 additions (P9-3-a — the dual-stage landing)

1. **The DAY stage (mission E3).** The old "the landing paints night in
   BOTH themes" doctrine is retired. `landing.css` §15 redefines the
   full `--ln-*` color surface under `html.light .landing` (next-themes
   class strategy, the same convention the layout boot script paints
   pre-hydration — no flash): ground/ink SWAP to the family's own
   `#F2EFE6` paper / `#070B16` ink (17.09:1 AAA — the night pair in
   reverse), surface step `#EAE6DA`, secondary `#444C5F` (7.47:1 AAA),
   ink hairlines `rgba(7,11,22,0.16 / 0.08)`, ivory glass
   `rgba(250,249,245,0.72 / 0.9)`, grain back to the 0.05 canonical.
   The night §0a block stays the untouched default (parity-pinned
   byte-identical; the day twin carries its own 17 pins + completeness
   gate). The raw night/sand literals that cannot flip via tokens got
   1:1 day twins (ink-wash hovers, paper scrolled header, paper console
   strips, 0.04–0.05 ink card washes, crisp day title — no black
   text-shadow).
2. **The day gold grades.** Text grade `--ln-gold #7E5B1C` (the
   product-layer `#8A6420` light ruling, one step deeper because the
   landing's `--ln-ink-2` paper is darker than the product cream:
   5.37:1 on paper AND 4.95:1 on ink-2); hover `--ln-gold-deep #6E4F18`
   (darkens on paper, mirroring the night's lighter-on-#F5D48A law).
   **The CTA exception:** `.ln-btn-gold` keeps the LUMINOUS fill in the
   day — `#E9B44C` fill + `#1A0F06` ink (9.95:1), hover `#C9962F`
   (7.07:1), exactly the product pages' light-mode gold pair. The
   conversion pill stays gold in both chapters; only the grades around
   it invert.
3. **The day foreshadow grades.** LIT grades darken to the siblings'
   own light-theme grades where they exist: `--ln-menu #A93A26`
   (Smart-Menu's hover terracotta, 5.50:1), `--ln-bot #0A7558`
   (darkened signal teal, 4.94:1 — `#17C3A4` misses the 3:1 non-text
   floor on paper, so its one-hex symmetry rides the darkened grade in
   BOTH lit and true), `--ln-order #B23E00` (5.10:1). TRUE hexes keep
   the literal identities (`#C2452D` 4.37:1 · `#D14900` 3.92:1 ·
   `#0A7558` — non-text ≥ 3:1 on paper).
4. **The working toggle + the living canvas.** `LandingHeader` carries
   the family twin (main-nav pattern: mounted guard via
   `useSyncExternalStore`, `resolvedTheme`, the Arabic aria-labels
   «تفعيل المظهر الفاتح/الداركن», Sun/Moon lucide icons, 44px floor —
   `landing.css` §15c, token-driven so it flips with the stage).
   `EcosystemConstellation` watches the `html` class with a
   `MutationObserver` and re-reads the SAME landing tokens → rebuilds
   sprites/star field/nebula → repaints (ink nodes on paper; the RM
   path redraws its single composed frame; a failed re-read keeps the
   last good palette — never guesswork). e2e:
   `e2e/landing-theme.spec.ts` (token flip, CTA pair, canvas pixel
   delta, persistence) + the axe light scans now exercise the REAL day
   stage.

## Color architecture

- **Tokens only.** Raw hexes are banned outside the two sheets
  (sanctioned raw-hex sites: email templates — email clients have no
  CSS vars, see `src/emails/contact-emails.tsx` — and the canvas
  triplets, which cannot read CSS vars at all: the engine resolves
  `--ln-*` tokens at boot via getComputedStyle).
- **The §0a2 product-foreshadow pairs** (r152 — NEW canonical tokens,
  parity-pinned; phase6 promoted into the product scope with a third
  WELL grade per world — see «Phase-6 additions»). The hub advertises
  its siblings' Phase-5 identities:

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
- Status: `--success` and `--destructive` base = fill/stroke duty,
  `-ink` = the text-grade variant (the `--warning/--info` pairs were
  deleted with zero consumers in r144 — do not resurrect them).
  Status boxes on the contact form derive their tints via
  `oklch(from var(--destructive) …)` color-mix.
- Muted tiers: `--text-muted #8E97B8` (dark) / `#6E6C65` (light) =
  6.80 / 5.04:1; `--text-faint #7A83A0` / `#74706A` = 5.22 / 4.72:1 —
  `::placeholder` rides `--text-faint` with `opacity: 1`.

## Typography

- **The r160 font trio**: **IBM Plex Sans Arabic** is THE body/UI family
  (400/500/600/700, self-hosted × {arabic, latin} subsets — 8 faces) +
  **IBM Plex Mono 400/500 latin** (2 faces) — the 10-face `@font-face`
  manifest in styles.css, `font-display: optional` on EVERY face (the
  P16-W7/P18-W2-b no-swap law — a swap event reflowed the hero +56px,
  CLS 0.053), the six above-fold faces preloaded (layout.tsx: sans
  400/500/600/700 arabic + 400 latin + mono 400). The DISPLAY pair
  rides next/font (r160 — no Google-Fonts runtime request): **Noto Kufi
  Arabic 700/800** (the hero 3-line lockup + chapter display,
  `--font-display-arabic`) + **Bodoni Moda 700** (the Latin
  wordmark/numbers, `--font-display-latin`). UI Plex caps at 700 (no 800
  face exists and no `font-extrabold` survives in the codebase); the 800
  display weight lives in the Kufi pair only.
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
  own display rung: `--ln-h1 clamp(3.5rem, 13vw, 11.875rem)` at
  `--ln-h1-lh 1.08` (the pixel-proven Kufi leading — P20-A2: 0.97 left
  a 14px descender/tashkeel overlap; 1.08 clears the raster ink; the
  short-stage budget divisor derives from it, `calc(3 *
  var(--ln-h1-lh))`, W21-A).

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
  is a **48px pill** (finale pair 52; compact header pair 44) — accent
  fill + `--ln-ink` text (6.1:1), the ONE luminous-fill primary CTA
  surface (the `ln-btn-gold` class name is lineage — the paint is the
  KODE orange; W21-H recomputed, the r152 gold pair's 10.39:1 went
  with the gold); ghost pills stay sand on a hairline; the world CTAs ride the
  same 48px pill in the LIT world hue with night ink. Every landing CTA
  is radius-full. These pill heights are landing-world vocabulary and
  do NOT migrate to product surfaces, which ride the 44/13/600/r10
  fleet canon below.
- **Inner-page CTA canon (r150):** 44/13/600/r10 — `h-11` 44px ·
  `--fs-sm` 13px · 600 · `rounded-md` · press `active:scale-[0.97]` ·
  accent fill + `--primary-fg` ink (never white-on-accent — 3.3:1; the
  retired gold's 1.89:1 founded the rule).
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
  in the hero glass card, echo inside the mocks (menu dish thumbs go
  plate-round via `[data-world="menu"]`), and — since the phase6
  promotion — open each `/pricing` plan card beside the product name.
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
  theme tokens — phase6: night-gold observatory hairlines `#E9B44C`
  dark / `#C9962F` light, the r126 neutral grays retired) and
  `public/images/ecosystem/family.webp` (the finale crest — plate +
  robot ball + gold-threaded box, masked circular, 9s float). No
  stock, no remote images (CSP keeps the surface minimal).
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

`npm run test:parity` (`tests/parity.mjs`, **524 assertions** — the
suite self-counts via `EXPECTED_ASSERTIONS`; phase6: 537 → 509 with
the §0a2 promotion — the nine pastel families retired with their 54
pins + the extinction path — then 509 → 524 across the chapter-rhythm
and light-gold waves): pins every product token (both themes), the
`@theme inline` bridges, the 10-face font manifest, the
prefers-contrast port, the RM belt + token zeroing, the FULL مدارك
Night landing surface (the family values + the §0a2 foreshadow pairs
+ night glass), the §0a2 promotion (the `/pricing` wells/motifs on
the promoted tokens, the pastel extinction, the two-sheets-equal
drift gate), the light gold family (fill/text/fg/ring/wash per the
ruling's computed values), the genart re-tone, the `.ln-chapter`
rhythm, the marquee seam arithmetic, the scope isolation in both
directions (R4), per-file type-scale consumption + negative sweeps,
the r134 fix set, and the r152 foreshadow devices (motifs on
`--ln-world-true`, the identity strips, the eco-card motif, the
gold-bloom engine, the plate-round mock echo). The negative control
plants the RETIRED Orbit-Ink ground as the drift.
`npm run lint` (ESLint 9, 0/0) + `npm run build` (13 static pages) +
`npm run test:e2e` (Playwright, **309 tests, 23 spec files**) run in
CI (`ci.yml`). The e2e port/workers are env-configurable (phase6):
`E2E_PORT` (default 3111 — deliberately never collides with the
mission-control server on 3000 in shared boxes; CI sets nothing and
gets 3111) and `E2E_WORKERS` (memory-constrained boxes can lower the
parallelism instead of crashing chromium — same tests, same
assertions, the local green baseline is 309/309 on
`E2E_PORT=3111 E2E_WORKERS=2`).

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
- Don't resurrect the light-theme copper column (`#B57438`/`#5C3416`)
  or the nine pastel families — both retired by the phase6 rulings
  (gold-on-cream is the ONE light accent; the products' identities
  live in the promoted §0a2 tokens).
- Don't write world-true hexes as text or CTA fills — they are
  swatch/motif/edge furniture only.
