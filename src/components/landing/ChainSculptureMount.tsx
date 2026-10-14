"use client"

/* P12-2a (r160) — the client wrapper for the chain sculpture. Server
 * Components cannot pass ssr:false to next/dynamic, so this island owns
 * the dynamic boundary: page.tsx (server) imports THIS, and the three.js
 * bundle never blocks first paint of the type lockup. */

import dynamic from "next/dynamic"

const ChainSculpture = dynamic(() => import("./ChainSculpture"), {
  ssr: false,
  loading: () => null,
})

export function ChainSculptureMount({ className }: { className?: string }) {
  return <ChainSculpture className={className} />
}
