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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[var(--primary)]/5 blur-[150px]" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--primary)]/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--primary)]/8 blur-[100px]" />
      </div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="container-base relative"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">
            جهز أعمالك للانطلاق <span className="gradient-text">الرقمي</span>
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-lg mx-auto">
            انضم إلى أكثر من 500 عميل يثقون في منصتنا. ابدأ مجاناً وطور أعمالك مع SmartLink.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://menu.smart-link.ly"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:brightness-110 transition-[background-color,opacity] duration-300 shadow-[0_0_25px_var(--orange-muted)] animate-[pulse-glow_3s_ease-in-out_infinite] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              ابدأ مجاناً <ArrowLeft className="w-4 h-4 rtl:scale-x-[-1]" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              تواصل معنا
            </Link>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-xs text-[var(--muted-foreground)] mt-5"
          >
            مجاناً بدون بطاقة ائتمان · إلغاء في أي وقت · دعم فني متكامل
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
