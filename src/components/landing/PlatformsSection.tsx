import { MessageCircle, Bot, QrCode, Link2 } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"

/* r142 «الكوكبة الحية» — the GROUND CONTROL console (platforms chapter).
 * The old 4-card grid becomes a mission-control console: a full-width
 * framed panel with a mono status strip and hairline-divided cells —
 * the channel world the products live on. Every cell still traces to
 * shipped copy (WhatsApp orders + a direct human line, the Facebook
 * bot, the custom QR, the one-link concept). The chapter stays
 * UNLABELLED (canonical ruling — the sequence keeps its breathing hole
 * here). r144 (صدق P4-4SL): «24/7» كانت ادعاءً بلا عملية دعم خلفه —
 * الخلية تعد بقناة واتساب حقيقية وطلبات لحظية، والوسم INSTANT يطابق
 * «تصلك لحظة إرسالها» الحقيقة. */

const PLATFORMS = [
  {
    icon: MessageCircle, tone: "gold", name: "واتساب",
    desc: "طلبات المنيو تصلك لحظة إرسالها، وتواصل مباشر مع الفريق على واتساب.",
    tag: "INSTANT",
  },
  {
    icon: Bot, tone: "signal", name: "فيسبوك",
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
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          أينما كان <em>جمهورك</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          خدماتنا تعمل على القنوات التي يعرفها عملاؤك بالفعل — بدون تطبيقات،
          بدون تسجيل، بدون تعقيد.
        </RevealCssClass>
      </div>

      <RevealCssClass as="div" delay={2}>
        <div className="ln-ground">
          {/* the console status strip (decorative chrome) */}
          <div className="ln-ground-status" aria-hidden="true">
            <span className="ln-mono">GROUND CONTROL · القنوات الأرضية</span>
            <span className="ln-ground-tag ln-mono">NO APP · NO SIGNUP</span>
          </div>

          <div className="ln-ground-grid">
            {PLATFORMS.map((p) => (
              <article key={p.name} className="ln-ground-cell">
                <span className={`ln-platform-ico ${p.tone}`} aria-hidden="true">
                  <p.icon size={24} strokeWidth={1.7} />
                </span>
                <h3 className="ln-ground-name">{p.name}</h3>
                <p className="ln-ground-desc">{p.desc}</p>
                <span className="ln-ground-cell-tag ln-mono">{p.tag}</span>
              </article>
            ))}
          </div>
        </div>
      </RevealCssClass>
    </section>
  )
}
