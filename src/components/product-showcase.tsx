import Image from "next/image"
import { Smartphone, Bot, ArrowLeft } from "lucide-react"
import { SITE } from "@/lib/site"

/* ────────────────────────────────────────────────────────────
   Product Showcase — scroll-craft section (Smart-Menu parity)
   Real screenshots, scroll-driven, unified motion tokens.

   Server component: the parallax/reveal motion is 100% CSS
   scroll-driven animations (styles.css §scroll-driven) — same
   behavior as the previous framer-motion version (phone shift
   covers 10%→85% of the section's view timeline, tilt ±8°,
   browser parallax ±60px) with zero client JavaScript.
   Browsers without animation-timeline support get static
   visible content (graceful fallback).
   ──────────────────────────────────────────────────────────── */

const PHONE_FRAME_H = 560 // px — display height of the phone viewport
const BROWSER_FRAME_H = 420 // px — display height of the browser viewport

function FeatureChip({ label }: { label: string }) {
  return (
    <li className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-[var(--foreground)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" aria-hidden="true" />
      {label}
    </li>
  )
}

/* ── Smart Menu: phone mockup with a long screenshot scrolling inside ── */
function SmartMenuShowcase() {
  return (
    <section className="showcase-tl section-padding relative overflow-hidden" aria-label="Smart Menu عرض تفاعلي">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: "var(--gradient-smart-menu)", opacity: 0.35, maskImage: "radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent 75%)" }} />
      <div className="container-base relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Phone mockup */}
          <div className="reveal-scroll-strong order-2 lg:order-1 mx-auto w-full max-w-[320px]">
            <div className="phone-tilt relative rounded-[2.5rem] border border-[var(--glass-border)] p-3 shadow-xl">
              {/* Phone notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-1.5 rounded-full bg-[var(--border)] z-10" aria-hidden="true" />
              <div
                className="phone-frame relative overflow-hidden rounded-[2rem] bg-[var(--background)]"
                style={{ height: PHONE_FRAME_H }}
              >
                <div className="phone-shift will-change-transform">
                  <Image
                    src="/images/smart-menu.jpg"
                    alt="لقطة شاشة حقيقية من منيو Smart Menu الرقمي"
                    width={800}
                    height={4146}
                    /* r8: the phone frame is max-w-[320px] minus p-3×2 → the
                       image slot is 296px. "320px" made the optimizer serve
                       a 640w source for a 296px slot (Lighthouse: 18.7KB
                       wasted per image). */
                    sizes="296px"
                    className="w-full h-auto block"
                    priority={false}
                  />
                </div>
                {/* Scroll hint */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[var(--glass-bg-strong)] backdrop-blur-md border border-[var(--glass-border)] text-[11px] text-[var(--muted-foreground)] pointer-events-none" aria-hidden="true">
                  مرّر لمشاهدة المنيو كاملاً
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="reveal-scroll inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm mb-6">
              <Smartphone className="w-4 h-4 text-primary-text" aria-hidden="true" />
              <span className="text-sm font-semibold text-[var(--foreground)]">Smart Menu</span>
              <span className="text-xs text-[var(--muted-foreground)]">المنيو الرقمي للمطاعم</span>
            </div>
            <h2 className="reveal-scroll text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">
              منيو مطعمك، <span className="gradient-text">كما يراها عميلك فعلاً</span>
            </h2>
            <p className="reveal-scroll text-base text-[var(--muted-foreground)] leading-relaxed mb-7">
              هذه لقطة حقيقية من منيو يعمل الآن: أقسام واضحة، صور شهية، وأسعار بالدينار الليبي.
              العميل يطلب مباشرة عبر واتساب بدون تطبيق ولا تسجيل — وأنت تستقبل الطلب فوراً.
            </p>
            <ul className="reveal-scroll-stagger flex flex-wrap gap-2.5 mb-8">
              {["تصفح فوري", "طلب عبر واتساب", "QR مخصص", "لوحة تحكم عربية"].map((f) => (
                <FeatureChip key={f} label={f} />
              ))}
            </ul>
            <a
              href={SITE.products.menu.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="جرّب المنيو الحي — Smart Menu، رابط خارجي"
              className="reveal-scroll group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm shadow-glow hover:brightness-105 transition-all duration-200 active:scale-[0.97]"
            >
              <span className="inline-flex items-center gap-2">
                جرّب المنيو الحي <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SmartBot: browser mockup with parallax reveal ── */
function SmartBotShowcase() {
  return (
    <section className="showcase-tl section-padding relative overflow-hidden" aria-label="SmartBot عرض تفاعلي">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: "var(--gradient-smart-bot)", opacity: 0.3, maskImage: "radial-gradient(ellipse 70% 60% at 70% 40%, black, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 70% 40%, black, transparent 75%)" }} />
      <div className="container-base relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div>
            <div className="reveal-scroll inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm mb-6">
              <Bot className="w-4 h-4 text-primary-text" aria-hidden="true" />
              <span className="text-sm font-semibold text-[var(--foreground)]">SmartBot</span>
              <span className="text-xs text-[var(--muted-foreground)]">البوت الذكي لفيسبوك</span>
            </div>
            <h2 className="reveal-scroll text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">
              صفحتك على فيسبوك <span className="gradient-text">تردّ وأنت نائم</span>
            </h2>
            <p className="reveal-scroll text-base text-[var(--muted-foreground)] leading-relaxed mb-7">
              لوحة تحكم عربية تُصنّف نوايا العملاء تلقائياً، تردّ على الأسئلة المتكررة،
              وترفع لك المحادثات المهمة فقط. من نفس لوحة التحكم تبثّ رسائل جماعية وتتابع الإحصائيات.
            </p>
            <ul className="reveal-scroll-stagger flex flex-wrap gap-2.5 mb-8">
              {["تصنيف النوايا", "ردود تلقائية", "بث جماعي", "تقارير مباشرة"].map((f) => (
                <FeatureChip key={f} label={f} />
              ))}
            </ul>
            <a
              href={SITE.products.bot.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="افتح SmartBot — رابط خارجي"
              className="reveal-scroll group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm shadow-glow hover:brightness-105 transition-all duration-200 active:scale-[0.97]"
            >
              <span className="inline-flex items-center gap-2">
                افتح SmartBot <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
              </span>
            </a>
          </div>

          {/* Browser mockup */}
          <div className="reveal-scroll-strong order-2 mx-auto w-full max-w-[560px]">
            <div className="browser-parallax rounded-2xl border border-[var(--glass-border)] bg-[var(--card)] shadow-xl overflow-hidden will-change-transform">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-raised)]" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-[var(--destructive)] opacity-70" />
                <span className="w-3 h-3 rounded-full bg-[var(--warning)] opacity-70" />
                <span className="w-3 h-3 rounded-full bg-[var(--success)] opacity-70" />
                <div className="flex-1 mx-3 px-3 py-1 rounded-lg bg-[var(--background)] text-[11px] text-[var(--muted-foreground)] text-center truncate" dir="ltr">
                  bot.smart-link.ly
                </div>
              </div>
              <div className="relative overflow-hidden" style={{ height: BROWSER_FRAME_H }}>
                <Image
                  src="/images/smart-bot.jpg"
                  alt="لقطة شاشة حقيقية من لوحة تحكم SmartBot"
                  width={560}
                  height={350} /* r8: the file is 1280×800 (ratio 1.6), not
                                  1280×768 — 560×350 is the true box; 336
                                  reserved 14px too little. */
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProductShowcase() {
  return (
    <div className="relative">
      {/* Section divider with product bullets */}
      <div className="container-base relative">
        <div className="flex items-center gap-4 py-2" aria-hidden="true">
          <span className="h-px flex-1 bg-[var(--border)]" />
          <Smartphone className="w-4 h-4 text-[var(--muted-foreground)] opacity-50" />
          <Bot className="w-4 h-4 text-[var(--muted-foreground)] opacity-50" />
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>
      </div>
      <SmartMenuShowcase />
      <SmartBotShowcase />
    </div>
  )
}
