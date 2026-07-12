# SmartLink — منصة رقمية متكاملة

منصة رقمية ليبية متكاملة تقدم حلولاً ذكية للأعمال: المنيو الرقمي للمطاعم، البوت الذكي لفيسبوك، والمزيد.

## الخدمات

- **Smart Menu** — منيو رقمي تفاعلي للمطاعم مع طلبات واتساب
- **SmartBot** — بوت ذكي لأتمتة الردود على فيسبوك

## التقنيات

- Next.js 15 (App Router)
- Tailwind CSS v4
- framer-motion
- TypeScript

## البدء

```bash
npm install
npm run dev
```

فتح http://localhost:3000

## الهيكل

```
src/
├── app/           # الصفحات الرئيسية + API
│   ├── about/
│   ├── contact/
│   ├── pricing/
│   ├── privacy/
│   ├── terms/
│   └── api/contact/
├── components/    # المكونات المشتركة
└── lib/           # دوال مساعدة
```

## النشر

`npm run build` ثم رفع مجلد `out/` أو النشر عبر Vercel.
