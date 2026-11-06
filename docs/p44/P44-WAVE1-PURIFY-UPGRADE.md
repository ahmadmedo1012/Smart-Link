# P44 — Wave 1: التطهير والترقية (2026-11-06)

**التوجيه:** «اترك Vercel واستمر في تطهير وترقية المستودعات الأربعة بكل المهارات المتاحة،
وابحث عن مهارات وأدوات في GitHub تساعدك واستخدمها» — بعد إغلاق P42 (10e).

## الأدوات المكتشفة من GitHub والمستخدمة فعليًا

| الأداة | النجوم | الاستخدام في هذه الموجة | النتيجة |
|---|---|---|---|
| [actionlint](https://github.com/rhysd/actionlint) v1.7.12 | 4.4k | تدقيق كل ملفات workflows في المستودعات الأربعة (قبل وبعد) | **صفر ملاحظات** |
| [gitleaks](https://github.com/gitleaks/gitleaks) v8.30.1 | 30.7k | مسح أسرار كامل (no-git) للأربعة | **صفر نتائج** |
| [osv-scanner](https://github.com/google/osv-scanner) v2.7.0 | 11.4k | مثبت وجاهز (SmartBot يشغله في CI أصلًا) | جاهز |
| [knip](https://github.com/webpro-nl/knip) | 12.6k | فحص الكود/التبعيات الميتة (v5 محليًا — v6 ينهار بذاكرة الصندوق) | حذف `three`+`@types/three` من Smart-Menu (ميتة منذ P21-W3-E)؛ الباقي تقرير |
| [npm-check-updates](https://github.com/raineorshine/npm-check-updates) | 10.3k | مسح الحداثة وتحديد الترقيات الآمنة | أساس جدول الترقيات أدناه |
| Dependabot (مدمج في GitHub) | — | تفعيل/تحقق في الجميع | 28 PR مفتوحة كخيارات مالك |

## الالتزامات الأربعة (كلها مدفوعة وCI أخضر)

| المستودع | الالتزام | المحتوى | check-runs |
|---|---|---|---|
| Smart-Link | `153f480` | 11 ترقية ويب (next 16.4.5, playwright 1.65, lucide 1.70, resend 6.37, three 0.187…) + mobile-release.yml v4→v7/v8.0.2/v6.2.0 | **5/5 نجاح** |
| SmartBot | `49d0371` | 20 ترقية frontend (react 19.3.1, react-query 5.106, recharts 3.10…) + إعادة تثبيت ci.yml بـ SHA حديثة (checkout v7.0.1 / setup-python v7.1.0 / setup-node v7.1.0) + **dependabot.yml جديد** (npm + pip + github-actions) + إصلاح خطأ lint مسبق في FlowsPage.test.tsx | **8/8 نجاح** (653/653 اختبار، حزمة 193.6KB ≤ 195KB) |
| Smart-Menu | `c2b2cf10` | 19 ترقية (prisma 7.10 + generate، react 19.3.1، base-ui 1.9، pg 8.23…) مع **احترام cooldown** (minimumReleaseAge) + إعادة تثبيت كل workflows بـ SHA v7-era (37 سطر uses) + **dependabot.yml جديد** + حذف three الميتة | **7/7 نجاح** (3117 اختبار) |
| Smart-Order | `193b1f1` | 17 ترقية (عائلة radix-ui كاملة، react 19.3.1، zustand 5.1…) + mobile-release.yml v4→v7/v8/v6 — **رجوع واحد موثق**: lucide-react (عقد parity r133-G1 يقيد ^1.43.0 حرفيًا — قرار عائلي منسق) | **9/9 نجاح** (parity 522/522) |

**الإجمالي: 67 ترقية مطبقة · 1 رجوع موثق (عقد عائلي) · 2 تخطٍّ موثق (typescript major، bun packageManager-parity) · صفر major مفروض**

## القيود الملتزمة

- **mobile/ مجمّد بالكامل في الأربعة** (صفر ملفات في كل diff) — حماية صلاحية ثنائيات W9
  (smart-menu/smart-order صالحتان للمصدر الحالي؛ smartbot بانتظار إعادة البناء بعد F-01).
- **لا Vercel** (الحجب الخارجي حتى 2026-12-04 02:41 UTC قائم — بلا أي عمل عليه بطلب المالك).
- **لا عمليات مدفوعة** · **لا workflows جديدة** (احترام ميزانية دقائق Smart-Menu الموثقة).
- **cooldown احتُرم**: النسخ الأحدث من 24 ساعة (playwright 1.65.0 / lucide 1.70.0 / zustand 5.1.0
  في Smart-Menu) رُفضت تلقائيًا بسياسة المستودع — لكل مستودع حدّه المسموح.

## ملاحظات للمالك (خيارات، ليست التزامات)

1. **28 PR من Dependabot مفتوحة** عبر الأربعة (أول موجة بعد التفعيل): ترقيات ويب آمنة
   (eslint، tailwind-merge…)، majors تحتاج قرار (typescript 7، jsdom 30، motion 14،
   @types/node 26)، وPRs لـ **mobile/ مجمّدة بالتصميم** حتى إعادة بناء ثنائيات smartbot
   (EAS quota 2026-12-01) — لا تُدمج قبل قرار الإصدار.
2. **عقد lucide-react العائلي** (parity r133-G1 يقيد ^1.43.0 في Smart-Order): رفعه يتطلب
   تعديل العقد بتنسيق الأشقاء الثلاثة.
3. **هامش حزمة SmartBot** تقلص إلى 1.4KB (193.6/195KB) بعد next 16.4.5 — قرار r140
   (سقف 195) يحتاج مراجعة قريبًا.
4. **lint الواجهة الأمامية في SmartBot غير موصول بـ CI** (اكتشاف الموجة — خطأ مسبق عاش
   أخضر-غير-مرئي حتى هنا). توصية: إضافة `npm run lint` لبوابات ci.yml.
5. متطلبات Python في SmartBot (requirements.txt بالجذر) كلها floors بلا سقوف — أول موجة
   pip PRs صاخبة كما لوحظ (fastapi 0.115→0.162+ …).

## الأدلة

- البوابات المحلية لكل مستودع قبل الدفع (lint/typecheck/build/unit): exit 0 — موثقة في
  سجلات الوكلاء (agent-ctx) وفي رسائل الالتزامات.
- CI بعد الدفع: Smart-Link run `42242832570` · SmartBot quality-gates · Smart-Menu run
  `42242851208` (شاملة مهمة mobile الثقيلة) · Smart-Order CI — **كلها success**.
- actionlint + gitleaks: صفر ملاحظات/نتائج على الأربعة (قبل وبعد التعديلات).
