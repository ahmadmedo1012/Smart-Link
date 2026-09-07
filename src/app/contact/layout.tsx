import { pageMetadata } from "@/lib/seo"

/* Metadata for the client-component contact page (titles cannot be exported
   from "use client" files, so a segment layout carries them). Full OG shape
   via pageMetadata — see src/lib/seo.ts. */
export const metadata = pageMetadata({
  /* r10 (SEO audit P2): expanded toward the SERP window with the
     strongest contact keywords (واتساب، دعم فني). */
  title: "تواصل معنا — فريق SmartLink جاهز للمساعدة",
  description:
    "تواصل مع فريق SmartLink لأي استفسار أو دعم فني أو طلب خدمة: نموذج تواصل سريع أو واتساب مباشر على مدار الساعة — نردّ خلال ساعات العمل 9 صباحاً حتى 9 مساءً.",
  canonical: "/contact",
  ogDescription: "استفسارات ودعم فني وطلبات خدمات — واتساب مباشر أو نموذج البريد",
})

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://smart-link.ly" },
    { "@type": "ListItem", position: 2, name: "تواصل معنا", item: "https://smart-link.ly/contact" },
  ],
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  )
}
