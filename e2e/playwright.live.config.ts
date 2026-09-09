import { defineConfig, devices } from "@playwright/test"

/**
 * r11 — إعداد المحاكاة على الموقع الحي (production).
 * نفس جناح المحاكاة (sim-*) لكن ضد https://smart-link.ly:
 * - بلا webServer (لا بناء محلي) وبا baseURL حياً
 * - كل POSTs الوهمية (route.fulfill/abort) تعمل كما هي — لا تلمس الخادم
 * - الحد الحقيقي: نموذج الاتصال الحي يشارك دلو معدل واحداً لـIP هذا
 *   الجهاز (5/دقيقة) — لهذا تُستثنى اختبارات POST الحقيقية عند التشغيل
 *   (انظر أمر التشغيل في CLAUDE.md/التوثيق)
 *
 * r13 (security audit P2): الاستثناء صار بنيوياً لا بالأمر — التشغيل
 * العاري (بلا فلترة أسماء الملفات) كان يطلق POSTs حقيقية على
 * الإنتاج، وتصبح رسائل بريد فعلية باسم النطاق لحظة إضافة
 * RESEND_API_KEY. sim-adversarial (الجناح الوحيد الذي يمرّر للخادم)
 * مرفوض من هذا التكوين بـtestIgnore — التشغيل الآمن هو الافتراض.
 *
 * التشغيل:
 *   npx playwright test --config e2e/playwright.live.config.ts --workers=2
 */
export default defineConfig({
  /* ملف الإعداد داخل e2e/ — testDir نسبي لموقعه هو نفسه */
  testDir: ".",
  testIgnore: /sim-adversarial/,
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: "https://smart-link.ly",
    trace: "off",
    locale: "ar-LY",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
