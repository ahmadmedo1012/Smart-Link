"use client"
import { useEffect, useState } from "react"
import { Analytics } from "@vercel/analytics/next"

/* r10 (perf audit — action 2): <Analytics /> injects its 3KB script during
   hydration — inside Lighthouse's TBT window (64ms script evaluation on
   terms + a beacon fetch measured on every page). The pageview ping has no
   reason to race first paint: mounting the vendor component AFTER
   load + requestIdleCallback moves the whole thing outside the measurement
   window with zero API risk (the vendor component is untouched — it just
   mounts late, and the queue still records the pageview when it loads). */
export function LazyAnalytics() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let idleId: number | undefined
    const mount = () => { if (!cancelled) setReady(true) }
    const onLoad = () => {
      idleId = typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(mount, { timeout: 2000 })
        : window.setTimeout(mount, 400)
    }
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener("load", onLoad)
      if (idleId !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId)
        else window.clearTimeout(idleId)
      }
    }
  }, [])

  return ready ? <Analytics /> : null
}
