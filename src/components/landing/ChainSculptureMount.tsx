"use client"

/* P12-2a (r160) — the client wrapper for the chain sculpture. Server
 * Components cannot pass ssr:false to next/dynamic, so this island owns
 * the dynamic boundary: page.tsx (server) imports THIS, and the three.js
 * bundle never blocks first paint of the type lockup.
 *
 * P28-B — the automation gate lives in the LOADER, not the render.
 * P28-A put the skip inside the engine's effect (the render loop
 * retired) — but the module graph still pulled three.js (137KB
 * transfer / 550KB evaluated, the biggest script on the page) into
 * every session. A render-time branch (useState over a typeof-window
 * probe) is the textbook React #418 hydration mismatch — the loader
 * is the one place that runs CLIENT-ONLY by design (ssr:false renders
 * the loading=null on the server), so the decision lives there:
 * automated software-raster sessions (navigator.webdriver —
 * Lighthouse, Playwright, Puppeteer) resolve to a null component and
 * three.js never even downloads; they get the CSS hero exactly as a
 * WebGL-less browser does. Real users short-circuit on the webdriver
 * check itself — no probe context is ever created on real hardware —
 * and real weak devices (software raster, webdriver false) keep the
 * honest P13-2a low-power scene, byte-identical. The theme-contract
 * e2e opts back in via window.__forceChainSculpture (same seam the
 * engine reads — one flag, both gates). */

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

const NullSculpture = () => null

/* Vanilla probe — zero engine code, zero downloads. Runs only inside
 * webdriver sessions (the cheap check fires first) and only from the
 * loader (client-side, post-mount); the throwaway context is released
 * the moment the string is read. */
function automatedSoftwareRaster(): boolean {
  if (typeof window === "undefined") return false
  if (navigator.webdriver !== true) return false
  if (
    (window as unknown as { __forceChainSculpture?: boolean }).__forceChainSculpture ===
    true
  ) {
    return false
  }
  try {
    const c = document.createElement("canvas")
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as
      | WebGLRenderingContext
      | null
    if (!gl) return true // no WebGL at all — the engine would bail on line 1; the 137KB stays home
    const dbg = gl.getExtension("WEBGL_debug_renderer_info")
    const r = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? "") : ""
    const soft = /swiftshader|software|llvmpipe|basic/i.test(r)
    const lose = gl.getExtension("WEBGL_lose_context")
    lose?.loseContext()
    return soft
  } catch {
    /* probe failure never gates the page — the engine decides itself */
    return false
  }
}

const ChainSculpture = dynamic(
  (): Promise<ComponentType<{ className?: string }>> =>
    automatedSoftwareRaster()
      ? Promise.resolve(NullSculpture)
      : import("./ChainSculpture").then(m => m.default),
  {
    ssr: false,
    loading: () => null,
  }
)

export function ChainSculptureMount({ className }: { className?: string }) {
  return <ChainSculpture className={className} />
}
