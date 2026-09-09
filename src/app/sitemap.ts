import type { MetadataRoute } from "next"

/* App Router metadata route — replaces the static public/sitemap.xml.
   lastModified is stamped at build time, so every deploy refreshes it
   without manual file edits. */

import { SITE } from "@/lib/site"

const BASE = SITE.url

/* r9 (SEO audit P3-10): build-time lastmod for every deploy told Google
   that legal pages changed on EVERY release — even when their content
   was untouched. They now carry their real content date; Google documents
   that inflated lastmod values erode trust in the signal.
   r10 (SEO audit P3): about/contact joined them — nearly-static content
   stamped "today" on every deploy erodes the same trust.
   r13 (content audit P1): the legal pages really DID change in September
   (r10 added data categories, r11 added the processors clause, r13 added
   the WhatsApp/Meta processor + retention distinction) — the July stamp
   had become a false statement, live-verified by r13-G. */
const LEGAL_LASTMOD = new Date("2026-09-09")
const STATIC_LASTMOD = new Date("2026-09-07")

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: STATIC_LASTMOD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: STATIC_LASTMOD, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: LEGAL_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: LEGAL_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
  ]
}
