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
  reporter: [["list"]],
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
  },
})
