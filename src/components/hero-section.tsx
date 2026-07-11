"use client"
import Link from "next/link"
import { ArrowLeft, Smartphone, Bot, Users, TrendingUp, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/8 blur-[150px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[var(--primary)]/5 blur-[100px]" />
      </div>

      <div className="container-base relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass text-sm text-[var(--primary)] font-medium mb-6 animate-[fade-in_0.5s_ease-out]">
            <Star className="w-3.5 h-3.5" />
            <span>منصة رقمية متكاملة</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="gradient-text">SmartLink</span>
            <br />
            <span className="text-[var(--foreground)]">منصة رقمية</span>
            <br />
            <span className="text-[var(--foreground)]">لخدمات ذكية</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed">
            منصة موحدة تجمع حلولنا الرقمية المبتكرة — من المنيو الرقمي للمطاعم إلى البوت الذكي لفيسبوك —
            <span className="text-[var(--foreground)] font-medium"> كل ما تحتاجه لتنمية أعمالك في مكان واحد</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:brightness-110 transition-all duration-300 shadow-[0_0_25px_var(--orange-muted)]"
            >
              اكتشف خدماتنا <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--accent)] transition-all duration-300"
            >
              تعرف علينا
            </Link>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { label: "خدمة نشطة", value: "+500", icon: Users },
            { label: "منيو رقمي", value: "+10K", icon: Smartphone },
            { label: "ردود آلية", value: "+50K", icon: Bot },
            { label: "نمو مستمر", value: "99.9%", icon: TrendingUp },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-4 text-center hover:border-[var(--primary)]/30 transition-all duration-300 animate-[fade-in_0.5s_ease-out]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <stat.icon className="w-5 h-5 text-[var(--primary)] mx-auto mb-1.5" />
              <div className="text-lg font-bold text-[var(--foreground)]">{stat.value}</div>
              <div className="text-xs text-[var(--muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
