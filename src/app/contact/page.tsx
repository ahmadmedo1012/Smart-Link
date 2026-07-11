import type { Metadata } from "next"
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "تواصل مع فريق SmartLink — نحن هنا لمساعدتك",
}

export default function ContactPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container-base">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">اتصل بنا</h1>
          <p className="text-lg text-[var(--muted-foreground)] mb-10">
            فريقنا جاهز لمساعدتك. تواصل معنا بأي من الطرق التالية.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {[
            { icon: Mail, title: "البريد الإلكتروني", desc: "support@smart-link.ly", href: "mailto:support@smart-link.ly" },
            { icon: MessageCircle, title: "واتساب", desc: "دعم فني مباشر", href: "https://wa.me/218910089975" },
            { icon: MapPin, title: "الموقع", desc: "ليبيا" },
            { icon: Clock, title: "أوقات العمل", desc: "24/7 — الدوام الرسمي: 9ص - 9م" },
          ].map((item) => (
            <div key={item.title} className="glass rounded-xl p-6">
              <item.icon className="w-8 h-8 text-[var(--primary)] mb-3" />
              <h3 className="font-bold mb-1">{item.title}</h3>
              {item.href ? (
                <a href={item.href} className="text-sm text-[var(--primary)] hover:underline">{item.desc}</a>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
