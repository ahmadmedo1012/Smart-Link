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
    const accent = "oklch(0.58 0.195 45)";
    const accentDim = "oklch(0.58 0.195 45 / 0.05)";

    // wave bands
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

      // filled band below
      if (band % 2 === 0) {
        const fd = [...d, `L100 ${cy + 10}`, `L0 ${cy + 10}`, "Z"];
        lines.push(`<path d="${fd.join(" ")}" fill="${accentDim}" stroke="none" />`);
      }
    }

    // dots
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
          <p className="text-sm">آخر تحديث: 2026</p>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">المقدمة</h2>
            <p>نحن في SmartLink نلتزم بحماية خصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">المعلومات التي نجمعها</h2>
            <p>نجمع المعلومات التالية عند استخدامك لمنصتنا: الاسم، البريد الإلكتروني، رقم الهاتف، معلومات الحساب، وبيانات الاستخدام الأساسية.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">كيف نستخدم معلوماتك</h2>
            <p>نستخدم معلوماتك لتقديم وتحسين خدماتنا، التواصل معك بخصوص حسابك، وإرسال تحديثات مهمة. لا نشارك معلوماتك مع أطراف ثالثة لأغراض تسويقية.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">حماية البيانات</h2>
            <p>نطبق إجراءات أمنية مشددة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفشاء.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">اتصل بنا</h2>
            <p>لأي استفسارات بخصوص سياسة الخصوصية، يرجى التواصل معنا على ahmadmedo1012@gmail.com</p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
