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
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  /* r10 (testing audit): list فقط جعل مسار playwright-report/ في خطوة
     رفع الـ artifacts بالـ CI ميتاً (لا يتولد أبداً). html يولّد التقرير
     الذي يُرفع فعلاً عند الفشل. */
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    locale: "ar-LY",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
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
