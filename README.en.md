# SmartLink — سمارت لينك

> **سمارت لينك** — المظلة الرقمية للأعمال في ليبيا: موقع الوكالة وبوابة منظومة سمارت — الخدمات والأسعار والأسئلة الشائعة والتواصل، كلها خلف رابط واحد.

> 🌐 **English** · [العربية](./README.md)

[![CI](https://github.com/ahmadmedo1012/Smart-Link/actions/workflows/ci.yml/badge.svg)](https://github.com/ahmadmedo1012/Smart-Link/actions/workflows/ci.yml)
[![Live](https://img.shields.io/website?url=https%3A%2F%2Fsmart-link.ly%2F&label=smart-link.ly)](https://smart-link.ly)
[![License](https://img.shields.io/badge/license-proprietary-%238A6420)](./LICENSE)

**Live site:** <https://smart-link.ly> · **Support:** WhatsApp during office hours (9am–9pm)

![SmartLink landing page — the three-line Kufi headline lockup over the ascending metallic chain sculpture on KODE's near-black stage with white ink and safety orange (a W7-E capture on the current 2f3dd1b build)](docs/screenshots/hero-landing.webp)

*The hero shot on the current KODE build (W7-E, 2026-10-20): the three-line lockup «كلُّ عملٍ يبدأ رابطًا ويصبح منظومةً» and the metallic chain sculpture — the pixels are the deployed present; see [CAPTIONS.md](docs/screenshots/CAPTIONS.md).*

## What is this?

**SmartLink is the digital umbrella for businesses in Libya** — the agency site and the ecosystem's front door in one:

- **The agency site**: introduces the services and showcases the ecosystem's current products — [Smart Menu](https://menu.smart-link.ly) (digital menu & WhatsApp ordering), [SmartBot](https://bot.smart-link.ly) (Messenger bot & automation for Facebook pages), and [Smart Order](https://order.smart-link.ly) (digital storefront, orders, delivery & local payments) — through a full landing journey from headline to final call-to-action.
- **The ecosystem's home**: the official starting point of the wider Smart family (Madarek) — see the [family footer](#-part-of-the-madarek-ecosystem--جزء-من-منظومة-مدارك) at the bottom of this page.
- **The conversion channel**: clear pricing plans, an FAQ, and a contact form that actually delivers — with WhatsApp support during office hours.

The site is Arabic-first (fully RTL), ships a dark/light theme, and is built to be fast and accessible from the first request.

## Features

### Pages & sections

- **A full KODE landing journey (r160 «الرابط والمنظومة»)**: an ascending metallic chain sculpture on WebGL in the hero (the **ChainSculpture** engine — 7 interlocked links standing for link→system, drag-rotatable, re-reads its theme tokens on flip), a three-line Kufi type-block lockup in the display cut, flat orange flood chapters, mono status chrome, an RTL product marquee with a seamless 42s loop, the worlds chapter with true claims and live domain links, a light-path connection journey, the mission-control cockpit with verifiable published figures (3 live products, SmartBot from 19 LYD, Smart Order base plan free, 100% Arabic interface — r143 truth wave), the platforms ground, a finale CTA, then the FAQ.
- **Six inner pages**: About · Pricing · Contact · Privacy · Terms · an Offline page — plus custom 404/error pages.
- **Fully responsive** from 320px up to wide screens, with touch targets no smaller than 44px.

### Pricing plans

- Three plan cards — **Smart Menu**, **SmartBot** and **Smart Order** — on the free basic tier, each with its feature list, tabular-numeral prices, and direct start links.
- **The live ecosystem pricing**: the paid tiers are actually live in Libyan dinars on all three product platforms (from 19 LYD) — the pricing page mirrors each product's ladder and links straight to each platform's pricing page.

### FAQ

- An **accessible accordion** (full ARIA: keyboard open/close, `aria-expanded` state, uncropped answer text) on both the landing and pricing pages.
- **FAQPage** structured data (JSON-LD) for Google rich-results eligibility.

### Contact & conversion

- **A contact form that actually delivers**: dual validation (HTML then API), XSS escaping, a honeypot, and rate limiting — then delivery via Resend with two react-email templates (owner notification + sender confirmation).
- **Loud failure, never fake success**: without the sending key the API returns 503 with WhatsApp fallbacks — messages never disappear silently.
- Direct WhatsApp buttons (office hours) and magnetic gold links to the products.

### Language, theme & performance

- **Arabic/RTL-first**: a fully right-to-left interface, with correctly formatted phone numbers inside `dir="ltr"` (no bidi flip).
- **Dark/light theme**: a next-themes toggle that settles after load — no flash, full respect for `prefers-color-scheme` and `prefers-reduced-motion`.
- **PWA**: a dedicated Offline page + service worker + installable manifest.
- **Speed without compromise**: every page is a Server Component with interaction confined to small client islands, self-hosted fonts, and pure CSS motion — **no animation library at all**.

## Screenshots

<!-- W7-E (P21-W7, 2026-10-20): all three shots re-captured on the current
     KODE build (2f3dd1b) — the present is what the texts now describe;
     the Madarek era stays documented in CAPTIONS.md as history. -->

![Pricing page — the live plan ladders of the three products with their actual published prices in Libyan dinars on the KODE stage (a W7-E capture on the current 2f3dd1b build)](docs/screenshots/pricing-plans.png)

*The «باقات حيّة بالدينار الليبي» chapter — 0/19/29/129/299 LYD per product, read live from the database (W7-E, 2026-10-20): the pixels show exactly the prices being served.*

![The pricing-page FAQ — the accordion with its first question «هل الخدمة مجانية حقاً؟» open by default (a W7-E capture on the current 2f3dd1b build)](docs/screenshots/pricing-faq.png)

*The «أسئلة شائعة» accordion (W7-E, 2026-10-20): the first question open by default with the current P13-2a answer wording — «نعم، لكل منتج خطة مجانية حقيقية تُفعَّل فورًا».*

> Full captions and sources in [docs/screenshots/CAPTIONS.md](docs/screenshots/CAPTIONS.md).

## Tech stack

- **Next.js 16** (App Router) — every page is a Server Component; interaction lives in small client islands only.
- **Tailwind CSS v4** via `@theme` — the **KODE** design tokens in both modes (r160): ink `#050507` / paper `#F4F2ED` / safety orange `#FF4C00` (light text-grade `#B23E00`) — each product keeps its own visual world, with the accent wells on the pricing cards; radii 6–28 and motion 80–720ms.
- **Self-hosted fonts**: **IBM Plex Sans Arabic** 400–700 for body and UI (`public/fonts/` — woff2 files for the Arabic sans ar+la and Latin mono) plus the display pair **Bodoni Moda 700** (Latin) and **Noto Kufi Arabic 700/800** (the hero lockup and headings) via next/font — zero external font requests.
- **TypeScript** strict (checked at build time).
- **Resend + react-email** for transactional email, **next-themes** for theming, **Playwright + axe-core** for testing.
- **Pure CSS motion** — `animation-timeline`/keyframes guarded by `prefers-reduced-motion`; no framer-motion, no animation library.

## Getting started

Requirements: **Node 22+** and **npm 11**.

```bash
npm install
cp .env.example .env.local   # optional in development (see table)
npm run dev                  # http://localhost:3000
```

| Variable | Needed for | Description |
|---|---|---|
| `RESEND_API_KEY` | real email delivery | A [Resend](https://resend.com/api-keys) key — without it the contact API fails LOUD with 503 and never reports a fake success |

For the full test suite (against a production build):

```bash
npx playwright install chromium   # once
npm run build && npm run test:e2e
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs the TypeScript check automatically) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint — zero errors required |
| `npm run test:parity` | KODE design-token parity snapshot (plain node — enforced in CI) |
| `npm run test:e2e` | Full suite: build ← `next start` ← Playwright + axe-core |
| `npm run test:live:sim` | Simulation against the live smart-link.ly (separate Playwright config) |

## Repository structure

```
src/
├── app/               # Pages + API routes (App Router)
│   ├── page.tsx         # The landing — the full journey (server component)
│   ├── about/ pricing/ contact/ privacy/ terms/ offline/
│   ├── api/contact/     # POST — validation + honeypot + rate limit + Resend
│   ├── sitemap.ts robots.ts   # dynamic (lastmod on every deploy)
│   ├── error.tsx global-error.tsx not-found.tsx
│   └── layout.tsx       # Fonts + JSON-LD + root metadata
├── components/        # Client islands (ChainSculpture, form, accordion…) and server components
├── emails/            # react-email templates for notification & confirmation
└── lib/               # site.ts (the single source of truth for figures/links) + seo.ts + schema.ts
e2e/                  # E2E suite — 25 spec files (Playwright + axe-core)
tests/parity.mjs      # KODE token parity snapshot (plain node)
docs/                 # Reports + screenshots
public/               # Self-hosted fonts + icons + sw.js + manifest
.github/workflows/ci.yml   # CI: lint ← parity ← build ← e2e on every push to main
```

## Security & quality (built into the build)

- Full security headers in `next.config.ts`: HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy — verified live by the test suite.
- Input validation + XSS escaping + honeypot + rate limiting on the contact route.
- `npm audit`: zero production-dependency vulnerabilities.
- Lighthouse: a11y/best-practices/SEO = 100 on every page — measurements documented in [docs/lighthouse-baseline.md](docs/lighthouse-baseline.md).
- Full SEO: per-page metadata, canonical and og/twitter cards, structured JSON-LD data (Organization / WebSite / FAQPage / BreadcrumbList), dynamic sitemap and robots.

## Testing

An in-repo E2E suite — **25 spec files** under `e2e/`, run against a production build (`next start`) via Playwright + axe-core, alongside the **KODE token parity snapshot** enforced in CI (counts grow every round — see [CHANGELOG.md](CHANGELOG.md)):

- **Smoke**: pages + 404 (200/RTL/h1/title/zero console errors) and the stat counters.
- **Behavior**: mobile menu, dropdown, theme toggle, back-to-top, touch & devices (320px and up).
- **SEO & structured data**: canonical, og/twitter, robots, sitemap, manifest, and the real JSON-LD content from the DOM.
- **Security**: every header alive + immutable asset caching + no X-Powered-By.
- **Accordion & form**: open/close + aria + uncropped answers; the full API contract (400/honeypot/503/429) and the error path with WhatsApp fallbacks.
- **axe-core**: zero WCAG 2 AA violations in both dark and light themes — scans run with `prefers-reduced-motion` for flake-free results, while any real contrast violation stays visible.

## Documentation

- [CHANGELOG.md](CHANGELOG.md) — a summary per wave of changes (updated every round)
- [SECURITY.md](SECURITY.md) — supported scope and vulnerability-reporting channels
- [CONTRIBUTING.md](CONTRIBUTING.md) — quality gates, commit conventions, and how to contribute
- [docs/smartlink-final-report.md](docs/smartlink-final-report.md) — the master report of every improvement round
- [docs/projects-comparison.md](docs/projects-comparison.md) — the head-to-head comparison across the ecosystem's products
- [docs/lighthouse-baseline.md](docs/lighthouse-baseline.md) — the performance baseline across rounds
- [docs/screenshots/CAPTIONS.md](docs/screenshots/CAPTIONS.md) — screenshot captions and sources
- `CLAUDE.md` — architecture rules for any AI assistant working on the repo

## Deployment

Automatic via the GitHub → Vercel integration (project `smartlink`). Every push to `main` deploys and refreshes the sitemap lastmod — and post-deploy verification is part of the culture: no item closes without live evidence from the production URL.

---

## 🛰️ Part of the Smart family — جزء من عائلة سمارت

<!-- P13-2a: historically «the Madarek Ecosystem» — Madarek stays a family row
     (the original m15 token bridge), but this site's identity since r160 is
     KODE (ink/paper/safety orange), not the Madarek night/gold identity. -->

> The Smart project family under one umbrella · this site's identity since r160: KODE — ink `#050507` / paper `#F4F2ED` / safety orange `#FF4C00` (fonts: Noto Kufi Arabic + Bodoni Moda + IBM Plex Sans Arabic) · Madarek = the historical reference for the m15 token bridge

| Project | Role | GitHub | Live |
|---|---|---|---|
| 🎓 **Madarek / مدارك** | Smart-learning platform for University of Zawia — the design-system reference | [github.com/ahmadmedo1012/madarek](https://github.com/ahmadmedo1012/madarek) | [madarek.onrender.com](https://madarek.onrender.com) |
| 🔗 **Smart-Link / سمارت لينك** | Digital umbrella for Libyan businesses | [github.com/ahmadmedo1012/Smart-Link](https://github.com/ahmadmedo1012/Smart-Link) | [smart-link.ly](https://smart-link.ly) |
| 🍽️ **Smart Menu / سمارت منيو** | Digital menu & WhatsApp ordering for restaurants | [github.com/ahmadmedo1012/Smart-Menu](https://github.com/ahmadmedo1012/Smart-Menu) | [menu.smart-link.ly](https://menu.smart-link.ly) |
| 🤖 **SmartBot / سمارت بوت** | Messenger bot & automation for Facebook pages | [github.com/ahmadmedo1012/SmartBot](https://github.com/ahmadmedo1012/SmartBot) | [bot.smart-link.ly](https://bot.smart-link.ly) |
| 🛍️ **Smart Order / سمارت أوردر** | Digital storefront, orders & delivery for businesses | [github.com/ahmadmedo1012/Smart-Order](https://github.com/ahmadmedo1012/Smart-Order) | [order.smart-link.ly](https://order.smart-link.ly) |

## License

This project is **proprietary software** — all rights reserved © 2026 Ahmad Medo (ahmadmedo1012). Viewing or cloning this repository grants no right to use, copy, modify, publish, or redistribute it without prior written permission from the copyright holder.

The full legal text is in [LICENSE](./LICENSE) — for licensing inquiries: [ahmadmedo1012@gmail.com](mailto:ahmadmedo1012@gmail.com).
