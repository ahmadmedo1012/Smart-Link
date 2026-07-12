"use client"
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
    const accentDim = "oklch(0.55 0.01 260 / 0.06)";
    const accentMid = "oklch(0.55 0.01 260 / 0.03)";

    for (let ring = 0; ring < 5; ring++) {
      const cx = 40 + rng() * 20;
      const cy = 50 + rng() * 10;
      const r = 18 + ring * 6 + rng() * 8;
      const pts = 12 + ring * 2;
      const rot = rng() * 360;
      const opacity = 0.04 + ring * 0.005;
      const d: string[] = [];
      for (let i = 0; i <= pts; i++) {
        const angle = ((i / pts) * 360 + rot) * (Math.PI / 180);
        const rad = r + (i % 3 === 0 ? rng() * 6 - 3 : 0);
        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;
        d.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      d.push("Z");
      lines.push(`<path d="${d.join(" ")}" fill="none" stroke="${accent}" stroke-width="0.3" opacity="${opacity}" />`);

      if (ring === 1 || ring === 3) {
        const fd: string[] = [];
        const fpts = 18 + ring * 1;
        for (let i = 0; i <= fpts; i++) {
          const angle = ((i / fpts) * 360 + rot + 10) * (Math.PI / 180);
          const rad = r * 0.6 + rng() * 4 - 2;
          const x = cx + Math.cos(angle) * rad;
          const y = cy + Math.sin(angle) * rad;
          fd.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        fd.push("Z");
        lines.push(`<path d="${fd.join(" ")}" fill="${ring === 1 ? accentDim : accentMid}" stroke="none" />`);
      }
    }

    for (let i = 0; i < 50; i++) {
      const x = rng() * 100;
      const y = rng() * 100;
      const sz = 0.5 + rng() * 1.5;
      const op = 0.02 + rng() * 0.04;
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

export default function TermsPage() {
  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <GenArtBackground seed={42} />
      <div className="container-base max-w-3xl mx-auto relative">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-8"
        >
          شروط <span className="gradient-text">الاستخدام</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="space-y-6 text-muted-foreground leading-relaxed"
        >
          <p className="text-sm">آخر تحديث: يوليو 2026</p>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">قبول الشروط</h2>
            <p>باستخدامك لمنصة SmartLink (التي تشمل Smart Menu و SmartBot)، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة. استخدامك للمنصة يعتبر قبولاً صريحاً ونهائياً لهذه الشروط.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">التسجيل والمسؤولية عن الحساب</h2>
            <p>عند إنشاء حساب على SmartLink، أنت مسؤول عن:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك</li>
              <li>جميع الأنشطة التي تحدث تحت حسابك</li>
              <li>إبلاغنا فوراً بأي استخدام غير مصرح به لحسابك</li>
              <li>توفير معلومات دقيقة وكاملة عند التسجيل</li>
            </ul>
            <p className="mt-2">نحن غير مسؤولين عن أي خسائر ناتجة عن فشلك في الالتزام بهذه المسؤوليات.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">وصف الخدمات</h2>
            <p className="font-medium text-foreground">Smart Menu — المنيو الرقمي للمطاعم:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>تحويل قائمة الطعام إلى منيو رقمي تفاعلي</li>
              <li>استقبال الطلبات مباشرة عبر واتساب مع لوحة تحكم عربية كاملة</li>
              <li>برنامج ولاء وإحالات للعملاء</li>
              <li>إحصائيات وتحليلات للمبيعات والطلبات</li>
              <li>رمز QR مخصص للمطعم</li>
            </ul>
            <p className="font-medium text-foreground mt-4">SmartBot — البوت الذكي لفيسبوك:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>أتمتة الردود على صفحات فيسبوك بذكاء</li>
              <li>ردود تلقائية وتصنيف نوايا العملاء</li>
              <li>لوحة تحكم متكاملة لإدارة المحادثات</li>
              <li>تقارير وتحليلات أداء الصفحة</li>
              <li>خاصية البث الجماعي وإدارة الصفحات المتعددة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">التزامات المستخدم</h2>
            <p>باستخدامك للمنصة، تتعهد بما يلي:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>تقديم معلومات دقيقة وصحيحة عند التسجيل</li>
              <li>استخدام الخدمات للأغراض المشروعة فقط</li>
              <li>عدم إساءة استخدام المنصة أو محاولة اختراقها</li>
              <li>عدم نشر محتوى مخالف للقانون أو الآداب العامة</li>
              <li>عدم استخدام الخدمات في أي نشاط غير قانوني أو احتيالي</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الرسوم والمدفوعات</h2>
            <p>توفر SmartLink الخطط الأساسية مجاناً للخدمات (Smart Menu و SmartBot) مع ميزات محدودة. الخطط المدفوعة المتقدمة ستُتاح قريباً وتوفر ميزات إضافية مثل:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>عدد غير محدود من العناصر في المنيو الرقمي</li>
              <li>تحليلات متقدمة وتقارير مخصصة</li>
              <li>أولوية الدعم الفني</li>
              <li>ميزات حصرية إضافية</li>
            </ul>
            <p className="mt-2">سيتم الإعلان عن أسعار الخطط المدفوعة وتفاصيل الدفع عند إطلاقها.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الملكية الفكرية</h2>
            <p>جميع الحقوق الفكرية للمنصة والعلامات التجارية والشعارات والمحتوى (باستثناء المحتوى الذي تنشره أنت) هي مملوكة حصرياً لشركة SmartLink. لا يجوز نسخ أو توزيع أو تعديل أو إنشاء أعمال مشتقة من المنصة أو محتواها دون إذن كتابي مسبق.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">حدود المسؤولية</h2>
            <p>تُقدم خدمات SmartLink &quot;كما هي&quot; دون أي ضمانات صريحة أو ضمنية. نحن لا نتحمل مسؤولية أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام خدماتنا. في جميع الأحوال، تكون مسؤوليتنا القصوى محدودة بالمبلغ المدفوع (إن وجد) مقابل الخدمة خلال الـ 12 شهراً السابقة للحدث المسبب للمسؤولية.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">إنهاء الاستخدام</h2>
            <p>نحتفظ بالحق في تعليق أو إنهاء حسابك في أي حال من الأحوال، بما في ذلك على سبيل المثال لا الحصر، انتهاك هذه الشروط أو السلوك غير القانوني. يمكنك أيضاً إلغاء حسابك في أي وقت عن طريق التواصل معنا. في حالة الإنهاء، ستظل الأحكام المتعلقة بالملكية الفكرية وحدود المسؤولية والقانون المطبق سارية المفعول.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">القانون المطبق</h2>
            <p>تخضع هذه الشروط وتُفسر وفقاً لقوانين الجماهيرية العربية الليبية. يتم تسوية أي نزاعات تنشأ عن هذه الشروط أمام المحاكم المختصة في ليبيا.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">تسوية النزاعات</h2>
            <p>في حالة نشوب نزاع، نسعى أولاً لحله وديًا عبر التواصل المباشر. إذا تعذر ذلك، يُحال النزاع إلى المحاكم المختصة في ليبيا، وتكون اللغة العربية هي اللغة المعتمدة في أي إجراءات قانونية.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">التعديلات</h2>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإشعارك بالتغييرات الجوهرية عبر البريد الإلكتروني أو من خلال المنصة. استمرارك في استخدام المنصة بعد التعديلات يعتبر موافقة منك على الشروط المعدلة.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">اتصل بنا</h2>
            <p>لأي استفسارات بخصوص هذه الشروط، يرجى التواصل معنا على:</p>
            <p className="mt-1 font-medium text-foreground">ahmedmedo1012@gmail.com</p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
