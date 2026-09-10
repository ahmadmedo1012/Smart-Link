import Image from "next/image"
import { Smartphone, Bot, Sparkles, ChevronLeft } from "lucide-react"
import { SITE } from "@/lib/site"
// Server component: entrance motion is CSS scroll-driven (styles.css),
// hover effects are pure CSS transforms.

const services = [
  {
    title: "Smart Menu",
    subtitle: "المنيو الرقمي للمطاعم",
    description: "حول منيو مطعمك إلى تجربة رقمية تفاعلية. طلبات تصل مباشرة على واتساب مع لوحة تحكم عربية كاملة.",
    href: SITE.products.menu.url,
    icon: Smartphone,
    /* r10 (code audit — string coupling): the screenshot used to render
       only when title === "Smart Menu" — renaming the title would silently
       drop the image. The data owns its screenshot now. */
    screenshot: "/images/smart-menu.jpg",
    features: ["منيو رقمي تفاعلي", "طلبات عبر واتساب", "برنامج ولاء وإحالات", "إحصائيات وتحليلات", "QR كود مخصص", "لوحة تحكم عربية"],
    gradientVar: "var(--gradient-smart-menu)",
    color: "oklch(0.7 0.19 60)",
  },
  {
    title: "SmartBot",
    subtitle: "البوت الذكي لفيسبوك",
    description: "أتمتة الردود على صفحات فيسبوك بذكاء. ردود تلقائية، تصنيف نوايا، وإدارة متكاملة للمحادثات.",
    href: SITE.products.bot.url,
    icon: Bot,
    screenshot: "/images/smart-bot.jpg",
    features: ["ردود تلقائية ذكية", "تصنيف النوايا", "لوحة تحكم متكاملة", "تقارير وتحليلات", "بث جماعي", "إدارة الصفحات"],
    gradientVar: "var(--gradient-smart-bot)",
    color: "oklch(0.55 0.15 280)",
  },
  {
    title: "قريباً",
    subtitle: "خدمات قادمة",
    description: "نعمل على إطلاق خدمات جديدة ومبتكرة لتوسيع منظومتنا الرقمية. ترقبوا المزيد قريباً.",
    href: "#",
    icon: Sparkles,
    features: ["متجر إلكتروني", "حجوزات مواعيد", "منصة تسويق", "مساعد ذكي", "فواتير إلكترونية", "تطبيق موبايل"],
    gradientVar: "var(--gradient-coming-soon)",
    color: "oklch(0.6 0.18 160)",
    comingSoon: true,
  },
]

function ServiceCard({ service }: { service: typeof services[number] }) {
  const Icon = service.icon

  return (
    <div
      className={`reveal-scroll-strong group relative rounded-[20px] border border-[var(--border)] bg-[var(--card)] overflow-hidden hover:border-[var(--ring)]/40 hover:shadow-glow-strong transition-all duration-500 flex flex-col h-full [perspective:800px] hover:[transform:rotateY(2deg)_rotateX(-2deg)]`}
    >
      {/* Top accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${service.color}, transparent)` }} aria-hidden="true" />

      <div className="relative flex-1">
        <div className="relative p-7 md:p-8 flex flex-col flex-1">
          {/* Icon — scales on card hover */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[var(--glass-border)] group-hover:scale-[1.15] group-hover:-translate-y-1 transition-transform duration-300 ease-[var(--ease-smooth)]"
            style={{ background: service.gradientVar }}
          >
            <Icon className="w-6 h-6 text-[var(--primary)]" />
          </div>

          <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">{service.title}</h3>
          <p className="text-sm text-[var(--primary-text)] font-medium mb-3">{service.subtitle}</p>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">{service.description}</p>

          {/* Feature list */}
          <ul className="reveal-scroll-stagger space-y-3 mb-8 flex-1">
            {service.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors duration-200"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                <span>{f}</span>
              </li>
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
                aria-label={`زيارة الخدمة — ${service.title}، رابط خارجي`}
                className="group/btn inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:brightness-105 transition-all duration-200 active:scale-[0.97] w-fit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]"
              >
                زيارة الخدمة <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-x-0.5" />
              </a>
              {service.screenshot && (
                <div className="flex gap-2">
                  <a href={service.screenshot} target="_blank" rel="noopener noreferrer" aria-label={`${service.title} لقطة شاشة مكبرة`} className="block w-20 h-14 rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--ring)]/40 transition-all duration-200 hover:scale-105">
                    <Image src={service.screenshot} alt={`${service.title} لقطة شاشة`} width={160} height={112} sizes="80px" className="w-full h-full object-cover" loading="lazy" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ServicesSection() {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Section ambient glow */}
      {/* r8: blur radius halved (150→75px) — at 5% opacity on a decorative
          glow the visual difference is imperceptible; the raster cost is
          not. One of six giant blurs trimmed this round. */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--primary)]/5 blur-[75px] pointer-events-none" aria-hidden="true" />
      <div className="container-base">
        <div className="reveal-scroll text-center mb-14">
          <div className="eyebrow-badge mb-5">
            <span>خدماتنا</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">منظومة متكاملة</h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-base leading-relaxed">
            خدمات رقمية مصممة لتطوير أعمالك وزيادة مبيعاتك خطوة بخطوة
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
