import type { Metadata } from "next"
import { Bot, Smartphone, Globe, Layers, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "عن SmartLink",
  description: "تعرف على قصتنا ورؤيتنا في SmartLink — المنصة الرقمية المتكاملة",
}

const values = [
  { icon: Bot, title: "الذكاء والابتكار", desc: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم حلول ذكية تلقائياً." },
  { icon: Smartphone, title: "سهولة الاستخدام", desc: "واجهات عربية سهلة وبسيطة، صممت خصيصاً للمستخدم العربي." },
  { icon: Globe, title: "دعم عربي كامل", desc: "المنصة بالكامل بالعربية مع دعم اللهجات المحلية." },
  { icon: Layers, title: "منصة متكاملة", desc: "كل ما تحتاجه لإدارة أعمالك رقمياً في مكان واحد." },
]

export default function AboutPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container-base">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-primary font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            <span>عن المنصة</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">عن SmartLink</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            SmartLink هي منصة رقمية متكاملة تهدف إلى توفير حلول ذكية للأعمال في العالم العربي.
            نؤمن بأن التكنولوجيا يجب أن تكون سهلة، متاحة، وفعالة للجميع.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-14">
          {values.map((item) => (
            <div key={item.title} className="glass rounded-2xl p-6 hover:border-[var(--ring)]/30 transition-colors">
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">قصتنا</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            انطلقت SmartLink من رؤية واضحة: تقديم حلول رقمية متكاملة تلبي احتياجات السوق العربي،
            بدءاً من المطاعم والمقاهي التي تحتاج لمنيو رقمي احترافي، إلى أصحاب الصفحات على فيسبوك
            الذين يبحثون عن أتمتة ذكية لردودهم.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            اليوم، نحن منصة متنامية تضم أكثر من 500 عميل نشط، ونعمل باستمرار على تطوير خدماتنا
            وإضافة المزيد من الحلول المبتكرة. رؤيتنا هي أن نكون المنصة الرقمية الأولى للأعمال في العالم العربي.
          </p>
        </div>
      </div>
    </div>
  )
}
