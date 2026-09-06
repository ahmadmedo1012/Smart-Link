import type { Metadata } from "next"

/* Metadata for the client-component contact page (titles cannot be exported
   from "use client" files, so a segment layout carries them). */
export const metadata: Metadata = {
  title: "تواصل معنا",
  description:
    "تواصل مع فريق SmartLink — استفسارات، دعم فني، أو طلب خدمة جديدة. واتساب مباشر أو نموذج التواصل ونترد خلال ساعات.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "تواصل معنا | SmartLink",
    description: "استفسارات ودعم فني وطلبات خدمات — واتساب مباشر أو نموذج البريد",
    url: "/contact",
  },
}

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
