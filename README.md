# سمارت لينك — SmartLink

> **SmartLink** — the digital umbrella for businesses in Libya: the agency site and the front door of the Smart ecosystem — services, pricing, FAQ and contact, all under one link.

> 🌐 **العربية** · [English](./README.en.md)

[![CI](https://github.com/ahmadmedo1012/Smart-Link/actions/workflows/ci.yml/badge.svg)](https://github.com/ahmadmedo1012/Smart-Link/actions/workflows/ci.yml)
[![Live](https://img.shields.io/website?url=https%3A%2F%2Fsmart-link.ly%2F&label=smart-link.ly)](https://smart-link.ly)
[![License](https://img.shields.io/badge/license-proprietary-%238A6420)](./LICENSE)

**الموقع المباشر:** <https://smart-link.ly> · **الدعم:** واتساب خلال أوقات العمل (٩ ص–٩ م)

![الصفحة الرئيسية لسمارت لينك — سماء مدارك الليلية والكوكبة الحيّة تحت العنوان (لقطة تاريخية من حقبة ما قبل r160)](docs/screenshots/hero-landing.webp)

*لقطة الهيرو من حقبة ما قبل r160 (مدارك Night: الكوكبة الحيّة EcosystemConstellation — محرك تقاعد بـ r160) — إعادة الالتقاط على بناء KODE الحالي معلّقة لموجة التحقق البصري؛ انظر [CAPTIONS.md](docs/screenshots/CAPTIONS.md).*

## ما هذا المشروع؟

**سمارت لينك هو المظلة الرقمية للأعمال في ليبيا** — واجهة الوكالة وبوابة المنظومة في آنٍ واحد:

- **موقع الوكالة**: يعرّف بالخدمات ويعرض منتجات المنظومة الحالية — [Smart Menu](https://menu.smart-link.ly) (المنيو الرقمي وطلبات واتساب)، و[SmartBot](https://bot.smart-link.ly) (بوت وأتمتة لصفحات فيسبوك)، و[Smart Order](https://order.smart-link.ly) (متجر الطلبات والتوصيل والمدفوعات المحلية) — مع رحلة هبوط كاملة من العنوان حتى النداء الختامي.
- **بيت المنظومة**: نقطة البداية الرسمية لعائلة مشاريع سمارت الأوسع (مدارك) — انظر [التذييل العائلي](#-جزء-من-منظومة-مدارك--part-of-the-madarek-ecosystem) أسفل الصفحة.
- **قناة التحول**: خطط وأسعار واضحة، أسئلة شائعة، ونموذج تواصل يصل فعلًا — مع دعم واتساب خلال أوقات العمل.

الموقع عربي أولًا (RTL بالكامل)، يعمل بثيم داكن/فاتح، ومبني ليكون سريعًا ومتاحًا منذ أول طلب.

## المزايا

### الصفحات والأقسام

- **رحلة هبوط كاملة بأسلوب KODE (r160 «الرابط والمنظومة»)**: منحوتة سلسلة معدنية صاعدة على WebGL في الهيرو (**محرك ChainSculpture** — 7 حلقات مترابطة استعار الرابط→المنظومة، تدور بالسحب وتعيد قراءة التوكنات عند تبديل الثيم)، قفل طباعي كوفي ثلاثي الأسطر بخط العرض، فصول فيض برتقالية مسطّحة، كروم حالة مونو، شريط بث متحرك بحلقة RTL سلسة (42 ثانية)، فصل العوالم الثلاثة بادعاءات حقيقية وروابط نطاقات حيّة، رحلة الربط بمسار ضوء، قمرة القيادة بقيم منشورة قابلة للتحقق (3 منتجات حيّة، أقل باقة SmartBot 19 د.ل، باقة Smart Order الأساسية مجانية، واجهة عربية 100% — r143 الصدق)، عالم المنصّات، ونداء ختامي، ثم الأسئلة الشائعة.
- **ست صفحات داخلية**: عن الوكالة · الخطط والأسعار · تواصل معنا · الخصوصية · الشروط · صفحة Offline — إضافة إلى صفحات 404/خطأ مخصصة.
- **استجابة كاملة** من 320px حتى الشاشات العريضة، بأهداف لمس لا تقل عن 44px.

### الخطط والأسعار

- ثلاث بطاقات خطط — **Smart Menu** و**SmartBot** و**Smart Order** — بالخطة الأساسية المجانية، مع قائمة ميزات كل منتج وأسعار بأرقام جدولية (tnum) وروابط مباشرة للبدء.
- **أسعار المنظومة الحيّة**: الباقات المدفوعة متاحة فعلاً بالدينار الليبي على منصات المنتجات الثلاثة (تبدأ من 19 د.ل) — صفحة الأسعار تعكس سلّم كل منتج وتربط مباشرة بصفحة أسعار كل منصة.

### الأسئلة الشائعة

- **أكورديون متاح** (ARIA كامل: فتح/إغلاق بلوحة المفاتيح، حالة `aria-expanded`، محتوى غير مقصوص) في الصفحة الرئيسية وصفحة الأسعار.
- بيانات **FAQPage** منظمة (JSON-LD) للأهلية لنتائج Google الغنية.

### التواصل والتحول

- **نموذج تواصل يصل فعلًا**: تحقق مزدوج (HTML ثم API)، تنضيد XSS، مصيدة honeypot، وحد معدل — ثم إرسال عبر Resend بقالبي react-email (إشعار للمالك + تأكيد للمرسل).
- **فشل صريح لا نجاح وهميًا**: بدون مفتاح الإرسال يعيد المسار 503 مع بدائل واتساب — الرسالة لا تختفي بصمت أبدًا.
- أزرار واتساب مباشرة (خلال أوقات العمل) وروابط ذهبية مغناطيسية نحو المنتجات.

### اللغة والمظهر والأداء

- **عربي/RTL أولًا**: واجهة عربية كاملة الاتجاه، مع تنسيق صحيح لأرقام الهواتف داخل `dir="ltr"` (لا انقلاب bidi).
- **ثيم داكن/فاتح**: مبدّل next-themes مثبَّت بعد التحميل — بلا وميض، واحترام كامل لـ `prefers-color-scheme` و`prefers-reduced-motion`.
- **PWA**: صفحة Offline خاصة + service worker + manifest قابل للتثبيت.
- **سرعة بلا تنازلات**: كل الصفحات Server Components والتفاعل في جزر عميلة صغيرة فقط، خطوط مُستضافة ذاتيًا، وحركة CSS خالصة — **بلا أي مكتبة حركة**.

## لقطات الشاشة

<!-- phase6 (P6-2-a4) → P13-2a: اللقطات الثلاث من بناء المرحلة 6 —
     تاريخية الآن (مدارك Night + آبار الاستباق؛ الحقبة السابقة
     r130/r138). لم تُعد التقاطها بعد r160 (KODE) — إعادة الالتقاط
     معلّقة لموجة التحقق البصري؛ انظر CAPTIONS.md. -->

![صفحة الخطط والأسعار — بطاقات المنتجات الثلاث بميزاتها وأزرار البدء (لقطة تاريخية: ما قبل r160 وP13-2a وP19-A)](docs/screenshots/pricing-plans.png)

*صفحة الخطط والأسعار — لقطة تاريخية: البطاقات الثلاث بآبار الاستباق، لكن البكسلات تسبق P13-2a (لا فصل سلّم المنظومة الحيّة) وP19-A (بطاقة SmartBot تحمل الادعاءات التسويقية الستة التي استُبدلت لاحقًا بميزات موثّقة من كتالوجه الحي) — إعادة الالتقاط معلّقة لموجة التحقق البصري.*

![الأسئلة الشائعة في صفحة الأسعار — أكورديون بسؤال مفتوح وتذييل الموقع (لقطة تاريخية: ما قبل r160 وP13-2a)](docs/screenshots/pricing-faq.png)

*أكورديون الأسئلة الشائعة (سؤال مفتوح) وتذييل الموقع — لقطة تاريخية تسبق إعادة صياغة P13-2a لأجوبة الأسئلة (البكسلات تحمل الصياغة الأقدم)؛ إعادة الالتقاط معلّقة لموجة التحقق البصري.*

> التسميات الكاملة والمصادر في [docs/screenshots/CAPTIONS.md](docs/screenshots/CAPTIONS.md).

## التقنيات

- **Next.js 16** (App Router) — كل الصفحات Server Components، التفاعل في جزر عميلة صغيرة فقط.
- **Tailwind CSS v4** عبر `@theme` — توكنات **KODE** في الوضعين (r160): الحبر ‎`#050507`‎ / الورق ‎`#F4F2ED`‎ / البرتقالي الآمن ‎`#FF4C00`‎ (درجة النص الفاتحة ‎`#B23E00`‎) — لكل منتج عالمه البصري الخاص، وآبار اللكنات على بطاقات الأسعار؛ سلّم أنصاف 6–28 وحركة 80–720ms.
- **خطوط مُستضافة ذاتيًا**: **IBM Plex Sans Arabic** 400–700 للجسم والواجهة (`public/fonts/` — ملفات woff2 للسانس العربي ar+la والمونو اللاتيني) + زوج العرض **Bodoni Moda 700** (اللاتيني) و**Noto Kufi Arabic 700/800** (قفل الهيرو والعناوين) عبر next/font — بلا أي طلب خط خارجي.
- **TypeScript** صارم (يُتحقق منه في البناء).
- **Resend + react-email** للإرسال البريدي، **next-themes** للمظهر، **Playwright + axe-core** للاختبارات.
- **حركة CSS خالصة** — `animation-timeline`/keyframes مع حماية `prefers-reduced-motion`؛ لا framer-motion ولا أي مكتبة حركة.

## البدء السريع

المتطلبات: **Node 22+** و**npm 11**.

```bash
npm install
cp .env.example .env.local   # اختياري في التطوير (انظر الجدول)
npm run dev                  # http://localhost:3000
```

| المتغير | الحاجة | الوصف |
|---|---|---|
| `RESEND_API_KEY` | للإرسال الفعلي | مفتاح [Resend](https://resend.com/api-keys) — بدونه يفشل نموذج التواصل بصوت عالٍ (503) ولا يعرض نجاحًا وهميًا |

للاختبارات الشاملة (على بناء إنتاجي):

```bash
npx playwright install chromium   # مرة واحدة
npm run build && npm run test:e2e
```

## الأوامر

| الأمر | الوصف |
|---|---|
| `npm run dev` | خادم التطوير |
| `npm run build` | بناء إنتاجي (يشغّل فحص TypeScript تلقائيًا) |
| `npm run start` | تشغيل البناء الإنتاجي محليًا |
| `npm run lint` | ESLint — صفر أخطاء مطلوب |
| `npm run test:parity` | لقطة تكافؤ توكنات KODE (node صِرف — تُفرض في CI) |
| `npm run test:e2e` | الجناح الكامل: build ← `next start` ← Playwright + axe-core |
| `npm run test:live:sim` | محاكاة على الموقع الحي smart-link.ly (إعداد Playwright منفصل) |

## هيكل المستودع

```
src/
├── app/               # الصفحات + مسارات API (App Router)
│   ├── page.tsx         # الرئيسية — رحلة الهبوط الكاملة (مكون خادم)
│   ├── about/ pricing/ contact/ privacy/ terms/ offline/
│   ├── api/contact/     # POST — تحقق + honeypot + حد معدل + Resend
│   ├── sitemap.ts robots.ts   # ديناميكية (lastmod عند كل نشر)
│   ├── error.tsx global-error.tsx not-found.tsx
│   └── layout.tsx       # الخطوط + JSON-LD + metadata الجذر
├── components/        # الجزر العميلة (ChainSculpture، النموذج، الأكورديون…) ومكونات الخادم
├── emails/            # قوالب react-email للإشعار والتأكيد
└── lib/               # site.ts (مصدر الحقيقة الوحيد للأرقام والروابط) + seo.ts + schema.ts
e2e/                  # جناح E2E — 25 ملف مواصفات (Playwright + axe-core)
tests/parity.mjs      # لقطة تكافؤ توكنات KODE (node صِرف)
docs/                 # التقارير + لقطات الشاشة
public/               # الخطوط المستضافة ذاتيًا + الأيقونات + sw.js + manifest
.github/workflows/ci.yml   # CI: lint ← parity ← build ← e2e على كل دفعة إلى main
```

## الأمان والجودة (مدمجة في البناء)

- ترويسات أمنية كاملة في `next.config.ts`: HSTS، CSP، X-Frame-Options، Referrer-Policy، Permissions-Policy — مثبتة بفحص حي في الجناح.
- تحقق إدخال + تنضيد XSS + honeypot + حد معدل في مسار التواصل.
- `npm audit`: صفر ثغرات في تبعيات الإنتاج.
- Lighthouse: a11y/best-practices/SEO = 100 في كل الصفحات — القياسات موثقة في [docs/lighthouse-baseline.md](docs/lighthouse-baseline.md).
- SEO كامل: metadata وcanonical وog/twitter لكل صفحة + بيانات JSON-LD منظمة (Organization / WebSite / FAQPage / BreadcrumbList) + sitemap وrobots ديناميكيان.

## الاختبارات

جناح E2E داخل المستودع — **25 ملف مواصفات** تحت `e2e/`، يُشغّل على بناء إنتاجي (`next start`) عبر Playwright + axe-core، إلى جانب **لقطة تكافؤ توكنات KODE** تُفرض في CI (يكبر العدد كل جولة — انظر [CHANGELOG.md](CHANGELOG.md)):

- **الدخان**: الصفحات + 404 (200/RTL/h1/عنوان/صفر أخطاء console) وعدّادات الإحصائيات.
- **السلوك**: القائمة الجوالة، المنسدلة، مبدّل الثيم، زر العودة للأعلى، اللمس والأجهزة (320px فأعلى).
- **SEO والبيانات المنظمة**: canonical وog/twitter وrobots وsitemap وmanifest، ومحتوى JSON-LD الحقيقي من DOM.
- **الأمان**: كل الترويسات حية + تخزين immutable للأصول + لا X-Powered-By.
- **الأكورديون والنموذج**: فتح/إغلاق + aria + الإجابة غير مقصوصة؛ عقد API كاملة (400/honeypot/503/429) ومسار الخطأ ببدائل واتساب.
- **axe-core**: صفر انتهاكات WCAG 2 AA في الوضعين الداكن والفاتح — الفحص بحالة `prefers-reduced-motion` لثبات النتائج بلا flake، مع بقاء أي انتهاك حقيقي مرئيًا.

## الوثائق

- [CHANGELOG.md](CHANGELOG.md) — موجز كل موجة تغييرات (يتحدث كل جولة)
- [SECURITY.md](SECURITY.md) — نطاق الدعم وقنوات الإبلاغ عن الثغرات
- [CONTRIBUTING.md](CONTRIBUTING.md) — بيوت الجودة وقواعد الالتزام والمساهمة
- [docs/smartlink-final-report.md](docs/smartlink-final-report.md) — التقرير الأم لكل جولات التحسين
- [docs/projects-comparison.md](docs/projects-comparison.md) — المقارنة المباشرة بين منتجات المنظومة
- [docs/lighthouse-baseline.md](docs/lighthouse-baseline.md) — خط أساس الأداء عبر الجولات
- [docs/screenshots/CAPTIONS.md](docs/screenshots/CAPTIONS.md) — تسميات لقطات الشاشة ومصادرها
- `CLAUDE.md` — قواعد العمارة لكل مساعد ذكاء اصطناعي يعمل على المستودع

## النشر

تلقائي عبر تكامل GitHub ← Vercel (مشروع `smartlink`). كل دفعة إلى `main` تنشر وتحدّث sitemap lastmod — والتحقق بعد النشر جزء من الثقافة: لا يُغلق بند إلا بدليل حي من الرابط المباشر.

---

## 🛡️ جزء من عائلة سمارت — Part of the Smart family

<!-- P13-2a: القسم تاريخيًا «منظومة مدارك» — مدارك تبقى صفّ عائلة (جسر m15
     الأصلي)، لكن هوية هذا الموقع منذ r160 هي KODE (حبر/ورق/برتقالي آمن)،
     لا هوية مدارك الليلية/الذهبية. انظر التذييل الحي في footer.tsx. -->

> عائلة مشاريع سمارت تحت مظلة واحدة · هوية هذا الموقع منذ r160: KODE — حبر `#050507` / ورق `#F4F2ED` / برتقالي آمن `#FF4C00` (الخطوط: Noto Kufi Arabic + Bodoni Moda + IBM Plex Sans Arabic) · مدارك = المرجع التاريخي لجسر التوكنات m15

| المشروع | الدور | GitHub | الموقع المباشر |
|---|---|---|---|
| 🎓 **مدارك / Madarek** | منصة التعليم الذكي لجامعة الزاوية — المرجع الأم لنظام التصميم | [github.com/ahmadmedo1012/madarek](https://github.com/ahmadmedo1012/madarek) | [madarek.onrender.com](https://madarek.onrender.com) |
| 🔗 **سمارت لينك / Smart-Link** | المظلة الرقمية للأعمال في ليبيا | [github.com/ahmadmedo1012/Smart-Link](https://github.com/ahmadmedo1012/Smart-Link) | [smart-link.ly](https://smart-link.ly) |
| 🍽️ **سمارت منيو / Smart-Menu** | منيو رقمي وطلبات واتساب للمطاعم | [github.com/ahmadmedo1012/Smart-Menu](https://github.com/ahmadmedo1012/Smart-Menu) | [menu.smart-link.ly](https://menu.smart-link.ly) |
| 🤖 **سمارت بوت / SmartBot** | بوت ماسنجر وأتمتة لصفحات فيسبوك | [github.com/ahmadmedo1012/SmartBot](https://github.com/ahmadmedo1012/SmartBot) | [bot.smart-link.ly](https://bot.smart-link.ly) |
| 🛍️ **سمارت أوردر / Smart-Order** | متجر رقمي وطلبات وتوصيل للأعمال | [github.com/ahmadmedo1012/Smart-Order](https://github.com/ahmadmedo1012/Smart-Order) | [order.smart-link.ly](https://order.smart-link.ly) |

## الرخصة

هذا المشروع **برنامج احتكاري (Proprietary)** — جميع الحقوق محفوظة © 2026 أحمد مدو (ahmadmedo1012). لا يمنح استعراض المستودع أو استنساخه أي حق في الاستخدام أو النسخ أو التعديل أو النشر أو إعادة التوزيع دون إذن كتابي مسبق من مالك الحقوق.

النص القانوني الكامل في [LICENSE](./LICENSE) — للاستفسارات التجارية: [ahmadmedo1012@gmail.com](mailto:ahmadmedo1012@gmail.com).
