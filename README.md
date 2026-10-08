# SmartLink — منصة رقمية متكاملة

منصة رقمية ليبية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي للمطاعم، البوت الذكي لفيسبوك، والمزيد.

**الرابط الحي:** <https://smart-link.ly>

## الخدمات

- **Smart Menu** (<https://menu.smart-link.ly>) — منيو رقمي تفاعلي للمطاعم مع طلبات واتساب
- **SmartBot** (<https://bot.smart-link.ly>) — بوت ذكي لأتمتة الردود على صفحات فيسبوك

## التقنيات

- **Next.js 16** (App Router) — كل الصفحات Server Components، التفاعل في جزر عميلة صغيرة فقط
- **Tailwind CSS v4** عبر `@theme` — جسر توكنات **مدارك** (Madarek) في الوضعين: ليلي night/gold ‎`#070B16`/`#E9B44C`‎ ونهاري cream/copper ‎`#FBFAF9`/`#B57438`‎ (تباين AA)، تسع عائلات باستيل × {bg, ink, deep} في الوضعين، سلّما أنصاف 6–28 وحركة 80–720ms
- **خط IBM Plex Sans Arabic** 400–700 مُستضاف ذاتيًا (`public/fonts/` — ‎12 ملف woff2: سانس عربي ar+la، مونو، سيريف مائل لاتيني) — بلا أي طلب خط خارجي
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
npm run test:parity # لقطة تكافؤ مدارك — 271 تثبيت توكن (node صِرف)
npm run test:e2e   # جناح E2E الكامل (build أولاً)
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
│   └── layout.tsx       # الخطوط + JSON-LD + metadata الجذر (مع canonical الرئيسية)
├── components/        # الجزر العميلة (hero/nav/…) ومكونات الخادم (showcase/…)
├── emails/            # قوالب react-email للإشعار والتأكيد
└── lib/               # أدوات مساعدة (seo.ts = pageMetadata الإلزامية)
e2e/                  # جناح E2E — 295 اختباراً في 23 ملف مواصفات (Playwright + axe-core)
playwright.config.ts  # webServer = next start على بناء إنتاجي
.github/workflows/ci.yml  # CI: lint ← parity ← build ← e2e على كل دفعة إلى main
```

## الأمان والجودة (مدمجة في البناء)

- ترويسات أمنية كاملة في `next.config.ts`: HSTS، CSP، X-Frame-Options، Referrer-Policy، Permissions-Policy
- تحقق إدخال + تنضيد XSS + honeypot + حد معدل في مسار التواصل
- `npm audit`: صفر ثغرات في تبعيات الإنتاج
- Lighthouse: a11y/best-practices/SEO = 100 في كل الصفحات (توثيق القياسات في `docs/`)

## الاختبارات (r7 → r126)

جناح E2E داخل المستودع — **295 اختباراً** في 23 ملف مواصفات تحت `e2e/`، يُشغّل على بناء إنتاجي (`next start`) عبر Playwright + axe-core، إلى جانب لقطة تكافؤ توكنات مدارك (r126: **271 تثبيتاً** عبر `npm run test:parity` — تُفرض في CI):

```bash
npx playwright install chromium   # مرة واحدة
npm run build                     # البناء أولاً (webServer يشغّل next start)
npm run test:e2e                  # 295/295 يجب أن تمرّ
npm run test:parity               # 271/271 توكن يجب أن يطابق القانوني
```

التغطية:

- **الدخان**: الصفحات الست + 404 (200/RTL/h1/عنوان/صفر أخطاء console) + عدّادات الإحصائيات (انحدار r5)
- **SEO**: canonical وog/twitter كاملين لكل صفحة + robots.txt + sitemap.xml + manifest + التحقق من بايتات JPEG
- **الأمان**: كل الترويسات الأمنية حية + تخزين immutable للأصول + لا X-Powered-By
- **السلوك**: القائمة الجوالة (فتح/قفل تمرير/Escape)، المنسدلة، مبدّل الثيم (يثبت بعد التحميل)، **زر العودة للأعلى (انحدار r7: كان منطقه معكوساً)**
- **الأكورديون**: فتح/إغلاق + aria + الإجابة غير مقصوصة (انحدار r6)
- **نموذج الاتصال**: تحقق HTML + عقد API (400/honeypot/503/429) + مسار الخطأ ببدائل واتساب
- **JSON-LD**: Organization/WebSite/FAQPage بمحتواها الحقيقي من DOM (انحدار r6 للبريد)
- **axe-core**: صفر انتهاكات WCAG 2 AA **في الوضعين الداكن والفاتح** (12 فحصاً)

**ر15 — استقرار فحص axe**: كان `axeScan` يمسح DOM «حيّاً» أثناء حركات الدخول (reveal-up 0.6s / menu-pop 0.2s)، فيلتقط إطاراً وسطياً بتباين منخفض → flake متكرر (color-contrast 2.24:1). الإصلاح: الفحص بحالة `prefers-reduced-motion` (التي يدعمها الموقع أصلاً — styles.css:477 تُسقط كل الحركة إلى 0.01ms) في نقطة الاختناق `axeScan` وحدها — لا `sleep` ولا CSS مُحقَظ، ويظل أي انتهاك تباين حقيقي مرئياً. 295/295 متكررة نظيفة.

**GitHub Actions** (`.github/workflows/ci.yml`): كل دفعة/PR إلى `main` تجتاز lint ← build ← E2E تلقائياً — المستودع يتحقق من نفسه.

## الوثائق

- `docs/smartlink-final-report.md` — التقرير الأم لكل جولات التحسين
- `docs/projects-comparison.md` — المقارنة المباشرة بين Smart-Menu وSmartBot
- `docs/lighthouse-baseline.md` — خط الأساس عبر الجولات
- `CLAUDE.md` — قواعد العمارة لكل مساعد ذكاء اصطناعي يعمل على المستودع

## النشر

تلقائي عبر تكامل GitHub → Vercel (مشروع `smartlink`). كل دفعة إلى `main` تنشر وتحدّث sitemap lastmod.
