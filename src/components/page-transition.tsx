"use client"
import { usePathname } from "next/navigation"

/**
 * CSS-only page transition.
 *
 * WHY NOT framer-motion here: wrapping the entire app in
 * `initial={{ opacity: 0 }}` hides ALL content until hydration
 * completes — measured as the root cause of LCP 2.9-4.2s on every
 * page. A CSS keyframe animation starts at first paint (pre-JS),
 * so content is visible immediately while still animating in.
 * The key={pathname} re-mounts the div on navigation, which
 * re-triggers the entrance animation for in-app route changes
 * (JS is already loaded at that point, so the exit animation
 * trade-off is acceptable and imperceptible).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  )
}
