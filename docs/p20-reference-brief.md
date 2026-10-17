# P20-A1 — Reference Brief: KODE Immersive (kodeimmersive.com)

Evidence fetched live 2026-10-17 (Firecrawl keyless):
- `scrape https://kodeimmersive.com/` → thin markdown (JS-driven site) but the
  content skeleton survives: `[Enter]`, `[001]`, `Menu`, `Sound On/Off`,
  `Contact`, `Scroll for more [AR]`, the manifesto sentences, `Our services —
  00123 Ideate … Prev/Next`, the word-spliced display paragraphs
  ("Withthehelpoftechnology…"), the London address block.
- `scrape https://www.awwwards.com/sites/kode-immersive` → SOTD May 13 2025,
  score 7.62; credited Malvah + Francesco Michelini (WebGL) + KODE. Element
  reels: Mobile / Preloader / CTA / …
- `scrape https://www.awwwards.com/case-study-kode-immersive.html` → the full
  Malvah case study (the richest source).
- `search "Kode Immersive website awwwards design typography"` + `search
  "immersive narrative web design scroll storytelling techniques"` → Utsubo
  2026 guide (scroll-driven narrative, storyboard-not-wireframe, emotional
  pacing, interactive moments).

## Observed principles (from the case study + live scrape)

1. **Typography is the differentiator.** Brut by Off-Type — "an unconventional
   mono-inspired form … structure and tension." One display face carries the
   whole identity; scale contrast (poster vs mono micro-label) does the work.
2. **Color hierarchy flipped, discipline held.** Parent brand's orange became
   DOMINANT with "bold black moments" — a ~3-hue economy (paper/ink/orange) at
   poster scale. Familiar, yet distinctive.
3. **One modular mark.** The chevron mark became the iconography system, the
   hero anchor, and the interaction language — one shape, reused everywhere.
4. **Craft = the unifying noise layer.** "The high-fidelity 3D was clashing
   with the flat backgrounds. The fix? A subtle layer of pixel distortion and
   soft noise texture. Minimal, but transformative."
5. **Continuous scroll narrative** — "a careful dance between interactivity,
   emotion, and information": bold object → quiet proof → services → contact,
   one canvas, no hard section borders.
6. **Restraint.** "No case studies. No visual identity. Just a bold vision."
   Few sections, each fully committed. SFX follows the 80/20 rule — "just the
   right amount to amplify emotion without overwhelming."
7. **Performance under the hood:** BatchedMesh (40–50 draw calls → 1),
   OffscreenCanvas + WebWorker for the heavy canvases — the craft never taxes
   the device.
8. **Micro-disruption with purpose:** the menu grows from the base and becomes
   the footer; text splits and shifts with the cursor — mechanics chosen to
   serve the metaphor (deconstruction/reformation), never decoration.
9. **Storytelling anatomy (Utsubo, corroborating):** storyboard not wireframe;
   emotional pacing (drama → pause → payoff); interactive moments where the
   object invites drag/rotation; sound amplifies transitions.

## What transfers to smart-link.ly (already largely built — P12-2a r160)

- 3-line Kufi type-block hero + chain sculpture in the negative-space diamond
  (the chevron-anchor equivalent) ✓ already live.
- Orange-flood chapters + black chapter stages + mono status chrome ✓ live.
- Film-grain noise layer unifying canvas + flat backgrounds ✓ live (the
  `ln-grain` veil — the case study's "transformative" trick).
- Chapter labels `001 — العوالم` etc. ✓ live (KODE's `[001]` grammar).
- Restraint: no new sections, no new colors, no new features in P20-A1.

### Concrete refinement opportunities (this wave's scope)
- **Type-block integrity:** the 3-line lockup must stay 3 lines at EVERY
  viewport — at 390–1000px it currently collapses into 5–6 ragged lines with
  a mid-word orphan (`أ` alone). KODE's poster lockup never ragged-wraps.
- **Leading craft:** 0.92 line-height collides Noto Kufi ink at display scale
  (measured: 1px clearance between `ع`'s descender and `ر`'s bowl at 1440).
  KODE's Brut lockup runs tight-but-clean; the Arabic script needs ~0.97.
- **Chapter-transition rhythm:** consistent breathing between the flood
  chapters and the dark stages (measured pad-block variance is deliberate;
  keep, but verify seams stay hairline-clean).

## What must NOT be copied (and why)
- **Full-page WebGL physics hero + Rapier physics + OffscreenCanvas:** out of
  budget for a marketing page that must pass CLS/LCP gates on 3.9GB-RAM CI
  runners; the chain sculpture already carries the 3D register at a fraction
  of the cost.
- **Sound design (SFX) and the sound toggle:** autoplay/audio adds no
  measurable value for an Arabic business audience on mobile data; also a
  new feature (out of P20 scope).
- **Cursor-drawing easter egg + shifting text:** cursor mechanics assume
  pointer-precision and Latin word shapes; Arabic ligatures + RTL + touch
  targets make the deconstructed-text mechanic an a11y and legibility hazard.
- **Preloader gate:** a forced preloader would delay LCP on the marketing
  page (the e2e lcp-guard pins h1-before-JS paint; KODE can afford it as an
  award-site, a conversion page cannot).
- **The `Withthehelpoftechnology` word-splicing:** typographic play on Latin
  word boundaries; Arabic kashida/joining makes the equivalent read as
  broken text to native readers.
- **Menu-becomes-footer transform:** a structural rebuild of the landing
  header/footer contract that 44px-floor and drawer-breakpoint e2e specs pin.

## Implementation deltas chosen for P20-A1 (evidence-linked)
1. `--ln-h1-lh` 0.92 → 0.97 + the short-stage budget divisor 2.76 → 2.91
   (keeps the CTA-pair in-fold math true at 1440×900).
2. Lockup nowrap + `min-inline-size: 0` grammar extended below 1025px with a
   viewport-fit scale `min(var(--ln-h1), 12.6vw)` — the desktop full-bleed
   lockup behavior, made safe at 390/320.
3. No new features, no palette changes, no threshold changes.
