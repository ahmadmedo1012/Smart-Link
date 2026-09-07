import type { MetadataRoute } from "next"

/* App Router metadata route — replaces the static public/sitemap.xml.
   lastModified is stamped at build time, so every deploy refreshes it
   without manual file edits. */

const BASE = "https://smart-link.ly"

/* r9 (SEO audit P3-10): build-time lastmod for every deploy told Google
   that legal pages changed on EVERY release — even when their content
   was untouched (both pages state "آخر تحديث: يوليو 2026" in their
   bodies). They now carry their real content date; Google documents
   that inflated lastmod values erode trust in the signal. */
const LEGAL_LASTMOD = new Date("2026-07-01")

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: LEGAL_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: LEGAL_LASTMOD, changeFrequency: "yearly", priority: 0.3 },
  ]
}
