"use client"

import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { useMagnetic } from "@/hooks/useMagnetic"

/* r128 Stage B (F2b) — the gold conversion pill with the canonical
   magnetic pull (PORT-KIT §4: hero/finale CTA strength 7). Client island
   around a plain anchor so the surrounding page stays server-rendered;
   useMagnetic writes --mag-x/--mag-y, the CSS in landing.css §0g
   consumes them (R8). */

export function MagneticGoldLink({
  href,
  external = false,
  xl = false,
  withArrow = false,
  children,
  ariaLabel,
}: {
  href: string
  external?: boolean
  xl?: boolean
  withArrow?: boolean
  children: ReactNode
  ariaLabel?: string
}) {
  const ref = useMagnetic<HTMLAnchorElement>(7)

  return (
    <a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`ln-btn-gold${xl ? " xl" : ""}`}
      aria-label={ariaLabel}
    >
      {children}
      {/* r151 (P3-2, audit-SL C2): the xl ternary split the ONE gold-pill
          family into 14px/16px icons — the header/finale/world CTAs ride
          16 while the hero measured 14. One pill family, one icon size. */}
      {withArrow && <ArrowLeft size={16} aria-hidden="true" />}
    </a>
  )
}
