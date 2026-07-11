"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  { q: "ما هي منصة SmartLink؟", a: "SmartLink هي منصة رقمية متكاملة تجمع عدة خدمات ذكية تحت مظلة واحدة. حالياً نقدم خدمة Smart Menu (المنيو الرقمي للمطاعم) و SmartBot (البوت الذكي لفيسبوك)، مع خطط لإطلاق المزيد من الخدمات قريباً." },
  { q: "هل الخدمة مجانية؟", a: "نعم، يمكنك البدء مجاناً تماماً بدون بطاقة ائتمان. نوفر خططاً مجانية للخدمات الأساسية، مع خطط مدفوعة للحصول على ميزات متقدمة وتحليلات أكثر." },
  { q: "هل تدعمون اللغة العربية؟", a: "بالتأكيد، المنصة بالكامل باللغة العربية مع دعم اللهجة الليبية في البوت الذكي. واجهات المستخدم، لوحات التحكم، والدعم الفني — كلها بالعربية." },
  { q: "كيف يمكنني البدء؟", a: "فقط قم بإنشاء حساب مجاني، اختر الخدمة التي تناسبك (Smart Menu لمطعمك أو SmartBot لصفحتك على فيسبوك)، واتبع خطوات الإعداد السريعة. فريق الدعم لدينا جاهز لمساعدتك في أي وقت." },
  { q: "هل يمكنني استخدام أكثر من خدمة؟", a: "نعم، يمكنك الاشتراك في جميع خدماتنا من خلال حساب واحد على SmartLink. كل خدمة لها لوحة تحكم مستقلة ولكن برؤية موحدة." },
  { q: "ما هي طرق الدعم المتاحة؟", a: "نقدم دعماً فنياً عبر واتساب، البريد الإلكتروني، وفريق متخصص لمساعدتك في أي استفسار أو مشكلة تقنية." },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section-padding relative">
      <div className="container-base max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">الأسئلة الشائعة</h2>
          <p className="text-[var(--muted-foreground)]">إجابات لأكثر الأسئلة شيوعاً عن منصتنا</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors text-left"
              >
                <span>{faq.q}</span>
                <ChevronDown className={cn("w-4 h-4 text-[var(--muted-foreground)] transition-transform duration-300 shrink-0", open === i && "rotate-180")} />
              </button>
              <div className={cn("overflow-hidden transition-all duration-300", open === i ? "max-h-96" : "max-h-0")}>
                <p className="px-5 pb-4 text-sm text-[var(--muted-foreground)] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
