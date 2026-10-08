import { MessageCircle, Bot, QrCode, Link2 } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"

/* r128 Stage B (F2b) — Chapter 04 «المنصّات»: the ground plate
 * (campus→platforms per PORT-KIT §6). Smart-Link's ground is not a
 * campus photo (no new image binaries; the flat grammar needs none) —
 * it is the channel world the products live on. Flat ink-2 band,
 * hairline cells, tone-coded wells. Every cell traces to shipped copy:
 * WhatsApp orders + 24/7 support, the Facebook bot, the custom QR, and
 * the one-link-everywhere concept. */

const PLATFORMS = [
  {
    icon: MessageCircle, tone: "gold", name: "واتساب",
    desc: "طلبات المنيو تصلك لحظة إرسالها، والدعم متاح على مدار الساعة.",
    tag: "24/7",
  },
  {
    icon: Bot, tone: "azure", name: "فيسبوك",
    desc: "البوت الذكي يردّ على رسائل صفحتك ويصنّف نوايا العملاء تلقائياً.",
    tag: "AUTO",
  },
  {
    icon: QrCode, tone: "mist", name: "QR كود",
    desc: "رمز مخصّص لكل طاولة وخدمة — امسحه واطلب في ثوانٍ بدون تطبيق.",
    tag: "SCAN",
  },
  {
    icon: Link2, tone: "gold", name: "الرابط الذكي",
    desc: "رابط واحد في كل مكان — على فيسبوك، إنستغرام، أو واتساب.",
    tag: "ONE LINK",
  },
]

export function PlatformsSection() {
  return (
    <section id="platforms" className="ln-chapter ln-platforms">
      <div className="ln-chapter-head">
        <span className="ln-label">{"04 — المنصّات"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          أينما كان <em>جمهورك</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          خدماتنا تعمل على القنوات التي يعرفها عملاؤك بالفعل — بدون تطبيقات،
          بدون تسجيل، بدون تعقيد.
        </RevealCssClass>
      </div>

      <RevealCssClass as="div" delay={2}>
        <div className="ln-platforms-grid">
          {PLATFORMS.map((p) => (
            <article key={p.name} className="ln-platform-cell">
              <span className={`ln-platform-ico ${p.tone}`} aria-hidden="true">
                <p.icon size={26} strokeWidth={1.7} />
              </span>
              <h3 className="ln-platform-name">{p.name}</h3>
              <p className="ln-platform-desc">{p.desc}</p>
              <span className="ln-platform-tag ln-mono">{p.tag}</span>
            </article>
          ))}
        </div>
      </RevealCssClass>
    </section>
  )
}
