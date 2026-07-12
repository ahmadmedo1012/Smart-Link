"use client"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  const shouldReduce = useReducedMotion()
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/5 blur-[120px]" aria-hidden="true" />
      </div>
      <div className="text-center relative">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h1 className="text-9xl font-extrabold tracking-tight leading-none mb-2">
            <span className="gradient-text">404</span>
          </h1>
        </motion.div>
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: shouldReduce ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">الصفحة غير موجودة</h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              <Home className="w-4 h-4" aria-hidden="true" /> العودة للرئيسية
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> تواصل معنا
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
