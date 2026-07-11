import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartLink — منصة رقمية متكاملة",
    description: "حلول ذكية للأعمال: المنيو الرقمي، البوت الذكي، والمزيد",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cairo.variable}>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SmartLink" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col antialiased overflow-x-hidden bg-[var(--background-radial),var(--background)]">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="grain-overlay pointer-events-none fixed inset-0 opacity-[0.03] z-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          <MainNav />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors closeButton />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
