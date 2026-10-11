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
   r144 (P4-4SL): the stamps moved to src/lib/content-dates.ts — the ONE
   source of truth the on-page «آخر تحديث» lines read too. The old split
   constants (sitemap said 2026-09-09 while the pages rendered «أكتوبر
   2026») contradicted each other since r138. */
import { ABOUT_UPDATED, CONTACT_UPDATED, LEGAL_UPDATED } from "@/lib/content-dates"

const LEGAL_LASTMOD = new Date(LEGAL_UPDATED.iso)
const ABOUT_LASTMOD = new Date(ABOUT_UPDATED.iso)
const CONTACT_LASTMOD = new Date(CONTACT_UPDATED.iso)

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: ABOUT_LASTMOD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: CONTACT_LASTMOD, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: LEGAL_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: LEGAL_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
  ]
}
