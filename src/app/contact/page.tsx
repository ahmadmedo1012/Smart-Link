"use client"
import { useState, useMemo } from "react"
import { Mail, MessageCircle, MapPin, Clock, Send, Check, Loader2 } from "lucide-react"

function mulberry32(s: number) {
  return function () {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    var t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function GenArtBackground({ seed = 303 }: { seed?: number }) {
  const paths = useMemo(() => {
    const rng = mulberry32(seed);
    const lines: string[] = [];
    const accent = "oklch(0.55 0.01 260)";
    for (let ring = 0; ring < 6; ring++) {
      const cx = 30 + rng() * 40;
      const cy = 30 + rng() * 40;
      const r = 10 + ring * 5 + rng() * 6;
      const pts = 16 + ring * 2;
      const rot = rng() * 360;
      const op = 0.015 + ring * 0.005;
      const d: string[] = [];
      for (let i = 0; i <= pts; i++) {
        const angle = ((i / pts) * 360 + rot) * (Math.PI / 180);
        const rad = r + (i % 4 === 0 ? rng() * 5 - 2.5 : 0);
        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;
        d.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      d.push("Z");
      lines.push(`<path d="${d.join(" ")}" fill="none" stroke="${accent}" stroke-width="0.4" opacity="${op}" />`);
    }
    for (let i = 0; i < 50; i++) {
      const x = rng() * 100;
      const y = rng() * 100;
      const sz = 0.3 + rng() * 1.2;
      const op = 0.01 + rng() * 0.03;
      lines.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(2)}" fill="${accent}" opacity="${op}" />`);
    }
    return lines.join("\n");
  }, [seed]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: paths }} />
  );
}

const contacts = [
  { icon: Mail, title: "البريد الإلكتروني", desc: "ahmedmedo1012@gmail.com", href: "mailto:ahmedmedo1012@gmail.com" },
  { icon: MessageCircle, title: "واتساب", desc: "تواصل مباشر مع المؤسس", href: "https://wa.me/218910089975" },
  { icon: MapPin, title: "الموقع", desc: "ليبيا" },
  { icon: Clock, title: "أوقات العمل", desc: "24/7 - الدوام الرسمي: 9ص - 9م" },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    const form = e.currentTarget as HTMLFormElement
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setSent(true)
      form.reset()
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <GenArtBackground seed={303} />
      <div className="container-base relative">
        <div className="max-w-3xl mx-auto text-center mb-14 reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary-text font-medium mb-6">
            <span>تواصل</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            اتصل بنا
          </h1>
          <p className="text-lg text-muted-foreground">
            فريقنا جاهز لمساعدتك - تواصل معنا بأي من الطرق التالية
          </p>
        </div>

        {/* Contact info cards — CSS reveal (paints pre-JS, above fold) */}
        <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
          {contacts.map((item, i) => (
            <div
              key={item.title}
              className={`reveal-up reveal-d${Math.min(i + 1, 4)} glass rounded-2xl p-5 text-center hover:border-[var(--ring)]/30 transition-all duration-300 group`}
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <h2 className="font-bold text-foreground text-sm mb-1">{item.title}</h2>
              {item.href ? (
                <a href={item.href} className="text-xs text-primary-text hover:underline underline-offset-2 rounded">{item.desc}</a>
              ) : (
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              )}
            </div>
          ))}
        </div>

        {/* Form — CSS reveal (LCP element) */}
        <div className="max-w-xl mx-auto reveal-up reveal-d3">
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="font-bold text-foreground text-lg mb-5">أرسل رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">الاسم</label>
                  <input id="name" name="name" type="text" required autoComplete="name" className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-foreground text-sm focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-muted-foreground/50" placeholder="اسمك" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">البريد</label>
                  <input id="email" name="email" type="email" required autoComplete="email" className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-foreground text-sm focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-muted-foreground/50" placeholder="بريدك الإلكتروني" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">الموضوع</label>
                <select id="subject" name="subject" className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-foreground text-sm focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent)] transition-all">
                  <option value="">اختر الموضوع</option>
                  <option value="menu">استفسار عن Smart Menu</option>
                  <option value="bot">استفسار عن Smart Bot</option>
                  <option value="support">دعم فني</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">الرسالة</label>
                <textarea id="message" name="message" rows={4} required className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-foreground text-sm focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--accent)] transition-all placeholder:text-muted-foreground/50 resize-none" placeholder="اكتب رسالتك هنا…" />
              </div>
              {error && (
                <div
                  className="text-sm rounded-xl px-4 py-3 text-center border"
                  style={{
                    color: "var(--destructive)",
                    background: "oklch(from var(--destructive) l c h / 0.1)",
                    borderColor: "oklch(from var(--destructive) l c h / 0.25)",
                  }}
                  role="alert"
                >
                  <span className="block font-medium">{error}</span>
                  {(error.includes("واتساب") || error.includes("تعذّر") || error.includes("خطأ") || error.includes("غير مهيأة")) && (
                    <span className="block mt-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      أو تواصل مباشرة:{" "}
                      <a href="https://wa.me/218910089975" className="underline underline-offset-2" style={{ color: "var(--primary)" }}>
                        واتساب 0910089975
                      </a>{" "}·{" "}
                      <a href="mailto:ahmedmedo1012@gmail.com" className="underline underline-offset-2" style={{ color: "var(--primary)" }}>
                        ahmedmedo1012@gmail.com
                      </a>
                    </span>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={sending}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال…</>
                ) : sent ? (
                  <><Check className="w-4 h-4" /> تم الإرسال ✓</>
                ) : (
                  <><Send className="w-4 h-4" /> إرسال الرسالة</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
