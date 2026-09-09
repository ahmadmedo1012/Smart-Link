import { test, expect } from "./fixtures"
import net from "node:net"

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

  /* r13 (testing audit): كان الاسم «يُcoerc ويمر» والجسم يقبل 400 أيضاً —
     توثيق لسلوك ما قبل جراحة r11 (الأنواع الآن تُفحص قبل أي إكراه فلا
     يمرّ رقم أبداً). الاسم كذب والاختبار أخضر: الاسم والتحديد صارا
     العقد الحقيقي — 400 صريح. */
  test("name: رقم → 400 صريح (r11: الأنواع تُفحص قبل أي إكراه)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, name: 12345 },
      headers: iso(94),
    })
    expect(res.status()).toBe(400)
  })

  test("جسم أكبر من 64KB → 413 (بوابة الحجم — r10 security)", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { ...VALID, message: "x".repeat(70_000) },
      headers: iso(95),
    })
    expect(res.status()).toBe(413)
  })
})

/* ══════════════════════════════════════════════════════════════
 * r13 (security audit P2) — انحدار XFF: آخر قيمة هي مفتاح الدلو
 *
 * إصلاح r10 (clientIp يأخذ آخر قيمة) لم يُقفل قط بأي اختبار —
 * رجوعه إلى [0] سيمرّ بالجناح كله أخضر. هذه الاختبارات تزوّر
 * الترويسة كما يفعل المهاجم بالضبط، وتستخدم مسار honeypot
 * (r13: صار يستهلك ميزانية المعدل) فيكون حد الدلو صارخاً بلا
 * أي اعتماد على RESEND_API_KEY.
 * ══════════════════════════════════════════════════════════════ */
test.describe("r13 — انحدار XFF (آخر قيمة = مفتاح الدلو)", () => {
  test("تدوير أول قيمة لا يفلت من الدلو — السادسة 429 مع Retry-After", async ({ request }) => {
    // 5 طلبات بأول قيمة متغيرة (تزوير كلاسيكي) وآخر قيمة ثابتة
    for (let i = 1; i <= 5; i++) {
      const res = await request.post("/api/contact", {
        data: { ...VALID, company: `bot-${i}` },
        headers: { "x-forwarded-for": `9.9.9.${i}, 203.0.113.77` },
      })
      expect(res.status(), `الطلب ${i} داخل الحد`).toBe(200)
    }
    // السادسة: تزوير جديد في أول قيمة، نفس آخر قيمة → الدلو ممتلئ
    const sixth = await request.post("/api/contact", {
      data: { ...VALID, company: "bot-6" },
      headers: { "x-forwarded-for": "8.8.8.8, 203.0.113.77" },
    })
    expect(sixth.status()).toBe(429)
    expect(sixth.headers()["retry-after"]).toBe("60")
  })

  test("آخر قيمة مختلفة = دلو مختلف (لا حجب جماعي للضحايا)", async ({ request }) => {
    // نفس أول قيمة السيل أعلاه، آخر قيمة مختلفة → دلو مستقل → 200
    const res = await request.post("/api/contact", {
      data: { ...VALID, company: "other-victim" },
      headers: { "x-forwarded-for": "9.9.9.1, 203.0.113.78" },
    })
    expect(res.status()).toBe(200)
  })
})

/* ══════════════════════════════════════════════════════════════
 * r13 (security audit P2) — بوابة الحجم الحقيقية
 *
 * بوابة 413 القديمة قرأت content-length — قيمة يتحكم بها العميل
 * وتغيب كلياً مع Transfer-Encoding: chunked: البوابة كانت قابلة
 * للتفادي في بالضبط السيناريو الذي وُلدت له. الطلب هنا socket خام
 * بلا content-length إطلاقاً وجسم مقطّع — لا يمكن بناؤه عبر
 * APIRequestContext (يعيد حساب الترويسة).
 * ══════════════════════════════════════════════════════════════ */
test.describe("r13 — بوابة الحجم تقيس الجسم الفعلي", () => {
  test("Transfer-Encoding: chunked بجسم 70KB وبلا content-length → 413", async () => {
    const payload = JSON.stringify({ ...VALID, message: "x".repeat(70_000) })
    const res = await new Promise<string>((resolve, reject) => {
      const sock = net.connect(3000, "127.0.0.1")
      sock.setTimeout(10_000)
      let data = ""
      sock.on("connect", () => {
        const chunks: string[] = []
        for (let i = 0; i < payload.length; i += 1000) {
          const c = payload.slice(i, i + 1000)
          /* chunk-size بالإصدار الحرج: بايتات (النص العربي 2 بايت/محرف —
             عدّ المحارف جعل Node يرفض الطلب بـ400 قبل الوصول للمسار) */
          chunks.push(Buffer.byteLength(c).toString(16) + "\r\n" + c + "\r\n")
        }
        chunks.push("0\r\n\r\n")
        sock.write(
          "POST /api/contact HTTP/1.1\r\n" +
            "Host: localhost:3000\r\n" +
            "Content-Type: application/json\r\n" +
            "Transfer-Encoding: chunked\r\n" +
            "Connection: close\r\n\r\n" +
            chunks.join("")
        )
      })
      sock.on("data", (d) => (data += d.toString()))
      sock.on("end", () => resolve(data))
      sock.on("timeout", () => { sock.destroy(); resolve(data) })
      sock.on("error", reject)
    })
    /* قبل r13: لا content-length → البوابة القديمة لا ترى الجسم أصلاً
       فيمرّ إلى JSON.parse ثم رفض 400 (طول الرسالة) — ليس 413 أبداً. */
    expect(res).toMatch(/^HTTP\/1\.1 413/)
  })
})
