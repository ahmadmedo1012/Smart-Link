"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Smartphone, Bot, Sparkles } from "lucide-react"

const services = [
  {
    title: "Smart Menu",
    subtitle: "المنيو الرقمي للمطاعم",
    description: "حول منيو مطعمك إلى تجربة رقمية تفاعلية. طلبات تصل مباشرة على واتساب مع لوحة تحكم عربية كاملة.",
    href: "https://menu.smart-link.ly",
    icon: Smartphone,
    features: ["منيو رقمي تفاعلي", "طلبات عبر واتساب", "برنامج ولاء وإحالات", "إحصائيات وتحليلات", "QR كود مخصص", "لوحة تحكم عربية"],
    gradient: "gradient-smart-menu",
    iconBg: "from-amber-400/20 to-orange-500/20",
  },
  {
    title: "SmartBot",
    subtitle: "البوت الذكي لفيسبوك",
    description: "أتمتة الردود على صفحات فيسبوك بذكاء. ردود تلقائية، تصنيف نوايا، وإدارة متكاملة للمحادثات.",
    href: "https://bot.smart-link.ly",
    icon: Bot,
    features: ["ردود تلقائية ذكية", "تصنيف النوايا", "لوحة تحكم متكاملة", "تقارير وتحليلات", "بث جماعي", "إدارة الصفحات"],
    gradient: "gradient-smart-bot",
    iconBg: "from-violet-400/20 to-purple-500/20",
  },
  {
    title: "قريباً",
    subtitle: "خدمات قادمة",
    description: "نعمل على إطلاق خدمات جديدة ومبتكرة لتوسيع منظومتنا الرقمية. ترقبوا المزيد قريباً.",
    href: "#",
    icon: Sparkles,
    features: ["متجر إلكتروني", "حجوزات مواعيد", "منصة تسويق", "مساعد ذكي", "فواتير إلكترونية", "تطبيق موبايل"],
    gradient: "gradient-coming-soon",
    iconBg: "from-emerald-400/20 to-teal-500/20",
    comingSoon: true,
  },
]

function ServiceCard({ service, index }: { service: typeof services[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const Icon = service.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-[20px] border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--ring)]/30 transition-[border-color,box-shadow] duration-500 hover:shadow-[0_0_40px_var(--shadow-glow)] flex flex-col"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500" style={{ background: `var(--${service.gradient})` }} />

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "var(--gradient-shine)" }} />

      <div className="relative p-7 md:p-8 flex flex-col flex-1">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300`}>
          <Icon className="w-6 h-6 text-[var(--primary)]" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">{service.title}</h3>
        <p className="text-sm text-[var(--primary)] font-medium mb-3">{service.subtitle}</p>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">{service.description}</p>

        {/* Feature list */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {service.comingSoon ? (
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-sm text-[var(--muted-foreground)] font-medium w-fit">
            <Sparkles className="w-3.5 h-3.5" /> قريباً
          </span>
        ) : (
          <a
            href={service.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${service.title} — رابط خارجي`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:brightness-110 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] active:scale-[0.97] w-fit"
          >
            زيارة الخدمة
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="container-base">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">خدماتنا</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-base leading-relaxed">
            منظومة متكاملة من الخدمات الرقمية المصممة لتطوير أعمالك وزيادة مبيعاتك
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
