import { Network } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { SITE } from "@/lib/site"

/* r128 Stage B (F2b) — Chapter 01 «الاكتشاف»: the products constellation
 * (colleges→products per PORT-KIT §6). Server component: the sky chart is
 * a static SVG (dashed hairline rings) + DOM overlay dots with CSS-only
 * tooltips; the real names live in the focusable dots, the mobile chips
 * strip and the note. Content = the services section's real registry:
 * two live products + the six coming-soon services, nothing invented. */

const LIME_DOT = "var(--ln-lime)"
const DIM_DOT = "rgba(245,243,231,0.45)"

/** Live products — lime nodes on the inner orbits. */
const LIVE = [
  { name: "Smart Menu", sub: "المنيو الرقمي للمطاعم", href: SITE.products.menu.url, left: "40.8%", top: "35.6%" },
  { name: "SmartBot", sub: "البوت الذكي لفيسبوك", href: SITE.products.bot.url, left: "68.1%", top: "36.8%" },
]

/** Coming-soon services (services section «قريباً» registry) — dim nodes
 *  on the outer orbit; positions from polar math on r=270. */
const COMING = [
  { name: "متجر إلكتروني", left: "24.6%", top: "35.6%" },
  { name: "حجوزات مواعيد", left: "23.4%", top: "57.3%" },
  { name: "منصة تسويق", left: "29.3%", top: "77.1%" },
  { name: "مساعد ذكي", left: "63.5%", top: "86.5%" },
  { name: "فواتير إلكترونية", left: "74.6%", top: "67.7%" },
  { name: "تطبيق موبايل", left: "57%", top: "9.3%" },
]

/** The full registry for the mobile chips strip (all 8, accessible). */
const CHIPS = [
  { name: "Smart Menu", count: "01", dot: LIME_DOT },
  { name: "SmartBot", count: "02", dot: LIME_DOT },
  ...COMING.map((c, i) => ({ name: c.name, count: String(i + 3).padStart(2, "0"), dot: DIM_DOT })),
]

export function ProductsSection() {
  return (
    <section id="products" className="ln-chapter ln-products">
      <div className="ln-chapter-head">
        <span className="ln-label">{"01 — الاكتشاف"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          منتجان نشطان في <em>مدارٍ واحد</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          مدار SmartLink ينتظم حول حلولٍ تعمل الآن — منيو رقمي للمطاعم وبوت
          ذكي لفيسبوك — وستّ خدمات قادمة تشغل بقية المدار.
        </RevealCssClass>
      </div>

      <RevealCssClass as="div" delay={2}>
        <div className="ln-constellation">
          {/* the sky chart — dashed hairline rings, flat violet heart */}
          <div className="ln-constellation-stage">
            <svg className="ln-constellation-svg" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
              <circle className="ln-constellation-ring" style={{ ["--ln-ri" as string]: 0 }} cx={500} cy={320} r={130} />
              <circle className="ln-constellation-ring" style={{ ["--ln-ri" as string]: 1 }} cx={500} cy={320} r={200} />
              <circle className="ln-constellation-ring" style={{ ["--ln-ri" as string]: 2 }} cx={500} cy={320} r={270} />
            </svg>

            {/* live products — focusable pins that open the real products */}
            {LIVE.map((p, i) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ln-constellation-dot"
                style={{ left: p.left, top: p.top, ["--dot" as string]: LIME_DOT, ["--ln-ci" as string]: i }}
                aria-label={`${p.name} — ${p.sub}، رابط خارجي`}
              >
                <span className="ln-constellation-tip">
                  <b>{p.name}</b>
                  <i>{p.sub} — يعمل الآن</i>
                </span>
              </a>
            ))}

            {/* coming-soon services — decorative dim pins (names live in
                the chips strip below, which is the accessible copy) */}
            {COMING.map((c, i) => (
              <span
                key={c.name}
                className="ln-constellation-dot"
                aria-hidden="true"
                style={{ left: c.left, top: c.top, ["--dot" as string]: DIM_DOT, ["--ln-ci" as string]: i + 2 }}
              >
                <span className="ln-constellation-tip">
                  <b>{c.name}</b>
                  <i>قريباً</i>
                </span>
              </span>
            ))}
          </div>

          {/* the domain strip — carries the full registry accessibly
              (desktop keeps the sky chart; phones get these chips) */}
          <ul className="ln-constellation-strip">
            {CHIPS.map((c) => (
              <li key={c.name} className="ln-constellation-chip">
                <span className="ln-constellation-chip-dot" style={{ background: c.dot }} aria-hidden="true" />
                <span className="ln-constellation-chip-label">{c.name}</span>
                <span className="ln-constellation-chip-count">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </RevealCssClass>

      <RevealCssClass as="p" className="ln-products-note" delay={3}>
        <Network size={14} aria-hidden="true" />
        منظومة موحَّدة: حساب واحد، واجهات عربية كاملة، ودعم واتساب على مدار
        الساعة — تجربة واحدة متّسقة لكل خدمة.
      </RevealCssClass>
    </section>
  )
}
