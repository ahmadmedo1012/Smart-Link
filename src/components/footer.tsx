"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Smartphone, Bot, Mail, MapPin, Globe, MessageCircle, Share2, ArrowUp } from "lucide-react"

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-sunken)] relative">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" aria-hidden="true" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-base py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="SmartLink" width={130} height={32} className="h-7 w-auto object-contain" loading="lazy" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              منصة رقمية متكاملة تقدم حلولاً ذكية للأعمال. نُمكنك من رقمنة خدماتك وزيادة مبيعاتك بأحدث التقنيات.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: MessageCircle, href: "https://wa.me/218910089975", label: "واتساب" },
                { icon: Globe, href: "https://www.facebook.com/profile.php?id=61591502614404", label: "فيسبوك" },
                { icon: Share2, href: "https://instagram.com/smart_link.0/", label: "انستغرام" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-11 h-11 rounded-xl bg-[var(--accent)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--primary)] hover:text-white transition-all duration-300"
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
                { label: "الخطط والأسعار", href: "/pricing" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group inline-flex items-center gap-1.5 rounded">
                    <span className="w-0 group-hover:w-1.5 h-1.5 rounded-full bg-primary transition-all duration-200" aria-hidden="true" />
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
                { label: "Smart Menu — المنيو الرقمي", href: "https://menu.smart-link.ly", icon: Smartphone, desc: "حول منيو مطعمك إلى تجربة رقمية" },
                { label: "SmartBot — البوت الذكي", href: "https://bot.smart-link.ly", icon: Bot, desc: "أتمتة الردود على فيسبوك بذكاء" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${l.label} — رابط خارجي`}
                    className="flex flex-col gap-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group rounded"
                  >
                    <span className="flex items-center gap-2">
                      <l.icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      {l.label}
                    </span>
                    <span className="text-xs text-muted-foreground/60 mr-5.5">{l.desc}</span>
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
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                <a href="mailto:ahmedmedo1012@gmail.com" className="hover:text-foreground transition-colors">ahmedmedo1012@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                ليبيا
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 text-primary" />
                </div>
                <a href="https://wa.me/218910089975" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-2 transition-all">
                  واتساب: 218910089975+
                </a>
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
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors rounded">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors rounded">شروط الاستخدام</Link>
          </div>
        </div>
      </div>

      {/* Back to top — animated in/out */}
      <button
        onClick={scrollToTop}
        aria-label="العودة للأعلى"
        className={`fixed bottom-6 right-6 w-11 h-11 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:shadow-glow transition-all duration-300 z-40 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </footer>
  )
}
