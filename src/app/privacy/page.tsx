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

function GenArtBackground({ seed = 99 }: { seed?: number }) {
  const paths = useMemo(() => {
    const rng = mulberry32(seed);
    const lines: string[] = [];
    const accent = "oklch(0.55 0.01 260)";
    const accentDim = "oklch(0.55 0.01 260 / 0.05)";

    for (let band = 0; band < 6; band++) {
      const cy = 20 + band * 12 + rng() * 4;
      const amp = 4 + rng() * 6;
      const freq = 0.08 + rng() * 0.04;
      const phase = rng() * 360;
      const d: string[] = [];
      for (let x = 0; x <= 100; x += 2) {
        const y = cy + Math.sin((x * freq + phase) * (Math.PI / 180)) * amp;
        d.push(`${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      const opacity = 0.03 + band * 0.004;
      lines.push(`<path d="${d.join(" ")}" fill="none" stroke="${accent}" stroke-width="0.4" opacity="${opacity}" />`);

      if (band % 2 === 0) {
        const fd = [...d, `L100 ${cy + 10}`, `L0 ${cy + 10}`, "Z"];
        lines.push(`<path d="${fd.join(" ")}" fill="${accentDim}" stroke="none" />`);
      }
    }

    for (let i = 0; i < 40; i++) {
      const x = rng() * 100;
      const y = rng() * 100;
      const sz = 0.4 + rng() * 1.2;
      const op = 0.015 + rng() * 0.035;
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

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-16 relative overflow-hidden">
      <GenArtBackground seed={99} />
      <div className="container-base max-w-3xl mx-auto relative">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-8"
        >
          سياسة <span className="gradient-text">الخصوصية</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="space-y-6 text-muted-foreground leading-relaxed"
        >
          <p className="text-sm">آخر تحديث: يوليو 2026</p>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">المقدمة</h2>
            <p>SmartLink هي منصة رقمية ليبية تقدم حلولاً مبتكرة للأعمال، بما في ذلك المنيو الرقمي للمطاعم (Smart Menu) والبوت الذكي لفيسبوك (SmartBot). نحن ملتزمون بحماية خصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لمنصتنا.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">البيانات التي نجمعها</h2>
            <p>قد نجمع الأنواع التالية من البيانات:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>الاسم الكامل</li>
              <li>البريد الإلكتروني</li>
              <li>رقم الهاتف</li>
              <li>بيانات الاستخدام (الصفحات التي تزورها، الميزات التي تستخدمها)</li>
              <li>بيانات التواصل عبر واتساب (الرسائل والاستفسارات)</li>
              <li>معلومات الحساب (اسم المستخدم، كلمة المرور المشفرة)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">كيف نستخدم بياناتك</h2>
            <p>نستخدم البيانات التي نجمعها للأغراض التالية:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>تقديم الخدمات وتحسينها (المنيو الرقمي، البوت الذكي)</li>
              <li>التواصل معك بخصوص حسابك وطلباتك</li>
              <li>الدعم الفني وخدمة العملاء</li>
              <li>تحسين أداء المنصة وتجربة المستخدم</li>
              <li>الامتثال للالتزامات القانونية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">مشاركة البيانات</h2>
            <p>نحن لا نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية أو تجارية. قد نشارك بياناتك فقط عند الاقتضاء القانوني، مثل الامتثال لأمر قضائي أو طلب قانوني من السلطات المختصة في ليبيا.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الاحتفاظ بالبيانات</h2>
            <p>نحتفظ ببياناتك طوال مدة استخدامك للخدمة ولمدة 12 شهراً إضافية بعد إلغاء حسابك أو توقفك عن استخدام المنصة، وذلك لأغراض قانونية وتشغيلية. بعد هذه المدة، يتم حذف بياناتك بشكل آمن أو إخفاء هويتها.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">حقوق المستخدم</h2>
            <p>نحن نسعى لتوفير مستوى حماية يتوافق مع المعايير العالمية مثل اللائحة العامة لحماية البيانات (GDPR). تشمل حقوقك:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>حق الوصول إلى بياناتك الشخصية</li>
              <li>حق تصحيح البيانات غير الدقيقة</li>
              <li>حق حذف بياناتك (في الحالات التي يسمح بها القانون)</li>
              <li>حق تقييد معالجة بياناتك</li>
            </ul>
            <p className="mt-2">نشير إلى أن هذه الحقوق تطبق بشكل طوعي في إطار التزامنا بأفضل الممارسات، وذلك في ظل عدم وجود تشريع ليبي محدد لحماية البيانات الشخصية حتى تاريخه.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الإجراءات الأمنية</h2>
            <p>نطبق إجراءات أمنية شاملة لحماية بياناتك، بما في ذلك:</p>
            <ul className="list-disc mr-5 mt-2 space-y-1">
              <li>التشفير في نقل البيانات باستخدام بروتوكول TLS</li>
              <li>ضوابط الوصول الصارمة (صلاحيات محدودة حسب المهام)</li>
              <li>تدقيق أمني دوري للبنية التحتية</li>
              <li>تخزين كلمات المرور بشكل مشفر باستخدام خوارزميات آمنة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">النقل الدولي للبيانات</h2>
            <p>بياناتك تُخزن على خوادم آمنة قد تكون موجودة داخل أو خارج ليبيا. عند نقل بياناتك دولياً، نحرص على تطبيق مستويات حماية مناسبة تضمن سرية وأمان معلوماتك.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">التغييرات على السياسة</h2>
            <p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بالتغييرات الجوهرية عبر البريد الإلكتروني أو من خلال المنصة. يُرجى مراجعة هذه الصفحة دورياً للاطلاع على أحدث التحديثات.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">اتصل بنا</h2>
            <p>لأي استفسارات أو مخاوف بخصوص سياسة الخصوصية هذه، يرجى التواصل معنا على:</p>
            <p className="mt-1 font-medium text-foreground">ahmedmedo1012@gmail.com</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">القانون المطبق</h2>
            <p>تخضع سياسة الخصوصية هذه وتُفسر وفقاً لقوانين الجماهيرية العربية الليبية.</p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
