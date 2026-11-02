/* r14 (M7): أصغر Service Worker ممكن — الملاحة فقط عند فشل الشبكة.
   ---------------------------------------------------------------------------
   العقد الصريح: لا كاش لأي HTML إلا صفحة /offline نفسها. لا استراتيجية
   للأصول على مستوى الموقع، لا precache للموقع، لا runtime caching عام.
   الموقع الحي يظل المصدر الوحيد للحقيقة (فخ الكاش المتقادم الذي يحذّر
   منه CLAUDE.md يصبح مستحيلاً بالتصميم: لا يوجد ما يتقادم).

   W2-LNK-1 (P42-W2، تدقيق 3d): استثناء واحد محصور — «قرص الأوفلاين»:
   أصول صفحة /offline نفسها (ورقة CSS الواحدة + خطوطها + الأيقونات +
   manifest) تُخزَّن معها عند التثبيت، ويُخدَم أي منها من الكاش فقط عند
   فشل الشبكة. أونلاين: fetch حي دائمًا (سلوك مطابق للسابق حرفيًا)؛
   أوفلاين: الصفحة تُعرض مُنسَّقة بدل HTML خام — كانت هذه الثغرة
   المسجلة (offline fallback HTML-only). القائمة تُشتق من HTML الصفحة
   ذاتها عند التثبيت فتتبع أسماء الملفات المُهرّأة (content-hash) تلقائيًا.

   التزام تشغيلي وحيد: ارفع VERSION مع أي تغيير نصي على /offline. */
const VERSION = "v2"
const CACHE = `smartlink-offline-${VERSION}`
const OFFLINE_URL = "/offline"

/* W2-LNK-1: اشتقاق قرص الأوفلاين — كل href/src في HTML الصفحة يشير إلى
   مسار أصل محلي ثابت البادئات (/_next/static المُهرّأ، /fonts،
   /favicon، /icon، /apple-touch-icon، /logo، /manifest). الروابط
   الداخلية (/ ، /about…) وروابط أطراف أخرى مستبعدة عمدًا — ليست أصول
   عرض. */
const OFFLINE_ASSET_RE =
  /^\/(?:_next\/static\/|fonts\/|favicon|icon-|apple-touch-icon|logo|manifest)/
const OFFLINE_ASSET_PATHS = new Set()

function collectOfflineAssets(html) {
  const paths = new Set()
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1]
    if (!url.startsWith("/") || url.startsWith("//")) continue
    const clean = url.split("?")[0].split("#")[0]
    if (OFFLINE_ASSET_RE.test(clean)) paths.add(clean)
  }
  return paths
}

async function cacheOfflineShell() {
  const cache = await caches.open(CACHE)
  /* cache:"reload" يتجاوز أي نسخة HTTP مخزنة — التثبيت يجلب نسخة
     /offline الجديدة دائماً */
  const res = await fetch(new Request(OFFLINE_URL, { cache: "reload" }))
  const html = await res.text()
  await cache.put(OFFLINE_URL, new Response(html, res))
  const paths = collectOfflineAssets(html)
  OFFLINE_ASSET_PATHS.clear()
  for (const p of paths) OFFLINE_ASSET_PATHS.add(p)
  /* allSettled: أصل مفقود (خطأ عابر واحد) لا يفشل التثبيت كله — الصفحة
     بلا خط واحد أفضل من لا صفحة */
  await Promise.allSettled(
    [...paths].map((p) => cache.add(new Request(p, { cache: "reload" })))
  )
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await cacheOfflineShell()
      await self.skipWaiting()
    })()
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      /* حذف كل كاشات الإصدارات السابقة (الاسم يحمل الإصدار) */
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      )
      /* navigation preload: يبدأ طلب الشبكة بالتوازي مع إيقاظ الـSW
         — يلغي تكلفة بدء التشغيل التسلسلية على كل ملاحة (وإلا فالـSW
         يضيف زمناً لكل تنقل على الجوال البارد) */
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable()
      }
      await self.clients.claim()
    })()
  )
})

/* تحديث /offline وقرصها مرة كل 24 ساعة لكل عمر SW — يمنع تقادم رقم
   الواتساب/النصوص/أسماء الأصول المُهرّأة داخل تجربة الأوفلاين دون
   إعادة تثبيت */
let lastOfflineRefresh = 0
async function refreshOfflinePage() {
  const now = Date.now()
  if (now - lastOfflineRefresh < 24 * 60 * 60 * 1000) return
  lastOfflineRefresh = now
  try {
    await cacheOfflineShell()
  } catch {
    /* الشبكة مقطوعة الآن — النسخة القائمة تكفي */
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request

  if (req.mode !== "navigate") {
    /* W2-LNK-1: أصول قرص الأوفلاين فقط — fetch حي أولًا (مطابق للسلوك
       السابق أونلاين)، وعند فشل الشبكة تُخدَم من الكاش كي تُعرض صفحة
       الأوفلاين منسّقة. كل ما عداها (POST /api/contact، خطوط صور
       الصفحات الأخرى، تحليلات) يُرجع فورًا بلا respondWith — المتصفح
       ينفّذ الطلب كما لو لا وجود للـSW: هذا القرار تحديداً هو ما يُبقي
       اختبارات Playwright (page.route على api/contact) تعمل بلا تغيير،
       والمجموعة هنا محصورة بمسارات القرص المعروفة سلفًا. */
    if (
      req.method === "GET" &&
      OFFLINE_ASSET_PATHS.size > 0 &&
      new URL(req.url).origin === self.location.origin &&
      OFFLINE_ASSET_PATHS.has(new URL(req.url).pathname)
    ) {
      event.respondWith(
        (async () => {
          try {
            return await fetch(req)
          } catch {
            return (
              (await caches.match(req, { cacheName: CACHE })) ??
              Response.error()
            )
          }
        })()
      )
    }
    return
  }

  event.respondWith(
    (async () => {
      try {
        /* network-first: أولوية ل preload الموازية وإلا fetch عادي */
        const res = (await event.preloadResponse) || (await fetch(req))
        /* لا نكتب res في أي كاش إطلاقاً — HTML حي دائمًا */
        event.waitUntil(refreshOfflinePage())
        return res
      } catch {
        const cached = await caches.match(OFFLINE_URL, { cacheName: CACHE })
        return (
          cached ??
          /* شبكة ميتة + كاش فارغ (فشل التثبيت سابقاً) = رد أخير مهذب */
          new Response("لا يوجد اتصال بالإنترنت", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
        )
      }
    })()
  )
})
