import { SITE } from "@/lib/site"

/* r9 (SEO audit P2-2/P2-3): JSON-LD entities, extracted from the inline
   layout blobs and upgraded:

   1. LocalBusiness — the agency serves a Libyan market over WhatsApp
      (+218), yet had zero local-presence signals. Added: address (LY),
      telephone, openingHoursSpecification (Mo–Su 09:00–21:00, the honest
      office hours from the content fix C1) and areaServed.
      DELIBERATELY ABSENT: AggregateRating — Google's structured-data
      policy forbids self-serving ratings with no visible on-page
      reviews; adding it now invites a manual action. Revisit only when
      real reviews are displayed on the site.

   2. @id graph links — Organization, WebSite and the two Services were
      disconnected islands; Google resolved them heuristically by URL.
      Every entity now carries a stable #fragment @id and references
      the Organization by id (publisher / provider), the explicit
      schema.org "linking entities" best practice.

   3. Service ×2 — Smart Menu and SmartBot modeled as services with a
      provider reference and a free Offer (price "0"), matching the
      pricing page's "مجاني" claims. */

const ORG_ID = `${SITE.url}/#organization`
const WEBSITE_ID = `${SITE.url}/#website`

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORG_ID,
    name: "SmartLink",
    alternateName: "سمارت لينك",
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/logo.png`,
      width: 600,
      height: 409,
    },
    description:
      "منصة رقمية ليبية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي للمطاعم والبوت الذكي لفيسبوك.",
    foundingDate: "2025-11-20",
    founder: { "@type": "Person", name: "أحمد خيري" },
    telephone: `+${SITE.whatsapp.number}`,
    address: { "@type": "PostalAddress", addressCountry: "LY" },
    areaServed: { "@type": "Country", name: "ليبيا" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS,
        opens: SITE.hours.schemaOpens,
        closes: SITE.hours.schemaCloses,
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      /* r6: was "ahmad..." — every other surface (API owner inbox,
         footer, contact page, terms/privacy, the plan doc) uses
         "ahmed..." and the GitHub login is ahmadmedo1012 — one
         transposed letter was shipping to crawlers via JSON-LD. */
      email: SITE.email,
      telephone: `+${SITE.whatsapp.number}`,
      contactType: "customer service",
      availableLanguage: ["ar", "en"],
    },
    sameAs: [SITE.social.facebook, SITE.social.instagram],
    /* r10 (SEO audit P2): LocalBusiness completeness per Google's local
       business docs — priceRange (everything is free at launch → "$") and
       an image. sameAs now points at the REAL identity profiles (the
       Facebook/Instagram accounts already in SITE.social) instead of a
       wa.me link and the product domains — the products are already
       modeled by subOrganization + Service, and Google documents sameAs
       as the place to link a entity to its official profiles. */
    priceRange: "$",
    image: {
      "@type": "ImageObject",
      url: `${SITE.url}/og-smartlink.jpg`,
      width: 1200,
      height: 630,
    },
    subOrganization: [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#smart-menu-org`,
        name: SITE.products.menu.short,
        url: SITE.products.menu.url,
        description: "المنيو الرقمي التفاعلي للمطاعم مع طلبات واتساب",
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#smartbot-org`,
        name: SITE.products.bot.short,
        url: SITE.products.bot.url,
        description: "البوت الذكي لأتمتة الردود على صفحات فيسبوك",
      },
    ],
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "SmartLink",
    url: SITE.url,
    inLanguage: "ar",
    publisher: { "@id": ORG_ID },
  }
}

export function servicesJsonLd() {
  const service = (opts: {
    id: string
    name: string
    url: string
    description: string
  }) => ({
    "@type": "Service",
    "@id": opts.id,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "ليبيا" },
    availableLanguage: { "@type": "Language", name: "ar" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "LYD",
      description: "خطة مجانية بالكامل عند الإطلاق",
    },
  })

  return {
    "@context": "https://schema.org",
    "@graph": [
      service({
        id: `${SITE.url}/#service-smart-menu`,
        name: SITE.products.menu.short,
        url: SITE.products.menu.url,
        description: "المنيو الرقمي التفاعلي للمطاعم مع طلبات واتساب ولوحة تحكم عربية كاملة",
      }),
      service({
        id: `${SITE.url}/#service-smartbot`,
        name: SITE.products.bot.short,
        url: SITE.products.bot.url,
        description: "البوت الذكي لأتمتة الردود على صفحات فيسبوك على مدار الساعة",
      }),
    ],
  }
}
