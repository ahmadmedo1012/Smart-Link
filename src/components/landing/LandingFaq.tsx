import { ChevronDown } from "lucide-react"
import { RevealCssClass } from "@/hooks/useReveal"
import { faqJsonLd } from "@/lib/schema"

/* r128 Stage B (F2b) — the compact FAQ that follows the finale, ln-styled
 * per the task mandate. The home's six real Q&As move here verbatim
 * (folded from faq-section.tsx — r9/r10 content audits preserved), the
 * FAQPage JSON-LD rides along (rich-results parity with /pricing), and
 * the interaction drops from a client accordion island to native
 * <details>/<summary>: zero JS, keyboard-native, reduced-motion-safe. */

const FAQS = [
  { q: "ما هي منصة SmartLink؟", a: "SmartLink هي منصة رقمية متكاملة تجمع عدة خدمات ذكية تحت مظلة واحدة. حالياً نقدم خدمة Smart Menu (المنيو الرقمي للمطاعم) وSmartBot (البوت الذكي لفيسبوك)، مع خطط لإطلاق المزيد من الخدمات قريباً." },
  { q: "هل الخدمة مجانية؟", a: "نعم، يمكنك البدء مجاناً تماماً بدون بطاقة ائتمان. نوفر خططاً مجانية للخدمات الأساسية، وستُطلَق قريباً خطط مدفوعة لميزات متقدمة وتحليلات أكثر." },
  { q: "هل تدعمون اللغة العربية؟", a: "بالتأكيد، المنصة بالكامل باللغة العربية مع دعم اللهجة الليبية في البوت الذكي. واجهات المستخدم، لوحات التحكم، والدعم الفني — كلها بالعربية." },
  { q: "كيف يمكنني البدء؟", a: "فقط قم بإنشاء حساب مجاني، اختر الخدمة التي تناسبك (Smart Menu لمطعمك أو SmartBot لصفحتك على فيسبوك)، واتبع خطوات الإعداد السريعة. فريق الدعم لدينا جاهز لمساعدتك في أي وقت." },
  { q: "هل يمكنني استخدام أكثر من خدمة؟", a: "نعم، يمكنك الاشتراك في جميع خدماتنا من خلال حساب واحد على SmartLink. كل خدمة لها لوحة تحكم مستقلة ولكن برؤية موحدة." },
  { q: "ما هي طرق الدعم المتاحة؟", a: "نقدم دعماً فنياً عبر واتساب، البريد الإلكتروني، وفريق متخصص لمساعدتك في أي استفسار أو مشكلة تقنية." },
]

const faqLd = faqJsonLd(FAQS)

export function LandingFaq() {
  return (
    <section className="ln-faq" aria-label="الأسئلة الشائعة">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="ln-faq-head">
        <span className="ln-label">{"06 — الأسئلة الشائعة"}</span>
        <RevealCssClass as="h2" className="ln-chapter-title" delay={1}>
          الأسئلة <em>الشائعة</em>
        </RevealCssClass>
        <RevealCssClass as="p" className="ln-chapter-lede" delay={2}>
          إجابات لأكثر الأسئلة شيوعاً عن منصتنا.
        </RevealCssClass>
      </div>
      <div className="ln-faq-list">
        {FAQS.map((f, i) => (
          <RevealCssClass as="details" className="ln-faq-item" key={f.q} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
            <summary className="ln-faq-q">
              {f.q}
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <p className="ln-faq-a">{f.a}</p>
          </RevealCssClass>
        ))}
      </div>
    </section>
  )
}
