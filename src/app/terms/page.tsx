"use client"
import { motion } from "framer-motion"
import { useMemo } from "react"

/* Seeded pseudo-random for deterministic generative art */
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
    const accent = "oklch(0.58 0.195 45)";
    const accentDim = "oklch(0.58 0.195 45 / 0.06)";
    const accentMid = "oklch(0.58 0.195 45 / 0.03)";

    // 5 concentric geometric rings — decomposed
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
        const rad = r + (i % 3 === 0 ? rng() * 6 - 3 : 0);  // irregular radius every 3rd pt
        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;
        d.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      d.push("Z");
      lines.push(`<path d="${d.join(" ")}" fill="none" stroke="${accent}" stroke-width="0.3" opacity="${opacity}" />`);

      // Filled inner shape
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

    // Scatter dots
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
          <p className="text-sm">آخر تحديث: 2026</p>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">قبول الشروط</h2>
            <p>باستخدامك لمنصة SmartLink، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الحسابات</h2>
            <p>أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. يجب عليك إبلاغنا فوراً بأي استخدام غير مصرح به لحسابك.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">الخدمات</h2>
            <p>نقدم خدماتنا &quot;كما هي&quot; بدون أي ضمانات. نحن لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام أو عدم القدرة على استخدام خدماتنا.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">المحتوى</h2>
            <p>أنت تحتفظ بجميع حقوق المحتوى الذي تنشره على منصتنا. ومع ذلك، بموجب هذه الشروط، تمنحنا ترخيصاً لاستخدام هذا المحتوى لغرض تقديم خدماتنا لك.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">التعديلات</h2>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإشعارك بالتغييرات المهمة عبر البريد الإلكتروني أو من خلال المنصة.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mt-6 mb-2">القانون المطبق</h2>
            <p>تخضع هذه الشروط وتفسر وفقاً لقوانين ليبيا.</p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
