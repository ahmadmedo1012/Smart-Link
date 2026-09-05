"use client"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Smartphone, Bot, ArrowLeft } from "lucide-react"
import { easeOutQuart, springDefault } from "@/lib/motion"

/* ────────────────────────────────────────────────────────────
   Product Showcase — scroll-craft section (Smart-Menu parity)
   Real screenshots, scroll-driven, unified motion tokens.
   ──────────────────────────────────────────────────────────── */

const PHONE_FRAME_H = 560 // px — display height of the phone viewport
const BROWSER_FRAME_H = 420 // px — display height of the browser viewport

function useScrollShift(ref: React.RefObject<HTMLElement | null>, imgRef: React.RefObject<HTMLDivElement | null>, frameH: number) {
  const [maxShift, setMaxShift] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  useEffect(() => {
    const measure = () => {
      const img = imgRef.current
      if (!img) return
      const overflow = Math.max(0, img.clientHeight - frameH)
      setMaxShift(overflow)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [imgRef, frameH])

  const y = useTransform(scrollYProgress, [0.1, 0.85], [0, -maxShift], { clamp: true })
  return { y, scrollYProgress }
}

function FeatureChip({ label, i }: { label: string; i: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...springDefault, delay: i * 0.05 }}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-[var(--foreground)]"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" aria-hidden="true" />
      {label}
    </motion.li>
  )
}

/* ── Smart Menu: phone mockup with a long screenshot scrolling inside ── */
function SmartMenuShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()
  const { y } = useScrollShift(sectionRef, imgWrapRef, PHONE_FRAME_H)
  const phoneTilt = useTransform(useScroll({ target: sectionRef, offset: ["start end", "end start"] }).scrollYProgress, [0, 0.5, 1], [8, 0, -8])

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden" aria-label="Smart Menu عرض تفاعلي">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: "var(--gradient-smart-menu)", opacity: 0.35, maskImage: "radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent 75%)" }} />
      <div className="container-base relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Phone mockup */}
          <motion.div
            className="order-2 lg:order-1 mx-auto w-full max-w-[320px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={easeOutQuart}
          >
            <motion.div
              style={{ rotate: shouldReduce ? 0 : phoneTilt }}
              className="relative rounded-[2.5rem] border border-[var(--glass-border)] p-3 shadow-[var(--shadow-xl)]"
            >
              {/* Phone notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-1.5 rounded-full bg-[var(--border)] z-10" aria-hidden="true" />
              <div
                className="relative overflow-hidden rounded-[2rem] bg-[var(--background)]"
                style={{ height: PHONE_FRAME_H }}
              >
                <motion.div
                  ref={imgWrapRef}
                  style={shouldReduce ? undefined : { y }}
                  className="will-change-transform"
                >
                  <Image
                    src="/images/smart-menu.jpg"
                    alt="لقطة شاشة حقيقية من منيو Smart Menu الرقمي"
                    width={320}
                    height={1657}
                    sizes="320px"
                    className="w-full h-auto block"
                    priority={false}
                  />
                </motion.div>
                {/* Scroll hint — fades away as the user scrolls */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[var(--glass-bg-strong)] backdrop-blur-md border border-[var(--glass-border)] text-[10px] text-[var(--muted-foreground)] pointer-events-none" aria-hidden="true">
                  مرّر لمشاهدة المنيو كاملاً
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={easeOutQuart}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm mb-6"
            >
              <Smartphone className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-sm font-semibold text-[var(--foreground)]">Smart Menu</span>
              <span className="text-xs text-[var(--muted-foreground)]">المنيو الرقمي للمطاعم</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={easeOutQuart}
              className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight"
            >
              منيو مطعمك، <span className="gradient-text">كما يراها عميلك فعلاً</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...easeOutQuart, delay: 0.1 }}
              className="text-base text-[var(--muted-foreground)] leading-relaxed mb-7"
            >
              هذه لقطة حقيقية من منيو يعمل الآن: أقسام واضحة، صور شهية، وأسعار بالدينار الليبي.
              العميل يطلب مباشرة عبر واتساب بدون تطبيق ولا تسجيل — وأنت تستقبل الطلب فوراً.
            </motion.p>
            <ul className="flex flex-wrap gap-2.5 mb-8">
              {["تصفح فوري", "طلب عبر واتساب", "QR مخصص", "لوحة تحكم عربية"].map((f, i) => (
                <FeatureChip key={f} label={f} i={i} />
              ))}
            </ul>
            <motion.a
              href="https://menu.smart-link.ly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="زيارة Smart Menu — رابط خارجي"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...easeOutQuart, delay: 0.15 }}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm shadow-[var(--shadow-glow)] hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
            >
              <span className="inline-flex items-center gap-2">
                جرّب المنيو الحي <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SmartBot: browser mockup with parallax reveal ── */
function SmartBotShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60], { clamp: true })

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden" aria-label="SmartBot عرض تفاعلي">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: "var(--gradient-smart-bot)", opacity: 0.3, maskImage: "radial-gradient(ellipse 70% 60% at 70% 40%, black, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 70% 40%, black, transparent 75%)" }} />
      <div className="container-base relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={easeOutQuart}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm mb-6"
            >
              <Bot className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-sm font-semibold text-[var(--foreground)]">SmartBot</span>
              <span className="text-xs text-[var(--muted-foreground)]">البوت الذكي لفيسبوك</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={easeOutQuart}
              className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight"
            >
              صفحتك على فيسبوك <span className="gradient-text">تردّ وأنت نائم</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...easeOutQuart, delay: 0.1 }}
              className="text-base text-[var(--muted-foreground)] leading-relaxed mb-7"
            >
              لوحة تحكم عربية تُصنّف نوايا العملاء تلقائياً، تردّ على الأسئلة المتكررة،
              وترفع لك المحادثات المهمة فقط. من نفس لوحة التحكم تبثّ رسائل جماعية وتتابع الإحصائيات.
            </motion.p>
            <ul className="flex flex-wrap gap-2.5 mb-8">
              {["تصنيف النوايا", "ردود تلقائية", "بث جماعي", "تقارير مباشرة"].map((f, i) => (
                <FeatureChip key={f} label={f} i={i} />
              ))}
            </ul>
            <motion.a
              href="https://bot.smart-link.ly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="زيارة SmartBot — رابط خارجي"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...easeOutQuart, delay: 0.15 }}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm shadow-[var(--shadow-glow)] hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
            >
              <span className="inline-flex items-center gap-2">
                افتح SmartBot <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
              </span>
            </motion.a>
          </div>

          {/* Browser mockup */}
          <motion.div
            className="order-2 mx-auto w-full max-w-[560px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={easeOutQuart}
          >
            <motion.div
              style={shouldReduce ? undefined : { y }}
              className="rounded-2xl border border-[var(--glass-border)] bg-[var(--card)] shadow-[var(--shadow-xl)] overflow-hidden will-change-transform"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-raised)]" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-[var(--destructive)] opacity-70" />
                <span className="w-3 h-3 rounded-full bg-[var(--warning)] opacity-70" />
                <span className="w-3 h-3 rounded-full bg-[var(--success)] opacity-70" />
                <div className="flex-1 mx-3 px-3 py-1 rounded-lg bg-[var(--background)] text-[10px] text-[var(--muted-foreground)] text-center truncate" dir="ltr">
                  bot.smart-link.ly
                </div>
              </div>
              <div ref={imgWrapRef} className="relative overflow-hidden" style={{ height: BROWSER_FRAME_H }}>
                <Image
                  src="/images/smart-bot.jpg"
                  alt="لقطة شاشة حقيقية من لوحة تحكم SmartBot"
                  width={560}
                  height={350}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="w-full h-auto block"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function ProductShowcase() {
  return (
    <div className="relative">
      {/* Section divider with product bullets */}
      <div className="container-base relative">
        <div className="flex items-center gap-4 py-2" aria-hidden="true">
          <span className="h-px flex-1 bg-[var(--border)]" />
          <Smartphone className="w-4 h-4 text-[var(--muted-foreground)] opacity-50" />
          <Bot className="w-4 h-4 text-[var(--muted-foreground)] opacity-50" />
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>
      </div>
      <SmartMenuShowcase />
      <SmartBotShowcase />
    </div>
  )
}
