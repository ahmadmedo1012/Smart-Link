# SmartLink — سمارت لينك

> **سمارت لينك** — المظلة الرقمية للأعمال في ليبيا: موقع الوكالة وبوابة منظومة سمارت — الخدمات والأسعار والأسئلة الشائعة والتواصل، كلها خلف رابط واحد.

> 🌐 **English** · [العربية](./README.md)

[![CI](https://github.com/ahmadmedo1012/Smart-Link/actions/workflows/ci.yml/badge.svg)](https://github.com/ahmadmedo1012/Smart-Link/actions/workflows/ci.yml)
[![Live](https://img.shields.io/website?url=https%3A%2F%2Fsmart-link.ly%2F&label=smart-link.ly)](https://smart-link.ly)
[![License](https://img.shields.io/badge/license-proprietary-%23B57438)](./LICENSE)

**Live site:** <https://smart-link.ly> · **Support:** WhatsApp 24/7

![SmartLink landing page — night sky with glowing orbits and the headline “every business starts as a link and becomes a system”](docs/screenshots/hero-landing.webp)

## What is this?

**SmartLink is the digital umbrella for businesses in Libya** — the agency site and the ecosystem's front door in one:

- **The agency site**: introduces the services and showcases the ecosystem's current products — [Smart Menu](https://menu.smart-link.ly) (digital menu & WhatsApp ordering), [SmartBot](https://bot.smart-link.ly) (Messenger bot & automation for Facebook pages), and [Smart Order](https://order.smart-link.ly) (digital storefront, orders, delivery & local payments) — through a full landing journey from headline to final call-to-action.
- **The ecosystem's home**: the official starting point of the wider Smart family (Madarek) — see the [family footer](#-part-of-the-madarek-ecosystem--جزء-من-منظومة-مدارك) at the bottom of this page.
- **The conversion channel**: clear pricing plans, an FAQ, and a contact form that actually delivers — with 24/7 WhatsApp support.

The site is Arabic-first (fully RTL), ships a dark/light theme, and is built to be fast and accessible from the first request.

## Features

### Pages & sections

- **A full Orbit-Ink landing journey**: the orbit sky (a real **OrbitScene** canvas engine — living stars and orbits, not a static image), an RTL product marquee with a seamless 42s loop, a trust band with count-up stats (+500 active clients, +10K digital menus, +50K auto-replies, 99.9% uptime), product orbits, a five-station connection journey with a light path, the progress story, the platforms ground plate, roles, and a finale CTA.
- **Six inner pages**: About · Pricing · Contact · Privacy · Terms · an Offline page — plus custom 404/error pages.
- **Fully responsive** from 320px up to wide screens, with touch targets no smaller than 44px.

### Pricing plans

- Three plan cards — **Smart Menu**, **SmartBot** and **Smart Order** — on the free basic tier, each with its feature list, tabular-numeral prices, and direct start links.
- A “paid plans coming soon” badge for the upcoming upgrade path (Smart Order's paid tiers are already live in LYD on its own platform).

### FAQ

- An **accessible accordion** (full ARIA: keyboard open/close, `aria-expanded` state, uncropped answer text) on both the landing and pricing pages.
- **FAQPage** structured data (JSON-LD) for Google rich-results eligibility.

### Contact & conversion

- **A contact form that actually delivers**: dual validation (HTML then API), XSS escaping, a honeypot, and rate limiting — then delivery via Resend with two react-email templates (owner notification + sender confirmation).
- **Loud failure, never fake success**: without the sending key the API returns 503 with WhatsApp fallbacks — messages never disappear silently.
- Direct WhatsApp buttons (24/7 support) and magnetic gold links to the products.

### Language, theme & performance

- **Arabic/RTL-first**: a fully right-to-left interface, with correctly formatted phone numbers inside `dir="ltr"` (no bidi flip).
- **Dark/light theme**: a next-themes toggle that settles after load — no flash, full respect for `prefers-color-scheme` and `prefers-reduced-motion`.
- **PWA**: a dedicated Offline page + service worker + installable manifest.
- **Speed without compromise**: every page is a Server Component with interaction confined to small client islands, self-hosted fonts, and pure CSS motion — **no animation library at all**.

## Screenshots

<!-- r138 (fleet truth): the shots below pre-date r137 (before Smart Order
     became a first-class product) — the two pricing shots were re-captured
     on the r138 build; the hero shot is still r130's (its only change is
     the eyebrow line). -->

![Pricing page — the Smart Menu, SmartBot and Smart Order cards on the free basic plan](docs/screenshots/pricing-plans.png)

*The pricing page: the three product cards with per-plan features and direct start buttons.*

![The pricing-page FAQ — an accordion with one question expanded](docs/screenshots/pricing-faq.png)

*The FAQ accordion (one question open) and the site footer with its links and contact channels.*

> Full captions and sources in [docs/screenshots/CAPTIONS.md](docs/screenshots/CAPTIONS.md).

## Tech stack

- **Next.js 16** (App Router) — every page is a Server Component; interaction lives in small client islands only.
- **Tailwind CSS v4** via `@theme` — the **Madarek** design-token bridge in both modes: night/gold `#070B16`/`#E9B44C` and cream/copper `#FBFAF9`/`#B57438` (AA contrast), nine pastel families × {bg, ink, deep}, 6–28 radii and 80–720ms motion.
- **IBM Plex Sans Arabic** 400–700, self-hosted (`public/fonts/` — woff2 files for the Arabic sans ar+la and Latin mono) — zero external font requests.
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
| `npm run test:parity` | Madarek design-token parity snapshot (plain node — enforced in CI) |
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
├── components/        # Client islands (OrbitScene, form, accordion…) and server components
├── emails/            # react-email templates for notification & confirmation
└── lib/               # site.ts (the single source of truth for figures/links) + seo.ts + schema.ts
e2e/                  # E2E suite — 23 spec files (Playwright + axe-core)
tests/parity.mjs      # Madarek token parity snapshot (plain node)
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

An in-repo E2E suite — **23 spec files** under `e2e/`, run against a production build (`next start`) via Playwright + axe-core, alongside the **Madarek token parity snapshot** enforced in CI (counts grow every round — see [CHANGELOG.md](CHANGELOG.md)):

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

## 🛰️ Part of the Madarek Ecosystem — جزء من منظومة مدارك

> One design system across all projects · the Madarek identity: night/gold `#070B16`/`#E9B44C` dark — cream/copper `#FBFAF9`/`#B57438` light — IBM Plex Sans Arabic

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
