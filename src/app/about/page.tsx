import { Bot, Smartphone, Globe, Layers, ArrowLeft, User, Quote } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { GenArtBackground } from "@/components/gen-art-background"
/* Server component — entrance motion is CSS reveal/scroll-driven;
   GenArtBackground is the only client island. */

export const metadata: Metadata = {
  title: "عن المنصة",
  description:
    "قصة SmartLink — منصة رقمية ليبية متكاملة أسسها أحمد خيري لتقديم حلول ذكية للأعمال: المنيو الرقمي للمطاعم وأتمتة صفحات فيسبوك.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "عن المنصة | SmartLink",
    description: "منصة رقمية ليبية متكاملة — حلول ذكية للأعمال في العالم العربي",
    url: "/about",
  },
}

const values = [
  { icon: Bot, title: "الذكاء والابتكار", desc: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم حلول ذكية تلقائياً." },
  { icon: Smartphone, title: "سهولة الاستخدام", desc: "واجهات عربية سهلة وبسيطة، صممت خصيصاً للمستخدم العربي." },
  { icon: Globe, title: "دعم عربي كامل", desc: "المنصة بالكامل بالعربية مع دعم اللهجات المحلية وثقافة السوق." },
  { icon: Layers, title: "منصة متكاملة", desc: "كل ما تحتاجه لإدارة أعمالك رقمياً - خدمات تعمل معاً بتناغم." },
]

export default function AboutPage() {
  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <GenArtBackground seed={2024} />
      <div className="container-base relative">
        <div className="max-w-3xl mx-auto text-center mb-14 reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary-text font-medium mb-6">
            <span>عن المنصة</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            عن SmartLink
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            SmartLink منصة رقمية ليبية متكاملة تهدف إلى توفير حلول ذكية للأعمال في العالم العربي.
            نؤمن بأن التكنولوجيا يجب أن تكون سهلة، متاحة، وفعالة للجميع.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-14">
          {values.map((item, i) => (
            <div
              key={item.title}
              className={`reveal-up reveal-d${Math.min(i + 1, 4)} glass rounded-2xl p-6 hover:border-[var(--ring)]/30 transition-all duration-300 group`}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Founder */}
        <div className="reveal-up reveal-d2 max-w-3xl mx-auto mb-10">
          <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5 group hover:border-[var(--ring)]/30 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-[var(--glass-border)] group-hover:scale-110 transition-transform duration-300" style={{ background: "var(--gradient-smart-menu)" }}>
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">المؤسس</h2>
              <p className="text-base text-foreground font-medium">أحمد خيري</p>
              <p className="text-sm text-muted-foreground">مؤسس ورئيس SmartLink - منصة رقمية ليبية رائدة في المنيو الرقمي وخدمات الأتمتة.</p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="reveal-scroll max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">قصتنا</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            انطلقت SmartLink في <strong>20 نوفمبر 2025</strong> من رؤية واضحة: تقديم حلول رقمية متكاملة تلبي احتياجات السوق الليبي والعربي،
            بدءاً من المطاعم والمقاهي التي تحتاج لمنيو رقمي احترافي، إلى أصحاب الصفحات على فيسبوك
            الذين يبحثون عن أتمتة ذكية لردودهم.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            بصفتنا <strong>أول منصة ليبية</strong> متخصصة في إنشاء المنيو الإلكتروني التفاعلي، نسعى لتكون SmartLink
            المنصة الرقمية الأولى للأعمال في ليبيا والعالم العربي.
          </p>

          {/* Pull quote */}
          <div className="relative my-8 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <Quote className="w-6 h-6 text-primary/30 absolute top-4 right-4" aria-hidden="true" />
            <p className="text-base md:text-lg text-foreground/80 italic font-medium leading-relaxed mr-8">
              &ldquo;التكنولوجيا الحقيقية هي التي تخدم الناس، لا التي تبهرهم. في SmartLink، نبني حلولاً تعيش مع الناس وتفهم احتياجاتهم.&rdquo;
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            اليوم، نحن منصة متنامية تضم أكثر من 500 عميل نشط، ونعمل باستمرار على تطوير خدماتنا
            وإضافة المزيد من الحلول المبتكرة - من البوت الذكي لفيسبوك إلى خدمات قادمة تطمح لتغيير
            مشهد الأعمال الرقمية في المنطقة.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 active:scale-[0.97]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  )
}
