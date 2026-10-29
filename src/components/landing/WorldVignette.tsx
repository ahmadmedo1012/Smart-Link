/* P31-A (r160 KODE) — the product vignettes: the visual anchor layer of
 * the worlds chapter. The audit truth this component answers: the r160
 * type-cards left a first-time visitor with ZERO visual anchor for what
 * each product IS — name, domain, three claims, no UI glimpse. Each
 * world card now carries a compact, deterministic, PURE-CSS «mini
 * product-UI» panel beside its type:
 *
 *   menu  → the menu-card vignette (geometric plate motif + 2 dish rows
 *           with price chips + a tiny QR corner mark)
 *   bot   → the chat-thread vignette (incoming grey bubble, outgoing
 *           orange bot bubble with a delivery checkmark, three-dot
 *           typing indicator pinned to the thread foot)
 *   order → the order-ticket vignette (store header + orange-soft
 *           status pill, 2 item lines with qty + price, dashed
 *           hairline, the total row, a delivery line with a CSS pin)
 *
 * HARD LAWS of this module:
 * · ZERO hex, ZERO inline styles, ZERO Tailwind — every className is an
 *   ln-* plain class painted in landing.css (the landing-layer hard
 *   isolation law; the r142 worlds.ts rule extends to this sibling).
 * · aria-hidden="true" on every variant root — the panels are purely
 *   decorative illustrative chrome: generic content only, no fake
 *   claims, nothing a screen reader needs (the real claims + the live
 *   link live in the card's type side).
 * · The copy is generic UI furniture whose arithmetic is TRUE and
 *   consistent across the vignettes: 29 + 8 د.ل menu prices → ×2 +
 *   ×2 = 58 + 16 = the ticket's «الإجمالي 74 د.ل»; the bot's «45
 *   دقيقة» delivery promise is the same line the ticket's foot echoes.
 * · Western digits only (E1 — the e2e western-digits contract).
 * · No animation, no JS — a static frame at every rung (reduced-motion
 *   safe by construction; the only motion is the row-hover border
 *   brighten + 2px lift, declared in landing.css).
 */

import type { WorldId } from "./worlds"

export function WorldVignette({ id }: { id: WorldId }) {
  if (id === "menu") {
    return (
      <div className="ln-world-viz ln-world-viz--menu" aria-hidden="true">
        <span className="ln-viz-menu-thumb">
          <span className="ln-viz-menu-plate" />
          <span className="ln-viz-menu-core" />
        </span>
        <div className="ln-viz-menu-row">
          <span className="ln-viz-menu-name">طبق اليوم</span>
          <span className="ln-viz-menu-price">29 د.ل</span>
        </div>
        <div className="ln-viz-menu-row">
          <span className="ln-viz-menu-name">مشروب المنزل</span>
          <span className="ln-viz-menu-price">8 د.ل</span>
        </div>
        <div className="ln-viz-menu-foot">
          <span className="ln-viz-menu-qr" />
          <span className="ln-viz-menu-scan">امسح الكود</span>
        </div>
      </div>
    )
  }

  if (id === "bot") {
    return (
      <div className="ln-world-viz ln-world-viz--bot" aria-hidden="true">
        <p className="ln-viz-chat-in">السلام عليكم، عندكم توصيل؟</p>
        <p className="ln-viz-chat-out">
          <span className="ln-viz-chat-text">أهلاً! نوصّل داخل بنغازي خلال 45 دقيقة</span>
          <span className="ln-viz-chat-check" />
        </p>
        <div className="ln-viz-chat-typing" />
      </div>
    )
  }

  return (
    <div className="ln-world-viz ln-world-viz--order" aria-hidden="true">
      <div className="ln-viz-ticket-head">
        <span className="ln-viz-ticket-store">مطعمك</span>
        <span className="ln-viz-ticket-status">قيد التحضير</span>
      </div>
      <div className="ln-viz-ticket-item">
        <span className="ln-viz-ticket-name">طبق اليوم</span>
        <span className="ln-viz-ticket-qty">×2</span>
        <span className="ln-viz-ticket-price">58 د.ل</span>
      </div>
      <div className="ln-viz-ticket-item">
        <span className="ln-viz-ticket-name">مشروب المنزل</span>
        <span className="ln-viz-ticket-qty">×2</span>
        <span className="ln-viz-ticket-price">16 د.ل</span>
      </div>
      <div className="ln-viz-ticket-sep" />
      <div className="ln-viz-ticket-total">
        <span className="ln-viz-ticket-label">الإجمالي</span>
        <span className="ln-viz-ticket-sum">74 د.ل</span>
      </div>
      <div className="ln-viz-ticket-delivery">
        <span className="ln-viz-ticket-pin" />
        <span className="ln-viz-ticket-zone">توصيل داخل بنغازي · 45 دقيقة</span>
      </div>
    </div>
  )
}
