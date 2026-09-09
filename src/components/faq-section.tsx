import { FaqAccordion } from "@/components/faq-accordion"
import { faqJsonLd } from "@/lib/schema"

/* Server component (r6): section chrome + FAQPage structured data render
   on the server; FaqAccordion is the only client island — identical
   architecture to /pricing. The previous version was a full client
   component with its own accordion that animated a FIXED maxHeight of
   200px: any answer taller than that (small screens, long text wraps)
   was silently clipped. The shared .acc grid-rows island auto-sizes to
   content, carries aria-controls/aria-labelledby wiring, and costs the
   home bundle one island instead of a bespoke implementation. */

const faqs = [
  { q: "ما هي منصة SmartLink؟", a: "SmartLink هي منصة رقمية متكاملة تجمع عدة خدمات ذكية تحت مظلة واحدة. حالياً نقدم خدمة Smart Menu (المنيو الرقمي للمطاعم) وSmartBot (البوت الذكي لفيسبوك)، مع خطط لإطلاق المزيد من الخدمات قريباً." },
  { q: "هل الخدمة مجانية؟", a: "نعم، يمكنك البدء مجاناً تماماً بدون بطاقة ائتمان. نوفر خططاً مجانية للخدمات الأساسية، وستُطلَق قريباً خطط مدفوعة لميزات متقدمة وتحليلات أكثر." },
  { q: "هل تدعمون اللغة العربية؟", a: "بالتأكيد، المنصة بالكامل باللغة العربية مع دعم اللهجة الليبية في البوت الذكي. واجهات المستخدم، لوحات التحكم، والدعم الفني — كلها بالعربية." },
  { q: "كيف يمكنني البدء؟", a: "فقط قم بإنشاء حساب مجاني، اختر الخدمة التي تناسبك (Smart Menu لمطعمك أو SmartBot لصفحتك على فيسبوك)، واتبع خطوات الإعداد السريعة. فريق الدعم لدينا جاهز لمساعدتك في أي وقت." },
  { q: "هل يمكنني استخدام أكثر من خدمة؟", a: "نعم، يمكنك الاشتراك في جميع خدماتنا من خلال حساب واحد على SmartLink. كل خدمة لها لوحة تحكم مستقلة ولكن برؤية موحدة." },
  { q: "ما هي طرق الدعم المتاحة؟", a: "نقدم دعماً فنياً عبر واتساب، البريد الإلكتروني، وفريق متخصص لمساعدتك في أي استفسار أو مشكلة تقنية." },
]

/* Rich results: the homepage's six real Q&As become FAQPage-eligible
   (parity with /pricing, which already shipped this schema).
   r10: shared builder from lib/schema. */
const faqLd = faqJsonLd(faqs)

export function FaqSection() {
  return (
    <section id="faq" className="section-padding relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="container-base max-w-2xl">
        <div className="reveal-scroll text-center mb-12">
          <div className="eyebrow-badge mb-5">
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-[-0.01em]">الأسئلة الشائعة</h2>
          <p className="text-muted-foreground text-base">إجابات لأكثر الأسئلة شيوعاً عن منصتنا</p>
        </div>
        <FaqAccordion faqs={faqs} className="reveal-scroll-stagger space-y-3" />
      </div>
    </section>
  )
}
