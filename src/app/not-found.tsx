"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/5 blur-[120px]" />
      </div>
      <div className="text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h1 className="text-9xl font-extrabold tracking-tight leading-none mb-2">
            <span className="gradient-text">404</span>
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4" /> العودة للرئيسية
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-semibold text-sm hover:bg-[var(--accent)] transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> تواصل معنا
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
