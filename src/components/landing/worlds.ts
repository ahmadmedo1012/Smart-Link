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
 *
 * P45-W1 (Initiative B+A — the discovery fields): each world now also
 * carries the honest DISCOVERY data the «أي عالم يناسب عملك؟» finder and
 * the comparison matrix read — audience / problem / channel / freeLimits
 * / paidFrom / signupUrl. SOURCING (the honesty regime is law):
 * · audience/problem — the repo's own honest positioning (menu/bot from
 *   docs/projects-comparison.md:27-28, the two-product-era doc whose
 *   problem statements the P45 baseline ships to the visitor; order from
 *   PRODUCT.md's audience line + the published claim set).
 * · channel — the conversion channel each product actually operates
 *   (comparison doc :29 for menu/bot; order's from its own schema.ts
 *   description: QR-ready storefront + local payments + delivery zones).
 * · freeLimits — VERBATIM the pricing page's free-plan catalog strings
 *   (pricing/page.tsx plans[]), including the P42-2d cap doctrine:
 *   Smart-Menu's «100 طلب» is a LIFETIME total (never a month-word);
 *   SmartBot's «(100/شهر)» and Smart-Order's «100 طلب شهرياً» ARE real
 *   monthly windows (copy follows enforcement).
 * · paidFrom — the same 19 د.ل every product's live ladder starts at
 *   (pricing/page.tsx ecosystemPricing mirrors, pinned to the
 *   P13-2a-documented sibling sources). Rendered ONLY via formatLyd.
 *   ANTI-DRIFT: tests/unit/worlds.test.ts pins this registry to the
 *   pricing page's own arrays (source-text pins, truth-gate pattern) —
 *   the two files cannot disagree in CI.
 * · signupUrl — SITE.products.*.signupUrl verbatim (P40-5a: conversion
 *   CTAs deep-link the sibling's own signup page).
 */
/* Relative .ts import — deliberate: this registry joins the repo's
 * node:test-importable set (phone/money/site/contact-rules pattern —
 * tests/unit imports it directly), and plain node cannot resolve the
 * @/ alias. allowImportingTsExtensions is on (tsconfig) and Turbopack
 * resolves the explicit extension identically. */
import { SITE } from "../../lib/site.ts"

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
  /** P40-5a (SL-3): the card's CONCRETE action line — each sibling's own
      published CTA vocabulary (verified live 2026-10-31), so the door says
      what you can DO, not just that a world exists. The href stays the
      product ROOT (browsing context); the verb is fulfilled one click
      into the destination (the menu landing opens with «المنيو الحي»،
      the bot landing's own CTA is «جرّب البوت»، the order landing's is
      «اطلب من متجر تجريبي»). */
  cta: string
  /** The giant editorial numeral (Western digits — the mission E1
     *     display contract: every number the UI renders is 1234567890;
     *     money.ts/phone.ts normalize Arabic-Indic INPUT the same way). */
  numeral: string
  /* ── P45-W1 discovery fields (see the module header for sourcing) ── */
  /** Who this world is for (honest audience, sourceable). */
  audience: string
  /** The pain it solves (the problem statement, sourceable). */
  problem: string
  /** The conversion channel the product actually operates. */
  channel: string
  /** Free-plan LIMITS — verbatim the pricing card's catalog strings
      (cap doctrine included; unit-pinned to pricing/page.tsx). */
  freeLimits: readonly [string, string, string]
  /** The lowest paid tier of the product's LIVE ladder (LYD, whole
      dinars) — rendered via formatLyd only; unit-pinned to the pricing
      page's ecosystem mirrors so it can never drift. */
  paidFrom: number
  /** The product's own signup page (SITE.products.*.signupUrl — the
      P40-5a conversion contract). */
  signupUrl: string
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
    cta: "شاهد المنيو الحي",
    numeral: "01",
    /* P45-W1 sourcing: audience/problem/channel —
       docs/projects-comparison.md:27-29 (the repo's own honest doc). */
    audience: "المطاعم والمقاهي وكل نشاط له قائمة طعام أو خدمات",
    problem: "قائمة الورق الثابتة: طباعة متكررة، ولا تحديث فوري، ولا تحليلات للطلبات",
    channel: "الزبون يمسح QR الكود → يتصفح المنيو → يطلب عبر واتساب",
    /* Verbatim the pricing free card (P13-2a catalog) — «100 طلب» is
       Smart-Menu's LIFETIME cap (P42-2d): never a month-word here. */
    freeLimits: ["منيو واحد و10 أصناف", "100 طلب", "طلبات عبر واتساب"],
    /* The live ladder's first paid rung (menu /pricing: أساسي 19). */
    paidFrom: 19,
    signupUrl: SITE.products.menu.signupUrl,
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
    cta: "جرّب البوت",
    numeral: "02",
    /* P45-W1 sourcing: docs/projects-comparison.md:27-29. */
    audience: "أصحاب صفحات فيسبوك التجارية والوكالات التي تدير صفحات متعددة",
    problem: "غرق الصفحة برسائل العملاء وإبطاء الرد عليها",
    channel: "رسالة تصل صفحتك → رد آلي فوري بتصنيف النية",
    /* Verbatim the pricing free card (P19-A catalog) — the reply cap IS
       a real monthly window (bot /api/plans id=1). */
    freeLimits: ["ردود تلقائية (100/شهر)", "صفحة فيسبوك واحدة", "5 قواعد رد"],
    /* The live ladder's first paid rung (bot default-plans: أساسي 19). */
    paidFrom: 19,
    signupUrl: SITE.products.bot.signupUrl,
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
    cta: "اطلب من متجر تجريبي",
    numeral: "03",
    /* P45-W1 sourcing: PRODUCT.md:24-26 audience (storefront businesses
       selling with delivery); the problem is the honest inverse of the
       published claim «الطلبات تصل مرتبة وواضحة» (P45-ROADMAP item 5:
       فوضى الطلب هاتفيًا); the channel folds schema.ts's own order
       description (QR-ready storefront + local payments). */
    audience: "المتاجر التي تبيع منتجاتها وتوصلها لزبائنها",
    problem: "الطلبات الهاتفية المبعثرة: كل طلب يُدوَّن ويُتابع يدويًا",
    channel: "الزبون يفتح متجرك → يطلب ويدفع بطريقة محلية",
    /* Verbatim the pricing free card (r137 catalog) — «100 طلب شهرياً»
       IS a real monthly window (order api/plans enforcement). */
    freeLimits: ["15 منتجاً و3 أقسام", "100 طلب شهرياً", "منطقة توصيل واحدة"],
    /* The live ladder's first paid rung (order FAMILY_PLANS: أساسي 19). */
    paidFrom: 19,
    signupUrl: SITE.products.order.signupUrl,
  },
] as const

/** The glass preview card + chips read this; hero canvas selection too. */
export const worldById = (id: WorldId | null): World | null =>
  WORLDS.find((w) => w.id === id) ?? null
