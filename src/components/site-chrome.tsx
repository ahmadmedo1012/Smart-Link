import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { RevealObserver } from "@/components/reveal-observer"

/* r128 Stage B (F2b) — per-page site chrome for every NON-landing surface.
 *
 * The landing ("/") now owns its entire world (LandingHeader + landing
 * footer + grain inside the .landing scope, R4), so the shared product
 * chrome (skip link + MainNav + the CSS scroll-progress ribbon + Footer)
 * moved out of the RootLayout and into this wrapper: inner pages render
 * byte-identical to before, and the landing renders no product chrome
 * at all.
 *
 * 15-SL (قبول 14-a P3): حبوبة التخطّي الذهبية تنتقل إلى هنا من
 * RootLayout — هدفها مرساة main#main-content الوحيدة تعيش في هذا
 * الملف نفسه، فكان وضعها في ال layout يجعلها على ال landing توأمًا
 * ميتًا (رابط إلى مرساة غير موجودة تحجبه landing.css). الآن الرابط
 * وهدفه في مكوّن واحد: أول Tab على كل صفحة منتج = الرابط الحي،
 * والرئيسية تبقى على حبوبتها الجيرية الخاصة → #main.
 *
 * r130 (W1-D P2-11): RevealObserver — the one-shot IO that writes the
 * canonical `.reveal-up.in-view` transition family (see
 * components/reveal-observer.tsx). */

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 15-SL (من RootLayout): رابط التخطّي الذهبي — أول محطة Tab،
          مخفي حتى التركيز. r131 (A12 P3): يركب start-4 المنطقية
          (وليس right-4 الفيزيائية — القاعدة أسطورية في الأسطول).
          r148 (19-AUDIT-SL D8): يركب أرضية اللمس نفسها (focus:py-3
          ≈ 44px بدل 36px) ويستسلم لحلقة :focus-visible العامة —
          الحلقة الذهبية الكنسية للعالم المنتجي، توأم حبوبة الهبوط
          الجيرية التي تحمل حلقتها الكريمية.
          r151 (P3-1، تدقيق r151-a0a): الكشف الحي قاس 25px فقط —
          focus:min-h-11 مسمار الارتفاع المضمون (≥44 مهما استقر عليه
          line-height/الحشوة) — توأم min-block-size:44 لحبوبة الهبوط. */}
      <a href="#main-content" className="pointer-events-auto fixed opacity-0 focus:opacity-100 focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:px-4 focus:py-3 focus:min-h-11 focus:rounded-xl focus:bg-[var(--primary)] focus:text-[var(--primary-fg)] focus:text-sm focus:font-semibold focus:shadow-lg transition-opacity duration-[var(--t-fast)]">
        تخطَّ إلى المحتوى الرئيسي
      </a>
      {/* r8: scroll progress bar is a pure CSS scroll-driven animation
          (scroll(root) timeline, styles.css) — zero JS. */}
      <div className="scroll-progress" aria-hidden="true" />
      <MainNav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <RevealObserver />
    </>
  )
}
