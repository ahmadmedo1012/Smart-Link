import { test, expect } from "./fixtures"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * P42-8d (تدقيق الأمن) — بوابة أسرار حزمة العميل.
 * ---------------------------------------------------------------------------
 * الحزمة التي تُسفِر للعالم هي سطح عمومي مثل أي صفحة: ما دخل ملفات
 * .next/static يقرؤه كل زائر في view-source. هذه البوابة تعمل على
 * مخرجات البناء الحقيقية (CI يبني قبل الـe2e — نفس ترتيب ci.yml،
 * ومحلياً نفس العقد: npm run build && npm run test:e2e).
 *
 * العيب الذي وُلدت منه: صندوق المالك الخاص عاش على كائن SITE
 * («لا يُعرض أبداً» في كل تعليق) بينما ثلاثة مكوّنات client تستورد
 * SITE فتسفِر الكائن حرفياً — سُتة chunks عمومية كانت تحمل البريد
 * في بناء 16.4 (فُحص: rg على .next/static). الإصلاح نقل الثابت إلى
 * مسار الخادم وحده؛ هذه البوابة تمنع عودة الصنف كله، لا الحالة
 * الواحدة:
 *   1. قيمة وجهة الإشعارات الخاصة (تُشتق من مصدرها في route.ts —
 *      لا نسخة ثانية) يجب أن تكون غائبة عن كل bytes عمومية.
 *   2. جرد أشكال الاعتمادات المعروفة (مفاتيح API/توكنات/شهادات)
 *      يجب أن يكون فارغاً — أي ظهور مستقبلي لمفتاح حقيقي في الحزمة
 *      يكسر البناء قبل أن يصل الإنتاج.
 * التوائم: tests/unit/site.test.ts يقفل «SITE بلا مفاتيح خاصة» على
 * مستوى المصدر — هذه تقفل الحزمة المبنية على مستوى البايتات.
 */

/** كل ملفات JS العمومية في مخرجات البناء (chunks + static). */
function clientChunkFiles(): string[] {
  const root = join(process.cwd(), ".next", "static")
  const out: string[] = []
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) walk(full)
      else if (name.endsWith(".js")) out.push(full)
    }
  }
  walk(root)
  return out
}

/** قيمة OWNER_EMAIL من مصدرها الواحد — مسار الخادم. لا نسخة ثانية
 *  للقيمة في هذا الملف؛ البوابة تتبع الحقيقة لا تكررها. */
function ownerNotificationEmail(): string {
  const route = readFileSync(
    join(process.cwd(), "src", "app", "api", "contact", "route.ts"),
    "utf8"
  )
  const m = route.match(/OWNER_EMAIL\s*=\s*"([^"]+)"/)
  if (!m) throw new Error("OWNER_EMAIL لم يعد في api/contact/route.ts — حدّث البوابة")
  return m[1]
}

/* أشكال اعتمادات معروفة بحدود رمزية صريحة (lookbehind/lookahead) كي
   لا تُطارد أسماء CSS/متغيرات مصغّرة عابرة: أول تشغيل اصطاد
   «sk-image-linear-from-pos» من أدوات mask-image في حزمة Tailwind —
   الحرف قبل sk- كان حرفاً من «mask» فالحد الرمزي هو الفيصل.
   المفتاح الحقيقي يقف وحده بين حدود غير كلمة. */
const CREDENTIAL_SHAPES: Array<{ re: RegExp; what: string }> = [
  { re: /(?<![A-Za-z0-9_-])re_[A-Za-z0-9]{20,}(?![A-Za-z0-9_-])/, what: "resend api key" },
  { re: /(?<![A-Za-z0-9_-])sk-(?:proj-)?[A-Za-z0-9_-]{20,}(?![A-Za-z0-9_-])/, what: "openai-style api key" },
  { re: /(?<![A-Za-z0-9_-])ghp_[A-Za-z0-9]{20,}(?![A-Za-z0-9_-])/, what: "github token" },
  { re: /(?<![A-Za-z0-9_-])AKIA[A-Z0-9]{12,}(?![A-Za-z0-9_-])/, what: "aws access key" },
  { re: /(?<![A-Za-z0-9_-])AIza[A-Za-z0-9_-]{25,}(?![A-Za-z0-9_-])/, what: "google api key" },
  { re: /(?<![A-Za-z0-9_-])xox[baprs]-[A-Za-z0-9-]{10,}(?![A-Za-z0-9-])/, what: "slack token" },
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/, what: "private key material" },
]

test.describe("P42-8d — حزمة العميل خالية من الأسرار", () => {
  test("وجهة إشعارات المالك الخاصة غائبة عن كل chunk عمومي", () => {
    const files = clientChunkFiles()
    // عقد وجود البناء نفسه — رسالة فشل أوضح من ENOENT غامض
    expect(files.length, ".next/static/chunks فارغ — شغّل npm run build أولاً").toBeGreaterThan(0)
    const secret = ownerNotificationEmail()
    const offenders: string[] = []
    for (const f of files) {
      if (readFileSync(f, "utf8").includes(secret)) offenders.push(f)
    }
    expect(
      offenders,
      `FINDING[bundle-secrets] البريد الخاص في حزم العميل: ${offenders.join(", ")} — SITE ومسارات client تُسفِّر الثوابت حرفياً (P42-8d)`
    ).toEqual([])
  })

  test("صفر أشكال اعتمادات (مفاتيح/توكنات/شهادات) في كل chunk", () => {
    const files = clientChunkFiles()
    const hits: string[] = []
    for (const f of files) {
      const src = readFileSync(f, "utf8")
      for (const { re, what } of CREDENTIAL_SHAPES) {
        const m = src.match(re)
        if (m) hits.push(`${f}: ${what} (${m[0].slice(0, 8)}…)`)
      }
    }
    expect(
      hits,
      `FINDING[bundle-secrets] أشكال اعتمادات في حزم العميل: ${hits.join(" | ")}`
    ).toEqual([])
  })
})
