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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
