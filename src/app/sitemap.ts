import type { MetadataRoute } from "next"

/* App Router metadata route — replaces the static public/sitemap.xml.
   lastModified is stamped at build time, so every deploy refreshes it
   without manual file edits. */

const BASE = "https://smart-link.ly"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]
}
