import Link from "next/link"
import { SITE } from "@/lib/site"
import { LibyaFlag } from "@/components/landing/LibyaFlag"
import { CurrentYear } from "@/components/current-year"

/* r129 — the landing footer (canonical landing.css:1486 ground-plate
 * family). Flat ink-2 plate, hairline seam, four columns of REAL
 * destinations only: journey anchors, the three live products, the
 * site's own pages and legal routes. Bottom bar signs with the brand +
 * year + the canonical 14px LibyaFlag glyph (r129 P0-14: Madarek
 * LandingPage.tsx:772-774 — «صُنع في ليبيا» rode text only).
 * r140 (تدقيق A140-SL ‎#6): السنة تُرخّ عبر جزيرة CurrentYear — كان
 * المكوّن سيرفريًا يُبنى مسبقًا فتتجمّد السنة زمن البناء (فئة ثغرة
 * r126 نفسها التي أُغلقت في footer.tsx:165 ولم تُنسخ هنا).
 * r142 «الكوكبة الحية»: عمود «الرحلة» يتبع خريطة الفصول الجديدة
 * (العوالم/الرحلة/القيادة/المنصّات) — مرساة #roles غابت مع اندماج
 * الأدوار في فصل العوالم، والعقد الوظيفية كلها محفوظة (r9-coverage).
 * 15-SL (قبول 14-a P3): عمود المنظومة بنمط الأسطول نفسه (تذييل
 * المائدة cd5d06f وتذييل الأوردر 86fb698): اسم عربي + وصف سطر واحد
 * بدل الأسماء الإنجليزية العارية، والعنوان «منظومة الربط الذكي» كما
 * في الأخوين. الأوصاف من هوية كل منتج المنشورة نفسها لا من الخيال:
 * سمارت بوت «منصة إدارة فيسبوك الذكية» (عنوان bot.smart-link.ly
 * الذاتي)، سمارت منيو «قوائم QR التفاعلية» (تذييل الأوردر — وQR عقد
 * حي في هوية المنيو نفسها)، سمارت أوردر «منصة الطلبات الرقمية»
 * (عنوانه الذاتي)، والصفحة هنا لا تُذكر (عقيدة «المائدة نفسها»). */

const ECOSYSTEM = [
  { href: SITE.products.menu.url, label: "سمارت منيو — قوائم QR التفاعلية" },
  { href: SITE.products.bot.url, label: "سمارت بوت — منصة إدارة فيسبوك الذكية" },
  { href: SITE.products.order.url, label: "سمارت أوردر — منصة الطلبات الرقمية" },
]

export function LandingFooter() {
  /* buildYear — يُخبَز في HTML (زوّار بلا JS تبقى لهم سنة صالحة)،
   * والجزيرة تُرطّب السنة الحية بعد الترطيب (useSyncExternalStore —
   * بلا setState-in-effect). */
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
            <a href="#products" className="landing-footer-link">العوالم</a>
            <a href="#journey" className="landing-footer-link">رحلة الربط</a>
            <a href="#progress" className="landing-footer-link">قراءة القيادة</a>
            <a href="#platforms" className="landing-footer-link">المنصّات</a>
          </div>
          <div className="landing-footer-col">
            <div className="landing-footer-heading">منظومة الربط الذكي</div>
            {/* 15-SL: النص الظاهر هو الاسم الكنسي (بدون aria-label
                يطغى على الظاهر — عقد التذييلين الأخوين نفسه). */}
            {ECOSYSTEM.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="landing-footer-link"
              >
                {l.label}
              </a>
            ))}
            <Link href="/pricing" prefetch={false} className="landing-footer-link">الخطط والأسعار</Link>
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
          {/* r140: جزيرة السنة الحية — توأم footer.tsx:165 (r126). */}
          <span>© <CurrentYear buildYear={year} /> SmartLink</span>
          <span className="ln-footer-cluster">
            <LibyaFlag size={14} /> صُنع في ليبيا
          </span>
        </div>
      </div>
    </footer>
  )
}
