import type { MetadataRoute } from "next"

/* App Router metadata route — replaces the static public/robots.txt. */

export default function robots(): MetadataRoute.Robots {
  return {
    /* r9 (SEO audit P3-11): /api/contact answers 405 to GET — crawling it
       is pure wasted budget, and POST-only endpoints have no public
       content to index. */
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://smart-link.ly/sitemap.xml",
  }
}
