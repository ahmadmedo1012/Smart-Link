import type { MetadataRoute } from "next"

/* App Router metadata route — replaces the static public/robots.txt. */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://smart-link.ly/sitemap.xml",
  }
}
