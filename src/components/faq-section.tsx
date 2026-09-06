"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  { q: "ما هي منصة SmartLink؟", a: "SmartLink هي منصة رقمية متكاملة تجمع عدة خدمات ذكية تحت مظلة واحدة. حالياً نقدم خدمة Smart Menu (المنيو الرقمي للمطاعم) و SmartBot (البوت الذكي لفيسبوك)، مع خطط لإطلاق المزيد من الخدمات قريباً." },
  { q: "هل الخدمة مجانية؟", a: "نعم، يمكنك البدء مجاناً تماماً بدون بطاقة ائتمان. نوفر خططاً مجانية للخدمات الأساسية، مع خطط مدفوعة للحصول على ميزات متقدمة وتحليلات أكثر." },
  { q: "هل تدعمون اللغة العربية؟", a: "بالتأكيد، المنصة بالكامل باللغة العربية مع دعم اللهجة الليبية في البوت الذكي. واجهات المستخدم، لوحات التحكم، والدعم الفني - كلها بالعربية." },
  { q: "كيف يمكنني البدء؟", a: "فقط قم بإنشاء حساب مجاني، اختر الخدمة التي تناسبك (Smart Menu لمطعمك أو SmartBot لصفحتك على فيسبوك)، واتبع خطوات الإعداد السريعة. فريق الدعم لدينا جاهز لمساعدتك في أي وقت." },
  { q: "هل يمكنني استخدام أكثر من خدمة؟", a: "نعم، يمكنك الاشتراك في جميع خدماتنا من خلال حساب واحد على SmartLink. كل خدمة لها لوحة تحكم مستقلة ولكن برؤية موحدة." },
  { q: "ما هي طرق الدعم المتاحة؟", a: "نقدم دعماً فنياً عبر واتساب، البريد الإلكتروني، وفريق متخصص لمساعدتك في أي استفسار أو مشكلة تقنية." },
]

function FaqItem({ faq, index, open, onToggle }: { faq: typeof faqs[number]; index: number; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl overflow-hidden transition-all duration-300",
        open && "bg-[var(--surface-raised)] border-[var(--ring)]/20"
      )}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        id={`faq-trigger-${index}`}
        className="flex items-center justify-between w-full px-6 py-4 text-sm font-medium text-foreground hover:bg-[var(--accent)] transition-all duration-200 text-start"
      >
        <span>{faq.q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-all duration-300", open && "rotate-180 text-primary")} />
      </button>
      <div
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
        className="overflow-hidden transition-all duration-[var(--move-base)] ease-[var(--ease-smooth)]"
        style={{ maxHeight: open ? "200px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
      </div>
    </div>
  )
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="section-padding relative">
      <div className="container-base max-w-2xl">
        <div className="reveal-scroll text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary-text font-medium mb-5">
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-[-0.01em]">الأسئلة الشائعة</h2>
          <p className="text-muted-foreground text-base">إجابات لأكثر الأسئلة شيوعاً عن منصتنا</p>
        </div>
        <div className="reveal-scroll-stagger space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
