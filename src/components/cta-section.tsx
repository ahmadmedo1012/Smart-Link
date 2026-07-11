"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function CTASection() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[var(--primary)]/5 blur-[150px]" />
      </div>
      <div className="container-base relative">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">
            جهز أعمالك للانطلاق الرقمي
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-lg mx-auto">
            انضم إلى أكثر من 500 عميل يثقون في منصتنا. ابدأ مجاناً وطور أعمالك مع SmartLink.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://menu.smart-link.ly"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:brightness-110 transition-all duration-300 shadow-[0_0_25px_var(--orange-muted)]"
            >
              ابدأ مجاناً <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-all duration-300"
            >
              تواصل معنا
            </Link>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-5">
            مجاناً بدون بطاقة ائتمان · إلغاء في أي وقت · دعم فني متكامل
          </p>
        </div>
      </div>
    </section>
  )
}
