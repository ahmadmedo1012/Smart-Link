import type { Metadata } from "next"
import { Bot, Smartphone, Globe, Layers } from "lucide-react"

export const metadata: Metadata = {
  title: "عن SmartLink",
  description: "تعرف على قصتنا ورؤيتنا في SmartLink — المنصة الرقمية المتكاملة",
}

export default function AboutPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container-base">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">عن SmartLink</h1>
          <p className="text-lg text-[var(--muted-foreground)] mb-10 leading-relaxed">
            SmartLink هي منصة رقمية متكاملة تهدف إلى توفير حلول ذكية للأعمال في العالم العربي.
            نؤمن بأن التكنولوجيا يجب أن تكون سهلة، متاحة، وفعالة للجميع.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-14">
          {[
            { icon: Bot, title: "الذكاء والابتكار", desc: "نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم حلول ذكية تلقائياً." },
            { icon: Smartphone, title: "سهولة الاستخدام", desc: "واجهات عربية سهلة وبسيطة، صممت خصيصاً للمستخدم العربي." },
            { icon: Globe, title: "دعم عربي كامل", desc: "المنصة بالكامل بالعربية مع دعم اللهجات المحلية (الليبية، المصرية، وغيرها)." },
            { icon: Layers, title: "منصة متكاملة", desc: "كل ما تحتاجه لإدارة أعمالك رقمياً في مكان واحد." },
          ].map((item) => (
            <div key={item.title} className="glass rounded-xl p-6">
              <item.icon className="w-8 h-8 text-[var(--primary)] mb-3" />
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">قصتنا</h2>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
            انطلقت SmartLink من رؤية واضحة: تقديم حلول رقمية متكاملة تلبي احتياجات السوق العربي،
            بدءاً من المطاعم والمقاهي التي تحتاج لمنيو رقمي احترافي، إلى أصحاب الصفحات على فيسبوك
            الذين يبحثون عن أتمتة ذكية لردودهم.
          </p>
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">
            اليوم، نحن منصة متنامية تضم أكثر من 500 عميل نشط، ونعمل باستمرار على تطوير خدماتنا
            وإضافة المزيد من الحلول المبتكرة. رؤيتنا هي أن نكون المنصة الرقمية الأولى للأعمال في العالم العربي.
          </p>
        </div>
      </div>
    </div>
  )
}
