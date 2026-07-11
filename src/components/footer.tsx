import Link from "next/link"
import Image from "next/image"
import { Smartphone, Bot, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-sunken)]">
      <div className="container-base py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="SmartLink" width={32} height={32} className="w-8 h-8 object-contain" />
              <span className="text-base font-bold">Smart<span className="text-primary">Link</span></span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة رقمية متكاملة تقدم حلولاً ذكية للأعمال. نُمكنك من رقمنة خدماتك وزيادة مبيعاتك بأحدث التقنيات.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {[
                { label: "الرئيسية", href: "/" },
                { label: "عن SmartLink", href: "/about" },
                { label: "اتصل بنا", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">خدماتنا</h4>
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
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <l.icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">اتصل بنا</h4>
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

      <div className="border-t border-[var(--border)] py-5">
        <div className="container-base flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SmartLink. جميع الحقوق محفوظة</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
