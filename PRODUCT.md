# PRODUCT.md — SmartLink (الربط الذكي)

> Context file for design/UX work (the family convention — Smart-Menu and
> Smart-Order carry the twin). Product truths only, as shipped in code; no
> invented data. Update when the product changes.

## What this is

The digital umbrella for Libyan businesses — the marketing/landing site of
the Smart family and its front door: one Arabic-first RTL site that
introduces the family's products, tells the company story, and converts
visitors into leads. Smart-Link itself ships no dashboard; the products
live on their own subdomains and the umbrella routes to them.

**Live URL:** https://smart-link.ly · Products behind it: Smart Menu →
https://menu.smart-link.ly (the digital menu for restaurants), SmartBot →
https://bot.smart-link.ly (the Facebook-page automation bot), and Smart
Order → https://order.smart-link.ly (the digital storefront with orders,
delivery and local payments — a first-class product since r137).

## Audience

- **Primary:** Libyan (and Arabic-market) small-business owners deciding
  to digitalize — restaurant/café owners (Smart Menu), Facebook page
  owners (SmartBot), and storefront businesses selling with delivery
  (Smart Order). Arabic-first, phone-first, often on mid-range
  Android devices over variable networks.
- **Secondary:** anyone evaluating the company (partners, press) via the
  about/pricing/legal pages.

## Surfaces (the 11 pages + the API)

| Route | Role |
|---|---|
| `/` | The KODE landing (r160 «سلسلة») — 3-line Kufi hero lockup + the chain sculpture (drag-rotatable three.js canvas, RM poster frame), broadcast marquee, worlds chapter (3 editorial type-cards), the «أي عالم يناسب عملك؟» finder + honest comparison matrix (P45-W1), journey flood (5 type-rows), sentence band, cockpit (honest published stats), platforms console, finale CTA, native `<details>` FAQ |
| `/menu` · `/bot` · `/order` | The hub product landing pages (P45-W1) — per-product ecosystem framing (hub-unique POV, zero sibling mirroring), the pain→solution chapter rendered verbatim from the worlds registry, the honest free-limits card + the live paid ladder via `formatLyd` + link-out, a 3-4 item catalog-verifiable FAQ, dual CTAs (signupUrl primary + the live product root), and the ecosystem cross-links (siblings + `/pricing#ecosystem` + `/#finder`) |
| `/about` | Company story, values, founder (أحمد خيري), the 3-live-products stat (r143 honest figure) |
| `/pricing` | The three free plan cards (Smart Menu / SmartBot / Smart Order) + the live ecosystem pricing chapter (each product's paid ladder in LYD from 19 د.ل, mirroring the product's own pricing page) + FAQ |
| `/contact` | Contact cards + the lead-gen form (the site's one form) |
| `/privacy` · `/terms` | Legal (تواصل معنا contact sections) |
| `/offline` | SW-served offline page for the installed PWA |
| 404 | Display-art not-found |
| `/api/contact` | The form's backend: shared validation contract (`lib/contact-rules`), honeypot, rate limit, Resend email (owner notification + visitor confirmation), fail-loud 503/502 |

## Conversion paths (the site's whole job)

1. **Product signup:** hero/header/drawer/finale/pricing CTAs
   («ابدأ مجاناً», «ابدأ الآن», «ابدأ التجربة») → external links to each
   product's OWN signup page — menu.smart-link.ly/subscribe ·
   bot.smart-link.ly/subscribe · order.smart-link.ly/register
   (`SITE.products.*.signupUrl`, P40-5a — the same path each product's own
   primary button uses; the hub CTAs used to stop at the landing roots and
   lose the signup step). `target=_blank`, `rel="noopener noreferrer"`,
   announced as «رابط خارجي»; the hero primary names its destination
   visibly («ابدأ مجاناً — سمارت منيو») and the hero micro-row carries
   the two other products' signup paths with intent labels. Discovery
   surfaces (P45-W1: the services menus · the landing footer ecosystem
   column · the worlds cards' «اعرف المزيد») route to the hub product
   pages `/menu` `/bot` `/order` — the hub's own discovery layer — while
   the worlds cards' PRIMARY verb + the inner footer's services column
   keep the product ROOTS (browsing straight into the live products);
   the pricing ecosystem tables link `{product}/pricing`.
2. **Contact form:** «تواصل معنا» → `/contact` → validated Arabic form →
   `/api/contact` → owner notification + auto-confirmation email.
3. **WhatsApp direct:** every WhatsApp CTA deep-links
   `wa.me/218910089975` with a **per-surface prefilled Arabic opener**
   (`whatsappUrl(surface)` — footer · hero bullet · header cluster +
   drawer (P40-5a, persistent secondary) · contact page · form error
   box · offline page · confirmation email), so chats arrive
   source-identified; the header framing carries the honest r144 hours
   («خلال أوقات العمل» — never 24/7).

Support identity: WhatsApp (display `+218 91 008 9975`, one format,
`dir="ltr"` isolated) answered by the office-hours team 9-to-9 — no 24/7
rota exists (r144 honesty ruling; the bot's *automation* alone runs
around the clock) · public email on the owned domain
(noreply@smart-link.ly; the private notification inbox lives only in
`SITE.ownerEmail`, never rendered).

## Durable constraints

- Arabic RTL-first; فصحى copy; Western digits; no dialect.
- Honest claims only — the stats on /about and the landing are the real
  numbers (no invented figures or testimonials).
- The three product subdomains are the family's — links stay external and
  never iframed/mirrored.
- The lead path must never fail silently: server errors surface loudly
  (fail-loud 503/502) with WhatsApp/email fallbacks in the error box.
- Free-tier positioning: all three products start free, no credit card.
  The paid ladders are LIVE on each product's own platform in Libyan
  dinars (from 19 د.ل — bot `/api/plans`, menu `/pricing`, order
  `/api/plans`; P13-2a verified). This site mirrors those ladders and
  links out — it never prices a plan of its own (the hub sells the free
  tier only).

## Voice

Warm, capable, Libyan-market Arabic — concrete and reassuring, never
corporate. The landing speaks in short chapter arcs («كلُّ عملٍ يبدأ
رابطًا»); CTAs are verbs («ابدأ مجاناً», «تواصل معنا»).

## Evidence

- Parity snapshot `tests/parity.mjs` (607 assertions, self-counted — the suite fails if its own size drifts; P45-W1: 604 → 607 — the product-landing wave) pins the design
  system (P40-5a: 585 → 595 — the CTA-routing pins incl. the signupUrl
  registry and the plan-ladder mirrors); e2e suite (Playwright, Arabic
  specs) covers conversion CTAs,
  the contact contract, SEO/OG shape, a11y, RTL, PWA/offline and
  adversarial journeys. Lighthouse r14 history: avg 93.5, best LCP 1.67s.
