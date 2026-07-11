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
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass rounded-xl p-6 hover:border-[var(--primary)]/30 transition-all duration-300 group"
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--orange-muted)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
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
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/[0.02] to-transparent pointer-events-none" />
      <div className="container-base">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">لماذا <span className="gradient-text">SmartLink</span>؟</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
            منصة متكاملة تجمع القوة والتقنية والسهولة في مكان واحد
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
