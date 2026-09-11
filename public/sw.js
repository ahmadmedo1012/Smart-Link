/* r14 (M7): أصغر Service Worker ممكن — الملاحة فقط عند فشل الشبكة.
   ---------------------------------------------------------------------------
   العقد الصريح: لا كاش لأي HTML إلا صفحة /offline نفسها. لا استراتيجية
   للأصول، لا precache للموقع، لا runtime caching. الموقع الحي يظل المصدر
   الوحيد للحقيقة (فخ الكاش المتقادم الذي يحذّر منه CLAUDE.md يصبح مستحيلاً
   بالتصميم: لا يوجد ما يتقادم).

   التزام تشغيلي وحيد: ارفع VERSION مع أي تغيير نصي على /offline. */
const VERSION = "v1"
const CACHE = `smartlink-offline-${VERSION}`
const OFFLINE_URL = "/offline"

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      /* cache:"reload" يتجاوز أي نسخة HTTP مخزنة — التثبيت يجلب نسخة
         /offline الجديدة دائماً */
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }))
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

/* تحديث /offline نفسها مرة كل 24 ساعة لكل عمر SW — يمنع تقادم
   رقم الواتساب/النصوص داخل صفحة الأوفلاين دون إعادة تثبيت */
let lastOfflineRefresh = 0
async function refreshOfflinePage() {
  const now = Date.now()
  if (now - lastOfflineRefresh < 24 * 60 * 60 * 1000) return
  lastOfflineRefresh = now
  try {
    const cache = await caches.open(CACHE)
    await cache.add(new Request(OFFLINE_URL, { cache: "reload" }))
  } catch {
    /* الشبكة مقطوعة الآن — النسخة القائمة تكفي */
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request

  /* الملاحة فقط. كل ما عداها (POST /api/contact، خطوط، صور، JS/CSS):
     إرجاع فوري بلا respondWith وبلا fetch() من داخل الـSW — المتصفح
     ينفّذ الطلب كما لو لا وجود للـSW أصلاً. هذا القرار تحديداً هو ما
     يُبقي اختبارات Playwright (page.route على مسار api/contact في
     عدة specs) تعمل بلا أي تغيير: الطلبات تبقى طلبات الصفحة. */
  if (req.mode !== "navigate") return

  event.respondWith(
    (async () => {
      try {
        /* network-first: أولوية ل preload الموازية وإلا fetch عادي */
        const res = (await event.preloadResponse) || (await fetch(req))
        /* لا نكتب res في أي كاش إطلاقاً — HTML حي دائماً */
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
