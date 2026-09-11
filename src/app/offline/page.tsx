import type { Metadata } from "next"
import { WifiOff } from "lucide-react"
import { SITE } from "@/lib/site"

/* r14 (M7): صفحة أداة لا محتوى — تُخدَم من كاش الـSW عند انقطاع الشبكة
   للتطبيق المثبت (WebAPK/iOS home-screen). سابقة 404 متبعة عن قصد:
   صفحات الأدوات لا تدخل PAGES في fixtures (حلقات seo/axe لا تنطبق
   عقودها هنا) بل تحصل على spec مخصص (e2e/offline.spec.ts) — الغطاء
   أوفى من إدخال PAGES. sitemap يعدّد يدوياً فلن تدخل تلقائياً. */
export const metadata: Metadata = {
  title: "لا يوجد اتصال بالإنترنت",
  description: "يبدو أن الشبكة مقطوعة حالياً — تواصل مع فريق SmartLink عبر واتساب مباشرة.",
  robots: { index: false, follow: false },
  /* نفس عقل 404 (r10): لا canonical موروث لصفحة noindex، وبطاقة OG
     مستقلة حتى لا يرث رابط الأداة بطاقة الرئيسية. */
  alternates: {},
  openGraph: {
    title: "لا يوجد اتصال بالإنترنت",
    description: "تواصل مع فريق SmartLink عبر واتساب مباشرة.",
  },
  twitter: null,
}

export default function OfflinePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
      <WifiOff className="w-14 h-14 text-primary mb-6" aria-hidden="true" />
      <h1 className="font-[family-name:var(--font-readex-pro)] text-3xl font-bold text-foreground mb-3">
        لا يوجد اتصال بالإنترنت
      </h1>
      <p className="text-muted-foreground leading-relaxed max-w-md mb-8">
        يبدو أن الشبكة مقطوعة حالياً. سيعمل الموقع تلقائياً بمجرد عودة
        الاتصال — أو تواصل معنا مباشرة عبر واتساب:
        <span dir="ltr" className="block mt-2 font-semibold text-foreground">
          {SITE.whatsapp.display}
        </span>
      </p>
      <a
        href={SITE.whatsapp.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]"
      >
        تواصل عبر واتساب
      </a>
    </main>
  )
}
