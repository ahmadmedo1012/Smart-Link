"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MessageCircle, MapPin, Clock, Send, Check } from "lucide-react"

const contacts = [
  { icon: Mail, title: "البريد الإلكتروني", desc: "support@smart-link.ly", href: "mailto:support@smart-link.ly" },
  { icon: MessageCircle, title: "واتساب", desc: "دعم فني مباشر", href: "https://wa.me/218910089975" },
  { icon: MapPin, title: "الموقع", desc: "ليبيا" },
  { icon: Clock, title: "أوقات العمل", desc: "24/7 — الدوام الرسمي: 9ص - 9م" },
]

const _ease = [0.16, 1, 0.3, 1] as [number, number, number, number]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: _ease },
})

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container-base">
        <motion.div className="max-w-3xl mx-auto text-center mb-14" {...fadeUp()}>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            اتصل <span className="gradient-text">بنا</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            فريقنا جاهز لمساعدتك — تواصل معنا بأي من الطرق التالية
          </p>
        </motion.div>

        {/* Contact info cards */}
        <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
          {contacts.map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp(0.1 + i * 0.06)}
              className="glass rounded-2xl p-5 text-center hover:border-[var(--ring)]/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-2.5">
                <item.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
              {item.href ? (
                <a href={item.href} className="text-xs text-primary hover:underline underline-offset-2">{item.desc}</a>
              ) : (
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div className="max-w-xl mx-auto" {...fadeUp(0.4)}>
          <div className="glass rounded-2xl p-6 md:p-8">
            <h3 className="font-bold text-foreground text-lg mb-5">أرسل رسالة</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">الاسم</label>
                  <input id="name" type="text" required className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-foreground text-sm focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent)] transition-colors placeholder:text-muted-foreground/50" placeholder="اسمك" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">البريد</label>
                  <input id="email" type="email" required className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-foreground text-sm focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent)] transition-colors placeholder:text-muted-foreground/50" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">الموضوع</label>
                <select id="subject" className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-foreground text-sm focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent)] transition-colors">
                  <option value="">اختر الموضوع</option>
                  <option value="menu">استفسار عن Smart Menu</option>
                  <option value="bot">استفسار عن Smart Bot</option>
                  <option value="support">دعم فني</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">الرسالة</label>
                <textarea id="message" rows={4} required className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-foreground text-sm focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent)] transition-colors placeholder:text-muted-foreground/50 resize-none" placeholder="اكتب رسالتك هنا…" />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-300 active:scale-[0.98]"
              >
                {sent ? (
                  <><Check className="w-4 h-4" /> تم الإرسال ✓</>
                ) : (
                  <><Send className="w-4 h-4" /> إرسال الرسالة</>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
