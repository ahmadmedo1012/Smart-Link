"use client"
import { Layers, Bot, BarChart3, Wallet, HeadphonesIcon, QrCode } from "lucide-react"

const features = [
  { icon: Layers, title: "منصة موحدة", description: "جميع خدماتك الرقمية في مكان واحد برؤية موحدة وتجربة مستخدم متكاملة." },
  { icon: Bot, title: "ذكاء اصطناعي", description: "تقنيات ذكاء اصطناعي متطورة لأتمتة الردود وتحليل البيانات وفهم العملاء." },
  { icon: BarChart3, title: "تحليلات متقدمة", description: "تقارير وإحصائيات دقيقة تساعدك على اتخاذ قرارات أفضل لنمو أعمالك." },
  { icon: Wallet, title: "مجاني للبدء", description: "ابدأ مجاناً بدون بطاقة ائتمان. خطط مرنة تناسب جميع الأحجام." },
  { icon: HeadphonesIcon, title: "دعم فني متكامل", description: "فريق دعم متاح 24/7 لمساعدتك في أي وقت عبر واتساب والبريد الإلكتروني." },
  { icon: QrCode, title: "تقنيات حديثة", description: "أحدث التقنيات في الواجهات التفاعلية، QR كود، والربط مع واتساب وفيسبوك." },
]

export function FeaturesSection() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/[0.02] to-transparent pointer-events-none" />
      <div className="container-base">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">لماذا SmartLink؟</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
            منصة متكاملة تجمع القوة والتقنية والسهولة في مكان واحد
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-xl p-6 hover:border-[var(--primary)]/30 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-[var(--orange-muted)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h3 className="font-bold text-[var(--foreground)] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
