"use client"
import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] bg-[var(--muted-foreground)]/30 z-[60] origin-right"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  )
}
