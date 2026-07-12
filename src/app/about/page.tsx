"use client"
import { Sparkles, Bot, Smartphone, Globe, Layers, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useMemo } from "react"

function mulberry32(s: number) {
  return function () {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    var t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function GenArtBackground({ seed = 42 }: { seed?: number }) {
  const paths = useMemo(() => {
    const rng = mulberry32(seed);
    const lines: string[] = [];
    const accent = "oklch(0.55 0.01 260)";

    for (let i = 0; i < 8; i++) {
      const y1 = i * 14 + rng() * 6;
      const y2 = y1 + 8 + rng() * 4;
      const xOff = rng() * 10;
      const op = 0.02 + i * 0.003;
      lines.push(
        `<polygon points="${xOff},${y1} ${100 + xOff},${y1 - 4} ${100 + xOff},${y2 + 4} ${xOff},${y2}" fill="${accent}" opacity="${op}" />`
      );
    }

    for (let i = 0; i < 60; i++) {
      const x = rng() * 100;
      const y = rng() * 100;
      const sz = 0.3 + rng() * 1.5;
      const op = 0.01 + rng() * 0.03;
      lines.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(2)}" fill="${accent}" opacity="${op}" />`);
    }

    return lines.join("\n");
  }, [seed]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

const values = [
  { icon: Bot, title: "الذكاء والابتكار", desc: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم حلول ذكية تلقائياً." },
  { icon: Smartphone, title: "سهولة الاستخدام", desc: "واجهات عربية سهلة وبسيطة، صممت خصيصاً للمستخدم العربي." },
  { icon: Globe, title: "دعم عربي كامل", desc: "المنصة بالكامل بالعربية مع دعم اللهجات المحلية وثقافة السوق." },
  { icon: Layers, title: "منصة متكاملة", desc: "كل ما تحتاجه لإدارة أعمالك رقمياً — خدمات تعمل معاً بتناغام." },
]

const _ease = [0.16, 1, 0.3, 1] as [number, number, number, number]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: _ease },
})

export default function AboutPage() {
  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <GenArtBackground seed={2024} />
      <div className="container-base relative">
        <motion.div className="max-w-3xl mx-auto text-center mb-14" {...fadeUp()}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            <span>عن المنصة</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
            عن <span className="gradient-text">SmartLink</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            SmartLink منصة رقمية ليبية متكاملة تهدف إلى توفير حلول ذكية للأعمال في العالم العربي.
            نؤمن بأن التكنولوجيا يجب أن تكون سهلة، متاحة، وفعالة للجميع.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-14">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp(0.1 + i * 0.08)}
              className="glass rounded-2xl p-6 hover:border-[var(--ring)]/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Founder */}
        <motion.div className="max-w-3xl mx-auto mb-10" {...fadeUp(0.25)}>
          <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">المؤسس</h2>
              <p className="text-base text-foreground font-medium">أحمد خيري</p>
              <p className="text-sm text-muted-foreground">مؤسس ورئيس SmartLink — منصة رقمية ليبية رائدة في المنيو الرقمي وخدمات الأتمتة.</p>
            </div>
          </div>
        </motion.div>

        {/* Story */}
        <motion.div className="max-w-3xl mx-auto" {...fadeUp(0.35)}>
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
          <p className="text-muted-foreground leading-relaxed mb-6">
            اليوم، نحن منصة متنامية تضم أكثر من 500 عميل نشط، ونعمل باستمرار على تطوير خدماتنا
            وإضافة المزيد من الحلول المبتكرة — من البوت الذكي لفيسبوك إلى خدمات قادمة تطمح لتغيير
            مشهد الأعمال الرقمية في المنطقة.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="w-4 h-4" /> تواصل معنا
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
