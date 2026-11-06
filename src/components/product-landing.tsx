import Link from "next/link"
import { Check, ChevronLeft, Smartphone, Bot, ShoppingBag, Users, Zap, ArrowLeft } from "lucide-react"
import { GenArtBackground } from "@/components/gen-art-background"
import { SiteChrome } from "@/components/site-chrome"
import { FaqAccordion } from "@/components/faq-accordion"
import { formatLyd } from "@/lib/money"
import { SITE } from "@/lib/site"
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/schema"
/* P45-W1 (Initiative C+B — vertical #2): the hub's OWN product landing
 * pages (/menu /bot /order). One shared server component renders all
 * three from the extended WORLDS registry — the single source the finder
 * and the comparison matrix already read — so the pain→solution chapter
 * and the free-limits card can never drift from the rest of the hub.
 *
 * HONESTY LAWS this page obeys (P45-BASELINE, binding):
 * · ZERO sibling mirroring — no iframing, no copied sibling surfaces;
 *   the framing lede is the hub's own ecosystem POV, and every
 *   capability string renders VERBATIM from the repo's own registry
 *   (worlds.ts problem/audience/channel/claims — themselves sourced
 *   from the repo's documented positioning, r142/r137 audits).
 * · The free tier is the hub's only sale: freeLimits render the
 *   registry strings (unit-pinned to the /pricing free cards —
 *   tests/unit/worlds.test.ts), the first paid rung renders through
 *   formatLyd ONLY (the one money spelling), and the ladder links out
 *   to the sibling's own pricing page (the live source of truth).
 * · The FAQ answers fold ONLY catalog-verifiable capabilities (worlds
 *   claims / pricing ladders / PRODUCT.md) — no invented features, no
 *   future tense (truth-gate walks this file).
 * · The dual CTAs are the P40-5a contract: signupUrl (the product's
 *   own signup page) primary + the product root (browsing) secondary.
 *
 * ARCHITECTURE: this is a Server Component — the FAQ accordion is the
 * only client island, exactly like /pricing (the chapter anatomy, the
 * wells/motifs, the fleet CTA canon and the reveal ladder are all
 * reused patterns from the inner-page grammar — no new visual system).
 */

import { WORLDS, worldById, productRoute, type World } from "@/components/landing/worlds"

/** The per-product page config each route file owns (framing + FAQs are
 *  the ONE hand-written layer; everything else rides the registry). */
export type ProductPageConfig = {
  id: World["id"]
  /** The Arabic h1 tail after the Latin product name. */
  titleSuffix: string
  /** The hub-unique ecosystem framing lede (why THIS product inside
   *  منظومة سمارت — never a restatement of the sibling's own copy). */
  framing: string
  /** The paid ladder's cycle wording, mirroring the /pricing ecosystem
   *  tables' own period strings (menu: 30 يومًا · bot/order: شهر). */
  paidCycle: string
  /** 3-4 factual FAQ items — capabilities verifiable from this repo's
   *  catalog only; money rides formatLyd. */
  faqs: { q: string; a: string }[]
  /** GenArtBackground seed (deterministic per product, like about=2024
   *  and pricing=77). */
  seed: number
}

const PRODUCT_ICONS = { menu: Smartphone, bot: Bot, order: ShoppingBag } as const

export function ProductLanding({ config }: { config: ProductPageConfig }) {
  const w = worldById(config.id)!
  const siblings = WORLDS.filter((x) => x.id !== config.id)
  const Icon = PRODUCT_ICONS[w.id]
  const jsonLd = [
    faqJsonLd(config.faqs),
    breadcrumbJsonLd([
      { name: "الرئيسية", path: "" },
      { name: SITE.products[w.id].label, path: productRoute(w.id) },
    ]),
  ]

  return (
    <SiteChrome>
      <div className="pt-28 relative overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GenArtBackground seed={config.seed} variant="blobs" />
        <div className="container-base relative">
          {/* ── head chapter — hero with the ecosystem framing ───────
              LCP doctrine holds: h1 + lede render inline (no reveal
              animation); only the eyebrow rides the reveal ladder. */}
          <header className="ln-chapter ln-chapter--head">
            <div className="ln-chapter-head">
              <span className="ln-label reveal-up reveal-d-1">{w.sub}</span>
              <h1 className="ln-page-title">
                <em>{w.name}</em> — {config.titleSuffix}
              </h1>
              <p className="ln-chapter-lede">{config.framing}</p>
              {/* dual CTAs — the P40-5a contract: signupUrl primary
                  (the product's own signup page, external conventions
                  + Label-in-Name) + the live product root secondary
                  (the sibling's own CTA verb, worlds.ts). */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={w.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ابدأ مجاناً — ${w.name}، رابط خارجي`}
                  className="group inline-flex items-center gap-2 h-11 px-5 rounded-md bg-primary text-[var(--primary-fg)] font-semibold text-[length:var(--fs-sm)] hover:bg-[var(--accent-hover)] transition-all duration-[var(--t-fast)] active:scale-[0.97]"
                >
                  ابدأ مجاناً <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                </a>
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${w.cta} — ${w.name}، رابط خارجي`}
                  className="group inline-flex items-center gap-2 h-11 px-5 ln-card rounded-md text-foreground font-semibold text-[length:var(--fs-sm)]"
                >
                  {w.cta} <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
                </a>
              </div>
            </div>
          </header>

          {/* ── chapter 01 — pain → solution (registry-fed, verbatim) ── */}
          <section className="ln-chapter" aria-labelledby="product-pain">
            <div className="ln-chapter-head">
              <span className="ln-label reveal-up reveal-d-1">01 — المشكلة والحل</span>
              <h2 id="product-pain" className="ln-chapter-title reveal-up reveal-d-1">
                لمن هذا العالم؟
              </h2>
              <p className="ln-chapter-lede">
                كل ما في هذا الفصل من سجل العوالم نفسه — المصدر الواحد الذي
                يقرأه محدد المنتجات ومصفوفة المقارنة على الرئيسية.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* المشكلة + الجمهور — verbatim registry strings */}
              <div className="reveal-up reveal-d-1 ln-card rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className={`ln-motif ln-motif--${w.motif}`} aria-hidden="true" />
                  <h3 className="text-[length:var(--fs-h3)] font-bold text-foreground">المشكلة التي يحلها</h3>
                </div>
                <p className="text-[length:var(--fs-body)] text-muted-foreground leading-relaxed mb-6">{w.problem}</p>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[var(--accent-strong)]" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-[length:var(--fs-body)] font-semibold text-foreground mb-1">لمن؟</h4>
                    <p className="text-[length:var(--fs-body)] text-muted-foreground leading-relaxed">{w.audience}</p>
                  </div>
                </div>
              </div>
              {/* الحل — القناة + القدرات الثلاث (registry strings) */}
              <div className="reveal-up reveal-d-2 ln-card rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[var(--accent-strong)]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[length:var(--fs-h3)] font-bold text-foreground">كيف يعمل؟</h3>
                </div>
                <p className="ln-mono text-[length:var(--fs-body)] text-[var(--primary-text)] mb-6" dir="rtl">
                  {w.channel}
                </p>
                <ul className="space-y-3">
                  {w.claims.map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[length:var(--fs-body)] text-muted-foreground">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ln-well--${w.id}`}>
                        <Check className="w-3 h-3" aria-hidden="true" />
                      </div>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── chapter 02 — the honest free tier + the live ladder ──
              The hub sells the free tier only: the card mirrors the
              /pricing free cards' own catalog strings (unit-pinned), and
              the paid story links OUT to the sibling's live pricing. */}
          <section className="ln-chapter" aria-labelledby="product-plans">
            <div className="ln-chapter-head">
              <span className="ln-label reveal-up reveal-d-1">02 — الباقات</span>
              <h2 id="product-plans" className="ln-chapter-title reveal-up reveal-d-1">ابدأ مجاناً، وارقِ عند منصّته</h2>
              <p className="ln-chapter-lede">
                هذه الباقة المجانية نفسها المعروضة على صفحة الأسعار — بلا
                بطاقة ائتمان، وتُدار من لوحة تحكم {w.name} مباشرة.
              </p>
            </div>
            <div className="reveal-up reveal-d-2 max-w-xl">
              <div className="ln-card rounded-2xl p-7 md:p-8 flex flex-col">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ln-well--${w.id}`}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className={`ln-motif ln-motif--${w.motif}`} aria-hidden="true" />
                  <h3 className="text-[length:var(--fs-h3)] font-bold text-foreground">{w.name}</h3>
                </div>
                <p className="text-[length:var(--fs-body)] text-[var(--primary-text)] font-medium mb-2">{w.sub}</p>
                <div className="mb-6">
                  <span className="ln-mono text-[length:var(--fs-metric-lg)] font-bold text-foreground">مجاني</span>
                  <span className="text-[length:var(--fs-body)] text-muted-foreground ms-2">الخطة الأساسية</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {w.freeLimits.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[length:var(--fs-body)] text-muted-foreground">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ln-well--${w.id}`}>
                        <Check className="w-3 h-3" aria-hidden="true" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={w.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ابدأ الآن — ${w.name}، رابط خارجي`}
                  className="group inline-flex items-center justify-center gap-2 w-full h-11 px-5 rounded-md bg-primary text-[var(--primary-fg)] font-semibold text-[length:var(--fs-sm)] hover:bg-[var(--accent-hover)] transition-all duration-[var(--t-fast)] active:scale-[0.97]"
                >
                  ابدأ الآن <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                </a>
              </div>
            </div>
            {/* the live paid ladder — mirror + link OUT (never priced
                here): the first rung via formatLyd, the sibling's own
                pricing page as the live source, and the hub's /pricing
                ecosystem anchor for the three-ladder comparison. */}
            <div className="reveal-up reveal-d-3 max-w-xl mt-6">
              <div className="ln-card rounded-2xl p-6">
                <p className="text-[length:var(--fs-body)] text-muted-foreground leading-relaxed mb-4">
                  الباقات المدفوعة حيّة بالدينار الليبي على منصّة {w.name} —
                  تبدأ من <span className="ln-mono font-bold text-foreground">{formatLyd(w.paidFrom)}</span> لكل {config.paidCycle}.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <a
                    href={`${w.url}/pricing`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`تفاصيل الخطط على منصّة ${w.name}، رابط خارجي`}
                    className="inline-flex items-center min-h-[44px] py-3 text-[length:var(--fs-body)] font-semibold text-primary-text hover:underline decoration-2 underline-offset-4 transition-colors"
                  >
                    تفاصيل الخطط على منصّة {w.name}
                  </a>
                  <Link
                    href="/pricing#ecosystem"
                    prefetch={false}
                    className="inline-flex items-center min-h-[44px] py-3 text-[length:var(--fs-body)] font-semibold text-primary-text hover:underline decoration-2 underline-offset-4 transition-colors"
                  >
                    سلّم المنظومة الثلاثي على صفحة الأسعار
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── chapter 03 — the per-product FAQ (catalog-verifiable) ── */}
          <section className="ln-chapter" aria-labelledby="product-faq">
            <div className="ln-chapter-head">
              <span className="ln-label reveal-up reveal-d-1">03 — الأسئلة</span>
              <h2 id="product-faq" className="ln-chapter-title reveal-up reveal-d-1">أسئلة شائعة عن {w.name}</h2>
              <p className="ln-chapter-lede">إجابات من قدرات المنصّة المثبّة فقط — لا وعد بشيء غير موجود</p>
            </div>
            <div className="max-w-3xl">
              <FaqAccordion faqs={config.faqs} />
            </div>
          </section>

          {/* ── chapter 04 — the rest of the ecosystem (hub cross-links) ──
              The product pages are the hub's discovery surface: each
              page routes to its two siblings' hub pages, the finder
              island on /, and the pricing ladders (linked above). */}
          <section className="ln-chapter" aria-labelledby="product-family">
            <div className="ln-chapter-head">
              <span className="ln-label reveal-up reveal-d-1">04 — المنظومة</span>
              <h2 id="product-family" className="ln-chapter-title reveal-up reveal-d-1">بقية المنظومة</h2>
              <p className="ln-chapter-lede">
                ثلاثة عوالم تعمل الآن — كل عالم يعيش على نطاقه، والمظلة
                تجمعها في رحلة واحدة.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {siblings.map((s, i) => {
                const SibIcon = PRODUCT_ICONS[s.id]
                return (
                  <div
                    key={s.id}
                    className={`reveal-up reveal-d-${i + 1} ln-card group rounded-2xl p-6 flex flex-col`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ln-well--${s.id}`}>
                      <SibIcon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-[length:var(--fs-h3)] font-bold text-foreground mb-1" dir="ltr">{s.name}</h3>
                    <p className="text-[length:var(--fs-body)] text-muted-foreground leading-relaxed mb-4 flex-1">{s.desc}</p>
                    <Link
                      href={productRoute(s.id)}
                      prefetch={false}
                      className="group/link inline-flex items-center gap-2 min-h-[44px] py-3 text-[length:var(--fs-body)] font-semibold text-primary-text hover:underline decoration-2 underline-offset-4 transition-colors"
                    >
                      اعرف المزيد عن {s.name}
                      <ArrowLeft className="w-4 h-4 group-hover/link:-translate-x-0.5 transition-transform" aria-hidden="true" />
                    </Link>
                  </div>
                )
              })}
              {/* the finder island on / — the honest chooser */}
              <div className="reveal-up reveal-d-3 ln-card rounded-2xl p-6 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-[var(--accent-strong)]" aria-hidden="true" />
                </div>
                <h3 className="text-[length:var(--fs-h3)] font-bold text-foreground mb-1">أي عالمٍ يناسب عملك؟</h3>
                <p className="text-[length:var(--fs-body)] text-muted-foreground leading-relaxed mb-4 flex-1">
                  سؤالان قصيران على الرئيسية — أو اقرأ مصفوفة المقارنة كاملة
                  تحت الجواب، من سجل العوالم نفسه.
                </p>
                <Link
                  href="/#finder"
                  prefetch={false}
                  className="group/link inline-flex items-center gap-2 min-h-[44px] py-3 text-[length:var(--fs-body)] font-semibold text-primary-text hover:underline decoration-2 underline-offset-4 transition-colors"
                >
                  جرّب محدد المنتجات
                  <ArrowLeft className="w-4 h-4 group-hover/link:-translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SiteChrome>
  )
}
