import { ArrowLeft } from "lucide-react"
import type { CSSProperties, JSX, ReactNode } from "react"
import { RevealCssClass } from "@/hooks/useReveal"
import { WORLDS, type World } from "./worlds"

/* r142 «الكوكبة الحية» — Chapter 01 «العوالم»: the editorial worlds
 * chapter that REPLACES the old products-constellation + roles-ledger
 * pair. Three full-bleed world panels, asymmetrically alternated — each
 * product is a WORLD in its own hue (--ln-world token per panel: ember /
 * cyan / lime), a giant Arabic-Indic numeral, exactly THREE real claims
 * folded from the page's shipped copy, and a CTA to its LIVE domain.
 *
 * The visual column is an ORIGINAL composition per product (pure CSS
 * mock, aria-hidden, zero images, zero invented data — skeletons stand
 * for content, never fake numbers/names):
 *   · MenuMock  — a menu window: category chips + dish rows with
 *     skeleton names/prices (prices stay abstract: no invented LYD).
 *   · BotMock   — a page inbox: incoming bubble + intent chip + auto
 *     reply (the real تصنيف النوايا / ردود تلقائية story).
 *   · OrderMock — a store grid + an order ticket with the REAL
 *     دفع محلي / توصيل chips.
 * Layout is explicit grid placement (grid-column), which keeps the
 * alternation stable under RTL without any physical left/right. */

function MockFrame({ host, children }: { host: string; children: ReactNode }) {
  return (
    <div className="ln-mock">
      <div className="ln-mock-bar" aria-hidden="true">
        <span className="ln-mock-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="ln-mock-host ln-mono">{host}</span>
      </div>
      <div className="ln-mock-body">{children}</div>
    </div>
  )
}

function MenuMock() {
  return (
    <MockFrame host="menu.smart-link.ly">
      <div className="ln-mock-chips" aria-hidden="true">
        <span className="ln-mock-chip is-active">الأطباق الرئيسية</span>
        <span className="ln-mock-chip">المقبلات</span>
        <span className="ln-mock-chip">المشروبات</span>
      </div>
      <div className="ln-mock-rows">
        {[64, 46, 54].map((wdt, i) => (
          <div className="ln-mock-row" key={i}>
            <span className="ln-mock-thumb" aria-hidden="true" />
            <span className="ln-mock-lines" aria-hidden="true">
              <i style={{ inlineSize: `${wdt}%` }} />
              <i style={{ inlineSize: `${100 - wdt}%` }} />
            </span>
            <span className="ln-mock-price" aria-hidden="true" />
          </div>
        ))}
      </div>
    </MockFrame>
  )
}

function BotMock() {
  return (
    <MockFrame host="bot.smart-link.ly">
      <div className="ln-mock-chat">
        <div className="ln-mock-bubble is-in">
          <span className="ln-mock-line" style={{ inlineSize: "78%" }} aria-hidden="true" />
          <span className="ln-mock-line" style={{ inlineSize: "52%" }} aria-hidden="true" />
          <span className="ln-mock-intent ln-mono">INTENT · منيو</span>
        </div>
        <div className="ln-mock-bubble is-out">
          <span className="ln-mock-line" style={{ inlineSize: "84%" }} aria-hidden="true" />
          <span className="ln-mock-line" style={{ inlineSize: "38%" }} aria-hidden="true" />
          <span className="ln-mock-auto ln-mono">AUTO REPLY</span>
        </div>
        <div className="ln-mock-typing" aria-hidden="true">
          <i /><i /><i />
        </div>
      </div>
    </MockFrame>
  )
}

function OrderMock() {
  return (
    <MockFrame host="order.smart-link.ly">
      <div className="ln-mock-grid" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span className="ln-mock-tile" key={i}>
            <i className="ln-mock-tile-art" />
            <i className="ln-mock-tile-line" />
          </span>
        ))}
      </div>
      <div className="ln-mock-ticket">
        <span className="ln-mock-ticket-head ln-mono">ORDER · طلب جديد</span>
        <span className="ln-mock-line" style={{ inlineSize: "70%" }} aria-hidden="true" />
        <span className="ln-mock-line" style={{ inlineSize: "45%" }} aria-hidden="true" />
        <span className="ln-mock-chips" aria-hidden="true">
          <span className="ln-mock-chip is-active">دفع محلي</span>
          <span className="ln-mock-chip">توصيل</span>
        </span>
      </div>
    </MockFrame>
  )
}

const MOCKS: Record<World["id"], () => JSX.Element> = {
  menu: MenuMock,
  bot: BotMock,
  order: OrderMock,
}

export function WorldsSection() {
  return (
    <section id="products" className="ln-chapter ln-worlds">
      <div className="ln-chapter-head">
        <span className="ln-label">{"01 — العوالم"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          ثلاثة عوالم تعمل <em>الآن</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          لكل منتجٍ عالمه الخاص بلونه وترابه: منيوٌ يتفاعل، وبوتٌ يردّ،
          ومتجرٌ يبيع — كل عالم يفتح من نطاقه الحي مباشرة.
        </RevealCssClass>
      </div>

      <div className="ln-worlds-list">
        {WORLDS.map((w, i) => {
          const Mock = MOCKS[w.id]
          return (
            <RevealCssClass
              as="article"
              key={w.id}
              className={`ln-world${i % 2 === 1 ? " ln-world--flip" : ""}`}
              style={{ "--ln-world": `var(${w.token})` } as CSSProperties}
              delay={1}
            >
              <span className="ln-world-num" aria-hidden="true">{w.numeral}</span>

              <div className="ln-world-body">
                <span className="ln-world-host ln-mono">{w.host}</span>
                <h3 className="ln-world-name">{w.name}</h3>
                <p className="ln-world-sub">{w.sub}</p>
                <ul className="ln-world-claims">
                  {w.claims.map((c) => (
                    <li key={c}>
                      <span className="ln-world-claim-dot" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
                <a
                  className="ln-world-cta"
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ادخل عالم ${w.name} — النطاق الحي، رابط خارجي`}
                >
                  ادخل عالم {w.name}
                  <ArrowLeft size={15} aria-hidden="true" />
                </a>
              </div>

              <div className="ln-world-stage" aria-hidden="true">
                <Mock />
              </div>
            </RevealCssClass>
          )
        })}
      </div>
    </section>
  )
}
