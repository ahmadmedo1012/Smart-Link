"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="cta" className="section-padding relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[var(--primary)]/8 blur-[150px]" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--primary)]/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--primary)]/10 blur-[100px]" />
      </div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="container-base relative"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            جهز أعمالك للانطلاق <span className="gradient-text">الرقمي</span>
          </h2>
          <p className="text-muted-foreground text-base mb-8 max-w-lg mx-auto leading-relaxed">
            انضم إلى أكثر من 500 عميل يثقون في منصتنا. ابدأ مجاناً وطور أعمالك مع SmartLink.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://menu.smart-link.ly"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-300 shadow-glow animate-[pulse-glow_4s_ease-in-out_infinite] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
            >
              ابدأ مجاناً <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-foreground font-semibold text-sm hover:bg-[var(--accent)] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
            >
              تواصل معنا
            </Link>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-xs text-muted-foreground mt-6"
          >
            مجاناً بدون بطاقة ائتمان · إلغاء في أي وقت · دعم فني متكامل
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
