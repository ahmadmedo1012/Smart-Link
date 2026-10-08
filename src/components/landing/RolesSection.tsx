import { Store, Bot } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"

/* r128 Stage B (F2b) — Chapter 05 «المجتمع»: the roles ledger
 * (canonical LandingPage.tsx:616-676 anatomy, PORT-KIT §6 mapping:
 * Link = creator/business). Smart-Link's two real audience segments —
 * restaurant owners (Smart Menu) and Facebook page owners (SmartBot).
 * Desc + quote fold shipped copy from the services/showcase sections;
 * the canonical wider-system trio is intentionally dropped: the
 * coming-soon services already live in the products constellation
 * (repeating them here would violate the ×5-repetition lesson). */

const ROLES = [
  {
    icon: Store, tone: "gold", name: "صاحب المطعم", index: "01",
    desc: "منيو رقمي تفاعلي بصور وأسعار بالدينار الليبي؛ الطلبات تصل مباشرة على واتساب مع لوحة تحكم عربية كاملة.",
    quote: "العميل يطلب مباشرة عبر واتساب بدون تطبيق ولا تسجيل — وأنت تستقبل الطلب فوراً.",
  },
  {
    icon: Bot, tone: "azure", name: "صاحب صفحة فيسبوك", index: "02",
    desc: "أتمتة الردود بذكاء: تصنيف نوايا، ردود تلقائية، بث جماعي، وتقارير مباشرة — كلّها من لوحة عربية واحدة.",
    quote: "لوحة تحكم عربية تُصنّف نوايا العملاء تلقائياً، تردّ على المتكرر، وترفع لك المحادثات المهمة فقط.",
  },
]

export function RolesSection() {
  return (
    <section id="roles" className="ln-chapter ln-roles">
      <div className="ln-chapter-head">
        <span className="ln-label">{"05 — المجتمع"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          جمهوران <em>وتجربة واحدة</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          كل جمهور يجد أدواته جاهزة بالعربية — من الطلب الأول حتى التقارير.
        </RevealCssClass>
      </div>

      <ul className="ln-roles-list">
        {ROLES.map((r, i) => (
          <RevealCssClass as="li" key={r.name} className="ln-role-row" delay={(i + 1) as 1 | 2}>
            <span className="ln-role-key">
              <span className={`ln-role-ico ${r.tone}`} aria-hidden="true">
                <r.icon size={26} strokeWidth={1.7} />
              </span>
              <span className="ln-role-name">{r.name}</span>
              <span className="ln-role-index ln-mono">{r.index}</span>
            </span>
            <div>
              <p className="ln-role-desc">{r.desc}</p>
              <blockquote className="ln-role-quote">
                <span className="ln-role-quote-mark" aria-hidden="true">”</span>
                {r.quote}
              </blockquote>
            </div>
          </RevealCssClass>
        ))}
      </ul>
    </section>
  )
}
