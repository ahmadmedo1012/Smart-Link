"use client"

import { useEffect } from "react"
import { registerDomReveals } from "@/hooks/useReveal"

/* r130 (W1-D P2-11): the JS half of the canonical reveal conversion.
 *
 * The product pages' `.reveal-up` family was an on-load CSS ANIMATION
 * (translateY 24px, 120ms delay steps) — it played without JS but rode
 * none of the canonical grammar. styles.css now carries the canonical
 * transition family (polish.css:470-488: 14px distance, 80ms steps)
 * gated by a one-shot `.in-view` class, and this island is what writes
 * it: on mount it hands every `.reveal-up` element on the page to the
 * useReveal SHARED belt (mount check, fling-hardening, scrollend/
 * resize/fonts reconcile) — the exact engine the landing's
 * RevealCssClass components use, not a second observer system.
 *
 * Rendered by SiteChrome on every product page (about/pricing/contact/
 * privacy/terms/offline/404/error) — the landing ("/") owns its own
 * world and its own reveal wiring. No-JS browsers are covered by the
 * `@media (scripting: none)` reveal rule in styles.css.
 */
export function RevealObserver() {
  useEffect(() => registerDomReveals(), [])
  return null
}
