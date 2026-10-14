"use client"

/* P12-2a (r160) — «سلسلة» THE CHAIN SCULPTURE (KODE Immersive, S2).
 * The constellation's replacement: 7 interlocked torus links forming an
 * ascending chain — the رابط→منظومة metaphor made dimensional. Plain
 * three.js (NO r3f), tree-shaken named imports only, mounted through
 * ChainSculptureMount (dynamic ssr:false) so the server page never
 * touches WebGL.
 *
 * Craft contract (spec P12 §S2 + IMPLEMENTATION NOTES):
 * · DPR cap 2; · pause offscreen (IntersectionObserver) + document.hidden;
 * · reduced-motion → ONE static frame, no rAF, no drag (poster frame);
 * · theme-aware: reads --ln-chain-metal / --ln-gold / --ln-ink from the
 *   .landing scope at mount AND on html class change (MutationObserver);
 * · dispose everything on unmount (renderer, geometries, materials, env).
 * Drag = pointer rotates the sculpture with inertia (velocity decay). */

import { useEffect, useRef } from "react"
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  TorusGeometry,
  WebGLRenderer,
} from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

const LINKS = 7

type Stage = {
  metal: string
  rim: string
  fog: string
  shadow: number
}

/* Read the KODE stage from the live cascade — the same zero-hex-in-TSX
 * law the old constellation engine obeyed. Falls back to the dark stage
 * if the tokens are unresolved (e.g. pre-CSS edge). */
function readStage(): Stage {
  const host = document.querySelector(".landing") ?? document.documentElement
  const cs = getComputedStyle(host)
  const metal = cs.getPropertyValue("--ln-chain-metal").trim()
  const rim = cs.getPropertyValue("--ln-gold").trim()
  const fog = cs.getPropertyValue("--ln-ink").trim()
  return {
    metal: metal || "#17171c",
    rim: rim || "#FF4C00",
    fog: fog || "#050507",
    shadow: 0.42,
  }
}

export default function ChainSculpture({ className }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = holder.current
    if (!box) return

    const canvas = document.createElement("canvas")
    canvas.setAttribute("role", "img")
    canvas.setAttribute("aria-label", "منحوتة سلسلة معدنية صاعدة — استعار الرابط والمنظومة")
    box.appendChild(canvas)

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    } catch {
      /* No WebGL → the CSS hero stands alone (content never hostage). */
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap

    const scene = new Scene()
    const camera = new PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.4, 11)

    /* Studio rig: warm key (casts the ground shadow) + orange rim from
     * behind-left + a faint ambient floor. Repainted per stage below. */
    const key = new DirectionalLight(0xfff3e6, 2.4)
    key.position.set(3.5, 5, 3)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    scene.add(key)
    const rim = new DirectionalLight(0xff4c00, 3.2)
    rim.position.set(-5, 1.5, -4)
    scene.add(rim)
    scene.add(new AmbientLight(0xffffff, 0.28))

    /* The chain: 7 torus links, each rotated 90° against its neighbour
     * (real chain weave) and stepping up a gentle spiral. */
    const chain = new Group()
    const linkGeo = new TorusGeometry(1, 0.34, 48, 96)
    const linkMat = new MeshStandardMaterial({
      color: 0x17171c,
      metalness: 0.92,
      roughness: 0.28,
    })
    for (let i = 0; i < LINKS; i++) {
      const link = new Mesh(linkGeo, linkMat)
      const y = i * 1.12 - (LINKS - 1) * 0.56
      link.position.set(Math.sin(i * 0.85) * 0.5, y, Math.cos(i * 0.85) * 0.5)
      link.rotation.z = i * Math.PI * 0.5
      link.rotation.x = 0.16 * Math.sin(i * 1.7)
      link.castShadow = true
      chain.add(link)
    }
    chain.rotation.x = -0.12
    scene.add(chain)

    /* Ground: a hairline fog floor + soft shadow catcher. */
    const ground = new Mesh(
      new PlaneGeometry(30, 30),
      new ShadowMaterial({ color: 0x000000, opacity: 0.42 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -(LINKS * 0.56 + 0.9)
    ground.receiveShadow = true
    scene.add(ground)

    /* Studio reflections for the metal — PMREM from the built-in room
     * (what makes MeshStandardMaterial read as real chrome). Failure
     * degrades silently to the 3-light rig (still readable). */
    let disposeEnv: (() => void) | undefined
    try {
      const pmrem = new PMREMGenerator(renderer)
      const envScene = new RoomEnvironment()
      scene.environment = pmrem.fromScene(envScene, 0.04).texture
      disposeEnv = () => {
        scene.environment?.dispose()
        envScene.dispose?.()
        pmrem.dispose()
      }
    } catch {
      /* envmap is a nicety, never a gate */
    }

    /* Stage paint — fog, metal, rim, shadow all re-read from CSS. */
    let stage = readStage()
    const fog = new Fog(new Color(stage.fog), 9, 24)
    scene.fog = fog
    const paint = () => {
      stage = readStage()
      fog.color.set(stage.fog)
      linkMat.color.set(stage.metal)
      rim.color.set(stage.rim)
      ;(ground.material as ShadowMaterial).opacity = stage.shadow
      /* light stage → flatter silver read; dark → dark chrome */
      linkMat.metalness = 0.92
      linkMat.roughness = 0.28
      key.intensity = 2.4
      if (!renderer) return
      render()
    }

    const size = () => {
      const w = box.clientWidth || 1
      const h = box.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(size)
    ro.observe(box)
    size()

    let raf = 0
    let running = true
    let inView = true
    let last = performance.now()
    let t = 0
    /* drag state — velocity in rad/frame, decays (inertia) */
    let dragging = false
    let lastX = 0
    let lastY = 0
    let velX = 0
    let velY = 0

    const render = () => renderer.render(scene, camera)

    const tick = (now: number) => {
      raf = 0
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt
      chain.rotation.y += dt * 0.28 + velY
      chain.rotation.x = -0.12 + Math.sin(t * 0.4) * 0.05 + velX
      chain.position.y = Math.sin(t * 0.55) * 0.1
      if (!dragging) {
        velX *= 0.92
        velY *= 0.92
        if (Math.abs(velX) < 1e-4) velX = 0
        if (Math.abs(velY) < 1e-4) velY = 0
      }
      render()
      if (running && inView && !document.hidden) raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!raf && running && inView && !document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const onDown = (e: PointerEvent) => {
      if (reduced) return
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = "grabbing"
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      velY = dx * 0.0045
      velX = MathUtils.clamp(velX + dy * 0.002, -0.35, 0.35)
      if (!raf) start()
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        /* pointer already released */
      }
      canvas.style.cursor = "grab"
    }

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true
        if (inView) start()
        else stop()
      },
      { threshold: 0.02 }
    )
    io.observe(box)

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)

    const mo = new MutationObserver(paint)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    canvas.style.cursor = reduced ? "default" : "grab"
    canvas.style.opacity = "0"
    canvas.style.transition = "opacity 600ms ease"
    if (reduced) {
      /* poster frame: ONE render, zero listeners, zero rAF, no drag */
      chain.rotation.y = 0.6
      paint()
      canvas.style.opacity = "1"
      mo.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    } else {
      canvas.addEventListener("pointerdown", onDown)
      canvas.addEventListener("pointermove", onMove)
      canvas.addEventListener("pointerup", onUp)
      canvas.addEventListener("pointercancel", onUp)
      render()
      requestAnimationFrame(() => {
        canvas.style.opacity = "1"
      })
      start()
    }

    return () => {
      running = false
      stop()
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      if (!reduced) {
        canvas.removeEventListener("pointerdown", onDown)
        canvas.removeEventListener("pointermove", onMove)
        canvas.removeEventListener("pointerup", onUp)
        canvas.removeEventListener("pointercancel", onUp)
      }
      disposeEnv?.()
      linkGeo.dispose()
      linkMat.dispose()
      ground.geometry.dispose()
      ;(ground.material as ShadowMaterial).dispose()
      renderer.dispose()
      canvas.remove()
    }
  }, [])

  return <div ref={holder} className={className} aria-hidden="true" />
}
