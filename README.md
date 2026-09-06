# SmartLink — منصة رقمية متكاملة

منصة رقمية ليبية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي للمطاعم، البوت الذكي لفيسبوك، والمزيد.

**الرابط الحي:** <https://smart-link.ly>

## الخدمات

- **Smart Menu** (<https://menu.smart-link.ly>) — منيو رقمي تفاعلي للمطاعم مع طلبات واتساب
- **SmartBot** (<https://bot.smart-link.ly>) — بوت ذكي لأتمتة الردود على صفحات فيسبوك

## التقنيات

- **Next.js 16** (App Router) — كل الصفحات Server Components، التفاعل في جزر عميلة صغيرة فقط
- **Tailwind CSS v4** عبر `@theme` — توكنات لون العلامة `oklch` في الوضعين الفاتح والداكن (تباين AA)
- **TypeScript** صارم (يُتحقق منه في البناء)
- **حركة CSS خالصة** — `animation-timeline`/keyframes مع حماية `prefers-reduced-motion`؛ **لا توجد مكتبة حركة إطلاقاً** (لا framer-motion — أُزيلت نهائياً في الجولة الخامسة)

## البدء

```bash
npm install
npm run dev        # التطوير على http://localhost:3000
```

متغيرات البيئة (اختياري للتطوير، مطلوب للإرسال الفعلي):

```bash
# .env.local
RESEND_API_KEY=re_xxx   # بدون المفتاح: النموذج يفشل بصوت عالٍ (503) ولا يكذب بنجاح وهمي
```

## الأوامر

```bash
npm run dev        # خادم التطوير
npm run build      # بناء إنتاجي (يعمل tsc تلقائياً)
npm run start      # تشغيل بناء الإنتاج محلياً
npm run lint       # ESLint (صفر أخطاء)
```

## الهيكل

```
src/
├── app/               # الصفحات + مسارات API
│   ├── page.tsx         # الرئيسية (مكون خادم)
│   ├── about/ pricing/ contact/ privacy/ terms/
│   ├── api/contact/     # POST — تحقق + honeypot + rate limit + Resend
│   ├── sitemap.ts robots.ts   # ديناميكية (lastmod عند كل نشر)
│   ├── error.tsx global-error.tsx not-found.tsx
│   └── layout.tsx       # الخطوط + JSON-LD + metadata الجذر
├── components/        # الجزر العميلة (hero/nav/…) ومكونات الخادم (showcase/…)
├── emails/            # قوالب react-email للإشعار والتأكيد
└── lib/               # أدوات مساعدة
```

## الأمان والجودة (مدمجة في البناء)

- ترويسات أمنية كاملة في `next.config.ts`: HSTS، CSP، X-Frame-Options، Referrer-Policy، Permissions-Policy
- تحقق إدخال + تنضيد XSS + honeypot + حد معدل في مسار التواصل
- `npm audit`: صفر ثغرات في تبعيات الإنتاج
- Lighthouse: a11y/best-practices/SEO = 100 في كل الصفحات (توثيق القياسات في `docs/`)

## الوثائق

- `docs/smartlink-final-report.md` — التقرير الأم لكل جولات التحسين
- `docs/projects-comparison.md` — المقارنة المباشرة بين Smart-Menu وSmartBot
- `docs/lighthouse-baseline.md` — خط الأساس عبر الجولات
- `CLAUDE.md` — قواعد العمارة لكل مساعد ذكاء اصطناعي يعمل على المستودع

## النشر

تلقائي عبر تكامل GitHub → Vercel (مشروع `smartlink`). كل دفعة إلى `main` تنشر وتحدّث sitemap lastmod.
