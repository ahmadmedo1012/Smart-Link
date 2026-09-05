# SmartLink

Next.js 15 App Router, RTL Arabic, Tailwind CSS v4, framer-motion.

## Key points
- RTL (`dir="rtl"`), Cairo (body) + **Readex Pro first for headings** (`--font-heading`), both via `next/font/google` with CSS variables
- Brand primary `oklch(0.55 0.19 45)` — **byte-identical to Smart-Menu & SmartBot** (light mode: `oklch(0.40 0.19 45)` dual-lightness for AA)
- `--accent` = `oklch(0.55 0.19 45 / 0.15)` dark, `/ 0.12` light (Smart-Menu parity)
- Dark/light theme via next-themes
- All components are `"use client"` with framer-motion animations
- Pages: `/`, `/about`, `/contact`, `/pricing`, `/privacy`, `/terms`
- API: `POST /api/contact` — sends real email via Resend (notification + auto-reply), logs fail-open only when `RESEND_API_KEY` missing
- Shared motion language in `src/lib/motion.ts` (copied from Smart-Menu/SmartBot — springs 120/200/300, easeOutQuart `[0.165, 0.84, 0.44, 1]`)
- Icons from lucide-react
- No database — email only (Resend, free tier)
