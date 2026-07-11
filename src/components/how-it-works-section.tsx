"use client"
import { UserPlus, Palette, Share2 } from "lucide-react"

const steps = [
  { icon: UserPlus, title: "إنشاء حساب مجاني", description: "سجل حسابك مجاناً بدون أي بطاقة ائتمان. ابدأ رحلتك الرقمية في دقائق." },
  { icon: Palette, title: "اختيار الخدمة", description: "اختر الخدمة التي تناسب عملك — منيو رقمي لمطعمك أو بوت ذكي لصفحتك." },
  { icon: Share2, title: "انطلق وابدأ", description: "شارك الرابط مع عملائك وابدأ في استقبال الطلبات والردود بشكل آلي." },
]

export function HowItWorksSection() {
  return (
    <section className="section-padding relative">
      <div className="container-base">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">كيف تعمل المنصة؟</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">ثلاث خطوات بسيطة لتبدأ رحلتك الرقمية</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[var(--orange-muted)] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
