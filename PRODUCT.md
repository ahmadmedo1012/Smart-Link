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

## Surfaces (the 8 pages + the API)

| Route | Role |
|---|---|
| `/` | The Orbit-Ink landing — hero, products constellation, journey, progress stats, platforms, roles, FAQ, finale CTA |
| `/about` | Company story, values, founder (أحمد خيري), the 500+ active-clients stat |
| `/pricing` | The three free plans (Smart Menu / SmartBot / Smart Order) + coming-soon paid tiers (Smart Order's paid tiers live on its own platform) + FAQ |
| `/contact` | Contact cards + the lead-gen form (the site's one form) |
| `/privacy` · `/terms` | Legal (تواصل معنا contact sections) |
| `/offline` | SW-served offline page for the installed PWA |
| 404 | Display-art not-found |
| `/api/contact` | The form's backend: shared validation contract (`lib/contact-rules`), honeypot, rate limit, Resend email (owner notification + visitor confirmation), fail-loud 503/502 |

## Conversion paths (the site's whole job)

1. **Product signup:** hero/header/drawer/finale/pricing CTAs
   («ابدأ مجاناً», «ابدأ الآن», «ابدأ التجربة») → external links to
   menu.smart-link.ly / bot.smart-link.ly / order.smart-link.ly
   (`target=_blank`, `rel="noopener noreferrer"`, announced as
   «رابط خارجي»).
2. **Contact form:** «تواصل معنا» → `/contact` → validated Arabic form →
   `/api/contact` → owner notification + auto-confirmation email.
3. **WhatsApp direct:** every WhatsApp CTA deep-links
   `wa.me/218910089975` with a **per-surface prefilled Arabic opener**
   (`whatsappUrl(surface)` — footer · contact page · form error box ·
   offline page · confirmation email), so chats arrive source-identified.

Support identity: WhatsApp 24/7 (display `+218 91 008 9975`, one format,
`dir="ltr"` isolated) · office 9-to-9 · public email on the owned domain
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
- Free-tier positioning: all three products start free, no credit card
  (the Smart Menu/SmartBot paid tiers are coming-soon and must never be
  claimed as live; Smart Order's own paid tiers are live on its platform,
  never priced here).

## Voice

Warm, capable, Libyan-market Arabic — concrete and reassuring, never
corporate. The landing speaks in short chapter arcs («كلُّ عملٍ يبدأ
رابطًا»); CTAs are verbs («ابدأ مجاناً», «تواصل معنا»).

## Evidence

- Parity snapshot `tests/parity.mjs` (537 assertions) pins the design
  system; e2e suite (Playwright, Arabic specs) covers conversion CTAs,
  the contact contract, SEO/OG shape, a11y, RTL, PWA/offline and
  adversarial journeys. Lighthouse r14 history: avg 93.5, best LCP 1.67s.
