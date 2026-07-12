"use client"
import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  { q: "ما هي منصة SmartLink؟", a: "SmartLink هي منصة رقمية متكاملة تجمع عدة خدمات ذكية تحت مظلة واحدة. حالياً نقدم خدمة Smart Menu (المنيو الرقمي للمطاعم) و SmartBot (البوت الذكي لفيسبوك)، مع خطط لإطلاق المزيد من الخدمات قريباً." },
  { q: "هل الخدمة مجانية؟", a: "نعم، يمكنك البدء مجاناً تماماً بدون بطاقة ائتمان. نوفر خططاً مجانية للخدمات الأساسية، مع خطط مدفوعة للحصول على ميزات متقدمة وتحليلات أكثر." },
  { q: "هل تدعمون اللغة العربية؟", a: "بالتأكيد، المنصة بالكامل باللغة العربية مع دعم اللهجة الليبية في البوت الذكي. واجهات المستخدم، لوحات التحكم، والدعم الفني — كلها بالعربية." },
  { q: "كيف يمكنني البدء؟", a: "فقط قم بإنشاء حساب مجاني، اختر الخدمة التي تناسبك (Smart Menu لمطعمك أو SmartBot لصفحتك على فيسبوك)، واتبع خطوات الإعداد السريعة. فريق الدعم لدينا جاهز لمساعدتك في أي وقت." },
  { q: "هل يمكنني استخدام أكثر من خدمة؟", a: "نعم، يمكنك الاشتراك في جميع خدماتنا من خلال حساب واحد على SmartLink. كل خدمة لها لوحة تحكم مستقلة ولكن برؤية موحدة." },
  { q: "ما هي طرق الدعم المتاحة؟", a: "نقدم دعماً فنياً عبر واتساب، البريد الإلكتروني، وفريق متخصص لمساعدتك في أي استفسار أو مشكلة تقنية." },
]

function FaqItem({ faq, index, open, onToggle }: { faq: typeof faqs[number]; index: number; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
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
    </motion.div>
  )
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="faq" className="section-padding relative">
      <div className="container-base max-w-2xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary font-medium mb-5">
            <Sparkles className="w-3 h-3" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-[-0.01em]">الأسئلة <span className="gradient-text">الشائعة</span></h2>
          <p className="text-muted-foreground text-base">إجابات لأكثر الأسئلة شيوعاً عن منصتنا</p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
