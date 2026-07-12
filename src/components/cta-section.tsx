"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="cta" className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: "var(--primary)",
            opacity: 0.03,
            filter: "blur(180px)",
          }}
        />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="container-base relative"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            <span>انطلق الآن</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            جهز أعمالك للانطلاق <span className="gradient-text">الرقمي</span>
          </h2>
          <p className="text-muted-foreground text-base mb-8 max-w-lg mx-auto leading-relaxed">
            أكثر من 500 عميل يثقون بنا. انضم إليهم وابدأ رحلتك الرقمية مع SmartLink.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://menu.smart-link.ly"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm transition-all duration-300 shadow-glow hover:shadow-glow-strong active:scale-[0.97] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                ابدأ التجربة <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-foreground font-semibold text-sm hover:bg-[var(--accent)] transition-all duration-200 active:scale-[0.97]"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
