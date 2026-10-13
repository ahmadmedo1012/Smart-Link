import { defineConfig, devices } from "@playwright/test"

/**
 * SmartLink E2E — Playwright + axe-core
 *
 * r7: كل جودة الجولات السابقة كانت تُقاس بسكربتات خارج المستودع.
 * هذا الجناج يجعل الضمانات قابلة لإعادة التشغيل من المستودع نفسه:
 *   npm run build && npm run test:e2e
 *
 * webServer يفترض بناءً إنتاجياً جاهزاً (`next build` ثم `next start`)
 * — نفس ما يفعله CI بالضبط، ونفس ما يخدمه Vercel.
 */
/* r-phase6 (P6-2-a — P6 e2e mandate): المنفذ قابل للتهيئة عبر البيئة.
 * الافتراضي 3111 — بُني عمداً لكي لا يلتقي أبداً بخادم mission-control
 * على 3000 في بيئة الصندوق المشترك (آلة الرملة تُشغّل لوحة المهمة هناك).
 * الـ CI لا يضبط شيئاً فيحصل على 3111؛ أي بيئة تستطيع التخطي عبر E2E_PORT. */
const E2E_PORT = process.env.E2E_PORT || "3111"
const E2E_BASE_URL = `http://localhost:${E2E_PORT}`

/* r-phase6 (P6-2-a): عدد العمال قابل للتهيئة عبر E2E_WORKERS — بلا ضبط
 * يبقى السلوك كما هو تماماً (4 محلياً، 2 في CI). الغرض الوحيد: صناديق
 * الذاكرة المقيدة (مثل بيئة الرملة: 2 نواة/4GB) يمكنها خفض التوازي بدل
 * انهيار «Target crashed» لمتصفحات chromium تحت ضغط الذاكرة مع صفحة
 * الهب ذات الكانفس الثقيل + لقطات fullPage. نفس الاختبارات، نفس
 * التأكيدات — تسلسل أكثر فقط. */
const E2E_WORKERS = process.env.E2E_WORKERS
  ? Number(process.env.E2E_WORKERS)
  : undefined

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: E2E_WORKERS ?? (process.env.CI ? 2 : 4),
  /* r10 (testing audit): list فقط جعل مسار playwright-report/ في خطوة
     رفع الـ artifacts بالـ CI ميتاً (لا يتولد أبداً). html يولّد التقرير
     الذي يُرفع فعلاً عند الفشل. */
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: E2E_BASE_URL,
    trace: "on-first-retry",
    locale: "ar-LY",
    /* r14 (M7): الحزام والسبتنك — الموقع يسجل الآن SW على كل صفحة.
     حجبه هنا يجعل الـ268+ اختباراً محصنين من أي سلوك SW مستقبلي
     (اعتراض الطلبات/الكاش) بلا استثناء واحد، وspec الأوفلاين المخصص
     يفتح سياقه الخاص بـ serviceWorkers:"allow" لاختبار السلوك
     الحقيقي. التسجيل نفسه لا يولّد ضوضاء console (السكربت inline
     يبتلع الفشل بـ.catch). */
    serviceWorkers: "block",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run start -- --port ${E2E_PORT}`,
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    /* r13 (testing audit F — قنبلة التوقيت): مواصفات API المجمّعة
       كانت تعبر الصمام العالمي للخادم (20/دقيقة، درع إنتاج ضد دوران
       الـIP) فتقلب اختبارات بعيدة إلى 429. منصة الاختبار ترفعه إلى
       500 — دلو الـIP (5/دقيقة، الصمام الذي تختبره اختبارات
       الحدود فعلاً) لا يُمسّ. الإنتاج الحي بلا متغير = 20. */
    env: { ...process.env, RATE_GLOBAL_MAX: "500" },
  },
})
