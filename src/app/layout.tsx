import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { MotionConfig } from "framer-motion"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { ScrollProgress } from "@/components/scroll-progress"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "SmartLink — منصة رقمية متكاملة",
    template: "%s | SmartLink",
  },
  description: "SmartLink منصة رقمية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي للمطاعم، البوت الذكي لفيسبوك، والمزيد من الخدمات المبتكرة",
  keywords: ["SmartLink", "منصة رقمية", "الربط الذكي", "منيو رقمي", "بوت فيسبوك", "تسويق إلكتروني"],
  metadataBase: new URL("https://smart-link.ly"),
  openGraph: {
    title: "SmartLink — منصة رقمية متكاملة",
    description: "حلول ذكية للأعمال: المنيو الرقمي، البوت الذكي، والمزيد",
    url: "/",
    siteName: "SmartLink",
    locale: "ar_LY",
    type: "website",
    images: [{ url: "/og-smartlink.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartLink — منصة رقمية متكاملة",
    description: "حلول ذكية للأعمال: المنيو الرقمي، البوت الذكي، والمزيد",
    images: ["/og-smartlink.svg"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cairo.variable}>
      <head>
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SmartLink" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SmartLink",
              url: "https://smart-link.ly",
              logo: "https://smart-link.ly/favicon-32.png",
              contactPoint: {
                "@type": "ContactPoint",
                email: "ahmadmedo1012@gmail.com",
                contactType: "customer service",
              },
              sameAs: ["https://wa.me/218910089975"],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SmartLink",
              url: "https://smart-link.ly",
              inLanguage: "ar",
            }),
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col antialiased overflow-x-hidden bg-[var(--background)]">
        <a href="#main-content" className="pointer-events-auto fixed opacity-0 focus:opacity-100 focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[var(--primary)] focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none transition-opacity duration-200">
          تخطى إلى المحتوى الرئيسي
        </a>
        <div className="noise-overlay" />
        <ScrollProgress />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <MotionConfig reducedMotion="user">
            <MainNav />
            <main id="main-content" className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </MotionConfig>
          <Toaster position="top-center" richColors closeButton />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
