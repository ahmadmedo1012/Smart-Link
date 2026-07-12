"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Smartphone, Bot, Sparkles, ChevronLeft } from "lucide-react"
// ponytail: Sparkles used only for "قريباً" badge — single intentional flourish

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
    color: "oklch(0.7 0.19 60)",
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
    color: "oklch(0.55 0.15 280)",
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
    color: "oklch(0.6 0.18 160)",
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
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-[20px] border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--ring)]/40 hover:shadow-[0_0_60px_var(--shadow-glow)] transition-all duration-500 flex flex-col h-full"
      style={{ perspective: "800px" }}
    >
      {/* Top accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }} aria-hidden="true" />

      <motion.div
        className="relative flex-1"
        whileHover={{ rotateY: 2, rotateX: -2 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="relative p-7 md:p-8 flex flex-col flex-1">
          {/* Icon with scale pulse */}
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.iconBg} flex items-center justify-center mb-5`}
            whileHover={{ scale: 1.2, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Icon className="w-6 h-6 text-[var(--primary)]" />
          </motion.div>

          <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">{service.title}</h3>
          <p className="text-sm text-[var(--primary)] font-medium mb-3">{service.subtitle}</p>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">{service.description}</p>

          {/* Feature list */}
          <ul className="space-y-3 mb-8 flex-1">
            {service.features.map((f, fi) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: fi * 0.05 }}
                className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors duration-200"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                <span>{f}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          {service.comingSoon ? (
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-sm text-[var(--muted-foreground)] font-medium w-fit backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> قريباً
            </span>
          ) : (
            <div className="space-y-3">
              <a
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${service.title} — رابط خارجي`}
                className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:brightness-110 transition-all duration-200 active:scale-[0.97] w-fit"
              >
                زيارة الخدمة <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-x-0.5" />
              </a>
              {service.title === "Smart Menu" && (
                <div className="flex gap-2">
                  <a href="/images/smart-menu.jpg" target="_blank" rel="noopener noreferrer" className="block w-20 h-14 rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--ring)]/40 transition-all duration-200 hover:scale-105">
                    <img src="/images/smart-menu.jpg" alt="Smart Menu لقطة شاشة" className="w-full h-full object-cover" loading="lazy" />
                  </a>
                </div>
              )}
              {service.title === "SmartBot" && (
                <div className="flex gap-2">
                  <a href="/images/smart-bot.jpg" target="_blank" rel="noopener noreferrer" className="block w-20 h-14 rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--ring)]/40 transition-all duration-200 hover:scale-105">
                    <img src="/images/smart-bot.jpg" alt="SmartBot لقطة شاشة" className="w-full h-full object-cover" loading="lazy" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Section ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--primary)]/5 blur-[150px] pointer-events-none" aria-hidden="true" />
      <div className="container-base">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary font-medium mb-5">
            <span>خدماتنا</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">منظومة متكاملة</h2>
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
