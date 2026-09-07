import Link from "next/link"
import Image from "next/image"
import { Smartphone, Bot, Mail, MapPin, Globe, MessageCircle, Share2 } from "lucide-react"
import { BackToTop } from "@/components/back-to-top"
import { SITE } from "@/lib/site"

/* r8: a full server component. The footer markup (links, contact list,
   bottom bar) is static HTML that never needed hydration — only the
   back-to-top button is interactive, and it now ships as its own tiny
   client island (back-to-top.tsx) with the r7 behaviors preserved
   exactly: sentinel IO with the corrected boolean, aria-hidden +
   tabIndex removal when hidden, focus release, smooth scroll. */
export function Footer() {
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
              <Image src="/logo.png" alt="SmartLink" width={118} height={80} className="h-7 w-auto object-contain" loading="lazy" />
            {/* r9: width/height now match the source aspect ratio (600×409) —
                the 130×32 declaration reserved a 4:1 box for a 1.47:1 image
                (r8 fixed this in main-nav but missed the footer). */}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              منصة رقمية متكاملة تقدم حلولاً ذكية للأعمال. نُمكنك من رقمنة خدماتك وزيادة مبيعاتك بأحدث التقنيات.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: MessageCircle, href: SITE.whatsapp.url, label: "واتساب" },
                { icon: Globe, href: SITE.social.facebook, label: "فيسبوك" },
                { icon: Share2, href: SITE.social.instagram, label: "انستغرام" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  {/* prefetch={false}: footer quick-links were firing duplicate
                      RSC prefetches that competed with LCP bandwidth. */}
                  <Link href={l.href} prefetch={false} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group inline-flex items-center gap-1.5 rounded">
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
                { label: SITE.products.menu.label, href: SITE.products.menu.url, icon: Smartphone, desc: SITE.products.menu.desc },
                { label: SITE.products.bot.label, href: SITE.products.bot.url, icon: Bot, desc: SITE.products.bot.desc },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${l.label} - رابط خارجي`}
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
                <a href={`mailto:${SITE.email}`} className="hover:text-foreground transition-colors">{SITE.email}</a>
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
                <a href={SITE.whatsapp.url} target="_blank" rel="noopener noreferrer" className="text-primary-text hover:underline underline-offset-2 transition-all" dir="ltr">
                  {SITE.whatsapp.display}
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

      {/* Back to top — its own client island (r8); see back-to-top.tsx */}
      <BackToTop />
    </footer>
  )
}
