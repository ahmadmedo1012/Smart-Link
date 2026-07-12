"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Layers, Bot, BarChart3, Wallet, HeadphonesIcon, QrCode } from "lucide-react"

const features = [
  { icon: Layers, title: "منصة موحدة", description: "جميع خدماتك الرقمية في مكان واحد برؤية موحدة وتجربة مستخدم متكاملة." },
  { icon: Bot, title: "ذكاء اصطناعي", description: "تقنيات ذكاء اصطناعي متطورة لأتمتة الردود وتحليل البيانات وفهم العملاء." },
  { icon: BarChart3, title: "تحليلات متقدمة", description: "تقارير وإحصائيات دقيقة تساعدك على اتخاذ قرارات أفضل لنمو أعمالك." },
  { icon: Wallet, title: "مجاني للبدء", description: "ابدأ مجاناً بدون بطاقة ائتمان. خطط مرنة تناسب جميع الأحجام." },
  { icon: HeadphonesIcon, title: "دعم فني متكامل", description: "فريق دعم متاح 24/7 لمساعدتك في أي وقت عبر واتساب والبريد الإلكتروني." },
  { icon: QrCode, title: "تقنيات حديثة", description: "أحدث التقنيات في الواجهات التفاعلية، QR كود، والربط مع واتساب وفيسبوك." },
]

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-[16px] p-6 group"
    >
      <div className="w-11 h-11 rounded-xl bg-[var(--accent)] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-200">
        <Icon className="w-5 h-5 text-[var(--primary)]" />
      </div>
      <h3 className="font-bold text-[var(--foreground)] mb-1.5">{feature.title}</h3>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="features" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/[0.02] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="container-base">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">لماذا <span className="gradient-text">SmartLink</span>؟</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-base leading-relaxed">
            منصة متكاملة تجمع القوة والتقنية والسهولة في مكان واحد
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
