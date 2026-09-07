import { test, expect } from "./fixtures"

/* r10 (testing audit G2): the route exports POST only — GET/PUT/DELETE
   must answer 405 (nothing anywhere in the suite enforced that; a future
   refactor exporting GET would ship silently). OPTIONS is the documented
   exception: Next answers CORS preflights itself with 204 No Content. */

test.describe("r10 — عقد الطرق: POST فقط", () => {
  for (const method of ["GET", "PUT", "DELETE"] as const) {
    test(`${method} /api/contact → 405 (لا استقبال لأي طريقة غير POST)`, async ({ request }) => {
      const res = await request.fetch("/api/contact", { method })
      expect(res.status()).toBe(405)
      // السلوك الفعلي الموثق: رد فارغ بلا جسم ولا content-type —
      // لا يُعالَج شيء ولا زحف يستطيع تشغيل الإرسال
      expect(await res.text()).toBe("")
    })
  }

  test("OPTIONS /api/contact → 204 (معالجة Next التلقائية لطلبات CORS preflight)", async ({ request }) => {
    const res = await request.fetch("/api/contact", { method: "OPTIONS" })
    expect(res.status()).toBe(204)
  })
})
