/* r142 «الكوكبة الحية» — the shared WORLDS registry: the single source
 * both the hero constellation (EcosystemConstellation dock + glass card)
 * and the editorial worlds chapter (WorldsSection) read.
 *
 * HARD LAWS of this module:
 * · ZERO hex here or in any landing TSX — every hue is a --ln-* token
 *   name resolved from landing.css (the `token` field). The canvas
 *   engine reads the same tokens at runtime via getComputedStyle.
 * · ZERO invented claims — every string folds shipped copy: the product
 *   descriptions are SITE.products.*.desc, the claims are the roles/
 *   marquee/FAQ truths (r128/r137/r138/r140 audits), and the domains are
 *   the LIVE product URLs from SITE (the single business registry).
 */

export type WorldId = "menu" | "bot" | "order"

export type World = {
  id: WorldId
  /** Latin product name (verbatim SITE.products.*.short). */
  name: string
  /** Arabic role line (the constellation's shipped sub). */
  sub: string
  /** One-line Arabic description — SITE.products.*.desc verbatim. */
  desc: string
  /** Exactly THREE real claims, folded from the page's shipped copy. */
  claims: readonly [string, string, string]
  /** The world hue — a landing.css token name (never a literal color).
     r152 (phase5): the LIT foreshadow grade — text/CTA fills/nodes. */
  token: string
  /** The world's TRUE identity hex token — swatch chips + motifs
     (non-text grade; the sibling's literal Phase-5 color). */
  swatch: string
  /** The sibling's Phase-5 world mark (r152): plate / circuit /
     route — the foreshadow motif rendered beside the domain. */
  motif: "plate" | "circuit" | "route"
  /** The live domain host (display form, mono/LTR). */
  host: string
  /** The live URL (SITE.products.*.url verbatim). */
  url: string
  /** The giant editorial numeral (Western digits — the mission E1
     *     display contract: every number the UI renders is 1234567890;
     *     money.ts/phone.ts normalize Arabic-Indic INPUT the same way). */
  numeral: string
}

export const WORLDS: readonly World[] = [
  {
    id: "menu",
    name: "Smart Menu",
    sub: "المنيو الرقمي للمطاعم — يعمل الآن",
    desc: "حول منيو مطعمك إلى تجربة رقمية تفاعلية",
    claims: [
      "منيو تفاعلي بصور وأسعار بالدينار الليبي",
      "الطلبات تصل مباشرة على واتساب — بدون تطبيق ولا تسجيل",
      "QR كود مخصص لكل طاولة ولوحة تحكم عربية كاملة",
    ],
    token: "--ln-menu",
    swatch: "--ln-menu-true",
    motif: "plate",
    host: "menu.smart-link.ly",
    url: "https://menu.smart-link.ly",
    numeral: "01",
  },
  {
    id: "bot",
    name: "SmartBot",
    sub: "البوت الذكي لفيسبوك — يعمل الآن",
    desc: "أتمتة الردود على صفحات فيسبوك بذكاء",
    claims: [
      "تصنيف نوايا العملاء تلقائياً وردود ذكية على المتكرر",
      "بث جماعي وإدارة الصفحات من لوحة عربية واحدة",
      "تقارير مباشرة ترفع لك المحادثات المهمة فقط",
    ],
    token: "--ln-bot",
    swatch: "--ln-bot-true",
    motif: "circuit",
    host: "bot.smart-link.ly",
    url: "https://bot.smart-link.ly",
    numeral: "02",
  },
  {
    id: "order",
    name: "Smart Order",
    sub: "متجر الطلبات الرقمي — يعمل الآن",
    desc: "أطلق متجر طلباتك الرقمي بتوصيل ومدفوعات ليبية",
    claims: [
      "متجر يعمل فوراً: منتجاتك بأقسامها",
      "طرق دفع محلية ومنطقة توصيل قابلة للضبط",
      "الطلبات تصل مرتبة وواضحة — بطريقة الدفع ومنطقة التوصيل",
    ],
    token: "--ln-order",
    swatch: "--ln-order-true",
    motif: "route",
    host: "order.smart-link.ly",
    url: "https://order.smart-link.ly",
    numeral: "03",
  },
] as const

/** The glass preview card + chips read this; hero canvas selection too. */
export const worldById = (id: WorldId | null): World | null =>
  WORLDS.find((w) => w.id === id) ?? null
