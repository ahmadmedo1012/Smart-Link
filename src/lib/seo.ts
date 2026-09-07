import type { Metadata } from "next"
import { SITE } from "@/lib/site"

/* r10 (code audit): the local `const SITE = "https://…"` shadowed the
   real SITE object from lib/site.ts — two sources of the same truth. */

/* Shared OG image descriptor — the root layout imports the same object
   (r10: it used to keep an identical copy of these five fields), so
   subpages resolve to the exact same absolute URL (one cache entry per
   crawler) and changing the image is a one-line edit. */
export const OG_IMAGE = {
  url: "/og-smartlink.jpg",
  width: 1200,
  height: 630,
  alt: "SmartLink — منصة رقمية متكاملة: المنيو الرقمي والبوت الذكي",
  type: "image/jpeg",
} as const

/**
 * Complete per-page metadata with a FULL openGraph/twitter shape.
 *
 * WHY THIS EXISTS (r6): Next.js merges metadata objects shallowly — a
 * page-level `openGraph` key REPLACES the root's whole object instead of
 * deep-merging. Pages that only set og:title/description/url therefore
 * silently dropped og:image, og:site_name and og:locale: sharing
 * /about, /pricing, /contact, /privacy or /terms on Facebook/WhatsApp
 * rendered a link card with NO preview image (verified live pre-r6).
 * Every page now stamps the complete shape via this single helper, so
 * a new page can never regress back to a preview-less share card.
 */
export function pageMetadata(opts: {
  title: string
  description: string
  canonical: string
  ogDescription?: string
}): Metadata {
  const ogTitle = `${opts.title} | SmartLink`
  const ogDesc = opts.ogDescription ?? opts.description
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.canonical },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE.url}${opts.canonical}`,
      siteName: "SmartLink",
      locale: "ar_AR" /* r9: ar_AR is the only Arabic locale Facebook recognizes */,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: ["/og-smartlink.jpg"],
    },
  }
}
