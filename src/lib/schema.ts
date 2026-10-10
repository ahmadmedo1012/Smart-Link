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

   3. Service (r138: ×3 — Smart Menu, SmartBot and, since r137,
      Smart Order) modeled as services with a provider reference and a
      free Offer (price "0"), matching the pricing page's "مجاني"
      claims. */

const ORG_ID = `${SITE.url}/#organization`
const WEBSITE_ID = `${SITE.url}/#website`

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

/* r10 (code audit — DRY): BreadcrumbList was copy-pasted in five pages
   (8 identical lines each, only the two names differ) and the FAQPage
   builder in two (home + pricing, same map). One helper each; the URLs
   come from the single SITE source, so a domain change is one edit. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

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
    /* r138 (إكمال صدق الأسطول — موجة r137 الفائتة): الوصف كان يعدّ
       منتجين بينما الكائن نفسه يسرد ثلاث منظمات فرعية وثلاث خدمات —
       صياغة الثلاثة أسفلًا. */
    description:
      "منصة رقمية ليبية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي للمطاعم، والبوت الذكي لفيسبوك، ومتجر الطلبات الرقمي.",
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
        /* r137 (ليبي أولاً): المنطقة الزمنية صراحةً — دونها يفسّر
           Google الساعات بتوقيت الزائر/الزاحف لا بتوقيت طرابلس
           (Africa/Tripoli، UTC+2 بلا توقيت صيفي). */
        timeZone: "Africa/Tripoli",
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
      /* r137 (صدق الأسطول): Smart-Order حيّ على order.smart-link.ly —
         كان غائباً عن بيانات JSON-LD بينما المنتج يعمل فعلاً. */
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#smart-order-org`,
        name: SITE.products.order.short,
        url: SITE.products.order.url,
        description: "متجر الطلبات الرقمي للأعمال مع توصيل ومدفوعات ليبية",
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
  /* r138 (صدق الأسطول — إتمام): وصف العرض الافتراضي «عند الإطلاق»
     صادق لـ Menu/Bot (المجاني منذ الإطلاق والمدفوع «قريباً»)؛ أما
     Smart-Order فباقته الأساسية حيّة «مجانية للأبد» وباقاته المدفوعة
     تعمل فعلاً بالدينار على منصّته — فوصفه المتخصص يطابق صفحة
     الأسعار نفسها (r137: «مجاني» هنا صدق لا تسويق). */
  const service = (opts: {
    id: string
    name: string
    url: string
    description: string
    offerDescription?: string
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
      description: opts.offerDescription ?? "خطة مجانية بالكامل عند الإطلاق",
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
      /* r137: العرض المجاني لـ Smart-Order صادق — باقته الأساسية
         «مجانية للأبد» (order.smart-link.ly/pricing). */
      service({
        id: `${SITE.url}/#service-smart-order`,
        name: SITE.products.order.short,
        url: SITE.products.order.url,
        description:
          "متجر الطلبات الرقمي للأعمال: واجهة جاهزة للمسح بـ QR، محرّك طلبات، توصيل بمناطق ورسوم، ومدفوعات ليبية",
        /* r138: «عند الإطلاق» الافتراضية كذبٌ صغير هنا — باقته حيّة
           للأبد ومدفوعاته تعمل الآن؛ الصدق يسبق صياغة القالب. */
        offerDescription: "الخطة الأساسية مجانية للأبد — باقات مدفوعة بالدينار الليبي على منصّته",
      }),
    ],
  }
}
