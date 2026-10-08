import Link from "next/link"
import { SITE } from "@/lib/site"
import { LibyaFlag } from "@/components/landing/LibyaFlag"

/* r129 — the landing footer (canonical landing.css:1486 ground-plate
 * family). Flat ink-2 plate, hairline seam, four columns of REAL
 * destinations only: journey anchors, the two live products, the
 * site's own pages and legal routes. Bottom bar signs with the brand +
 * year + the canonical 14px LibyaFlag glyph (r129 P0-14: Madarek
 * LandingPage.tsx:772-774 — «صُنع في ليبيا» rode text only). */

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="landing-footer">
      <div className="marketing-container">
        <div className="landing-footer-grid">
          <div className="landing-footer-col">
            <Link href="/" className="landing-brand" aria-label="SmartLink — الرئيسية">
              <span className="landing-brand-mark" aria-hidden="true">S</span>
              <span className="landing-brand-text">
                <span className="landing-brand-name">SmartLink</span>
                <span className="landing-brand-sub">منصّة رقمية متكاملة</span>
              </span>
            </Link>
            <p className="landing-footer-about">
              منصة رقمية متكاملة تقدم حلولاً ذكية للأعمال. نُمكنك من رقمنة
              خدماتك وزيادة مبيعاتك بأحدث التقنيات.
            </p>
          </div>
          <div className="landing-footer-col">
            <div className="landing-footer-heading">الرحلة</div>
            <a href="#products" className="landing-footer-link">المنتجات</a>
            <a href="#journey" className="landing-footer-link">رحلة الربط</a>
            <a href="#progress" className="landing-footer-link">قصة التقدّم</a>
            <a href="#platforms" className="landing-footer-link">المنصّات</a>
          </div>
          <div className="landing-footer-col">
            <div className="landing-footer-heading">المنظومة</div>
            <a
              href={SITE.products.menu.url}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-footer-link"
              aria-label="Smart Menu — رابط خارجي"
            >
              Smart Menu
            </a>
            <a
              href={SITE.products.bot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-footer-link"
              aria-label="SmartBot — رابط خارجي"
            >
              SmartBot
            </a>
            <Link href="/pricing" prefetch={false} className="landing-footer-link">الخطط والأسعار</Link>
            <a href="#roles" className="landing-footer-link">الأدوار</a>
          </div>
          <div className="landing-footer-col">
            <div className="landing-footer-heading">المؤسسة</div>
            <Link href="/about" prefetch={false} className="landing-footer-link">عن SmartLink</Link>
            <Link href="/contact" prefetch={false} className="landing-footer-link">تواصل معنا</Link>
            <Link href="/privacy" prefetch={false} className="landing-footer-link">سياسة الخصوصية</Link>
            <Link href="/terms" prefetch={false} className="landing-footer-link">شروط الاستخدام</Link>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>© {year} SmartLink</span>
          <span className="ln-footer-cluster">
            <LibyaFlag size={14} /> صُنع في ليبيا
          </span>
        </div>
      </div>
    </footer>
  )
}
