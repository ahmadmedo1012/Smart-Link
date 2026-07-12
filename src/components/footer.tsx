"use client"
import Link from "next/link"
import Image from "next/image"
import { Smartphone, Bot, Mail, MapPin, Globe, MessageCircle, Share2, ArrowUp } from "lucide-react"

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-sunken)] relative">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" aria-hidden="true" />

      <div className="container-base py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="SmartLink" width={32} height={32} className="w-8 h-8 object-contain" loading="lazy" />
              <span className="text-base font-bold">Smart<span className="text-primary">Link</span></span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              منصة رقمية متكاملة تقدم حلولاً ذكية للأعمال. نُمكنك من رقمنة خدماتك وزيادة مبيعاتك بأحدث التقنيات.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: MessageCircle, href: "#", label: "واتساب" },
                { icon: Globe, href: "#", label: "فيسبوك" },
                { icon: Share2, href: "#", label: "انستغرام" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-11 h-11 rounded-lg bg-[var(--accent)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--primary)] hover:text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5">
              {[
                { label: "الرئيسية", href: "/" },
                { label: "عن SmartLink", href: "/about" },
                { label: "اتصل بنا", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)] rounded">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">خدماتنا</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Smart Menu — المنيو الرقمي", href: "https://menu.smart-link.ly", icon: Smartphone },
                { label: "SmartBot — البوت الذكي", href: "https://bot.smart-link.ly", icon: Bot },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${l.label} — رابط خارجي`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)] rounded"
                  >
                    <l.icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">اتصل بنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                support@smart-link.ly
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                ليبيا
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)] py-5">
        <div className="container-base flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SmartLink. جميع الحقوق محفوظة</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)] rounded">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)] rounded">شروط الاستخدام</Link>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        aria-label="العودة للأعلى"
        className="fixed bottom-6 right-6 w-11 h-11 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:brightness-110 transition-all duration-300 z-40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  )
}
