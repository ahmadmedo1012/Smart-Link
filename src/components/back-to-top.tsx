"use client"
import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

/* r8: the Footer is a server component now — this back-to-top control is
   its only client island, instead of hydrating 160+ lines of static
   footer markup for one button.

   r7 behavior preserved EXACTLY (probed live and regression-tested):
   - sentinel IntersectionObserver at y=401 → visible when sentinel has
     LEFT the viewport (the boolean is !isIntersecting — the r7 fix)
   - while hidden: aria-hidden + tabIndex=-1 (out of the a11y tree and
     the tab order — invisible controls must not be tabbable)
   - if the button held focus when it hid, release the focus
   - smooth scroll to top on click */
export function BackToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const sentinel = document.createElement("div")
    sentinel.style.position = "absolute"
    sentinel.style.top = "401px"
    sentinel.style.height = "1px"
    sentinel.style.width = "1px"
    sentinel.style.pointerEvents = "none"
    document.body.prepend(sentinel)
    const obs = new IntersectionObserver(
      ([e]) => setShowScrollTop(!e.isIntersecting),
      { rootMargin: "0px 0px 0px 0px" }
    )
    obs.observe(sentinel)
    return () => { obs.disconnect(); sentinel.remove() }
  }, [])

  useEffect(() => {
    if (!showScrollTop && btnRef.current && document.activeElement === btnRef.current) {
      btnRef.current.blur()
    }
  }, [showScrollTop])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      aria-label="العودة للأعلى"
      /* عند الظهور نحذف الخاصيتين تماماً بدل إصدار aria-hidden="false"
         الحرفي — DOM أنظف والسلوك واحد */
      aria-hidden={showScrollTop ? undefined : "true"}
      tabIndex={showScrollTop ? 0 : -1}
      className={`fixed bottom-6 right-6 w-11 h-11 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:shadow-glow transition-all duration-300 z-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  )
}
