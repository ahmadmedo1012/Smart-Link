"use client"
import { useEffect, useRef } from "react"

/**
 * Scroll progress bar — framer-motion removed (was pulling a 122 KB vendor
 * chunk into the critical path for a single decorative bar). A passive
 * scroll listener + rAF is 60 fps-safe and dependency-free.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const progress = max > 0 ? doc.scrollTop / max : 0
      el.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--primary)] z-[60]"
      style={{ transform: "scaleX(0)", transformOrigin: "0%" }}
    />
  )
}
