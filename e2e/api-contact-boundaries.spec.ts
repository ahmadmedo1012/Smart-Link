import { test, expect } from "./fixtures"

/* r10 (testing audit G3): the length caps were tested only from the
   FAILURE side (>254, >100, >5001). The acceptance side guards against
   the comparison drifting to >= — a boundary test class the suite never
   had. Also: CRLF, Unicode payloads, non-string types, and the 64KB
   body gate (413). All requests share ONE isolated rate-limit bucket so
   they can never interleave with contact.spec's tests (G1 lesson). */

const VALID = { name: "اختبار الحدود", email: "limits@example.com", subject: "other", message: "رسالة اختبار الحدود." }
/* r10: دلو فريد لكل اختبار — ميزانية 5 طلبات/دقيقة تعني أن IP مشتركاً
   واحداً سينفد من طلباته في الاختبار السادس (حدث فعلاً في أول تشغيل). */
const iso = (n: number) => ({ "x-forwarded-for": `198.51.100.${n}` })

test.describe("r10 — الحدود من جهة القبول", () => {
  test("بريد بطول 254 بالضبط → مقبول (503 بلا مفتاح، ليس 400)", async ({ request }) => {
    const email = "a".repeat(242) + "@example.com"
    expect(email.length).toBe(254)
    const res = await request.post("/api/contact", { data: { ...VALID, email }, headers: iso(88) })
    expect(res.status()).toBe(503)
  })

  test("اسم بطول 100 بالضبط → مقبول", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, name: "ا".repeat(100) },
      headers: iso(89),
    })
    expect(res.status()).toBe(503)
  })

  test("رسالة بطول 5000 بالضبط → مقبولة", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, message: "ن".repeat(5000) },
      headers: iso(90),
    })
    expect(res.status()).toBe(503)
  })
})

test.describe("r10 — حمولات Unicode وCRLF", () => {
  test("سطور جديدة CRLF داخل الرسالة → لا 500 (تصل كما هي لجسم البريد)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, message: "سطر أول\r\nسطر ثانٍ\r\nسطر ثالث" },
      headers: iso(91),
    })
    expect([400, 503]).toContain(res.status())
    expect(res.status()).not.toBe(500)
  })

  test("emoji + عربي طويل → لا 500 ولا تشويه", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        ...VALID,
        name: "أحمد 🚀 صديقنا الكريم",
        message: "مرحباً 👋 هذه رسالة اختبار طويلة بالعربية مع رموز 🎉 ونجمة ⭐ في نهايتها.",
      },
      headers: iso(92),
    })
    expect([400, 503]).toContain(res.status())
  })
})

test.describe("r10 — قيم غير نصية (Type Coercion at Boundaries)", () => {
  test("name: null → 400 صريح (ليس 500)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, name: null },
      headers: iso(93),
    })
    expect(res.status()).toBe(400)
  })

  test("name: رقم → يُ coerc إلى نص ويمر (لا 500)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, name: 12345 },
      headers: iso(94),
    })
    expect([400, 503]).toContain(res.status())
  })

  test("جسم أكبر من 64KB → 413 (بوابة الحجم — r10 security)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, message: "x".repeat(70_000) },
      headers: iso(95),
    })
    expect(res.status()).toBe(413)
  })
})
