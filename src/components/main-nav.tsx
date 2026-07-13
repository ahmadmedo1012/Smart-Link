"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Smartphone, Bot, ChevronDown, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const navLinks = [
  { href: "/", label: "الرئيسية" },
  {
    label: "خدماتنا",
    children: [
      { href: "https://menu.smart-link.ly", label: "Smart Menu - المنيو الرقمي", icon: Smartphone, desc: "حول منيو مطعمك إلى تجربة رقمية تفاعلية" },
      { href: "https://bot.smart-link.ly", label: "SmartBot - البوت الذكي", icon: Bot, desc: "أتمتة الردود على صفحات فيسبوك بذكاء" },
    ],
  },
  { href: "/about", label: "عن SmartLink" },
  { href: "/contact", label: "اتصل بنا" },
]

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15
      setPos({ x, y })
    }
    const onLeave = () => setPos({ x: 0, y: 0 })
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={cn("magnetic-btn", className)} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      {children}
    </div>
  )
}

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const headerRef = useRef<HTMLDivElement>(null)
  const prefersReduce = useReducedMotion()
  if (prefersReduce) {} // ponytail: reference kept for AnimatePresence gating

  useEffect(() => setMounted(true), [])

  // IntersectionObserver for scroll state — avoids style recalc per scroll frame
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const sentinel = document.createElement("div")
    sentinel.style.position = "absolute"
    sentinel.style.top = "21px"
    sentinel.style.height = "1px"
    sentinel.style.width = "1px"
    sentinel.style.pointerEvents = "none"
    document.body.prepend(sentinel)
    const obs = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { rootMargin: "-20px 0px 0px 0px" }
    )
    obs.observe(sentinel)
    return () => { obs.disconnect(); sentinel.remove() }
  }, [])

  return (
    <header ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background,backdrop-filter,border-color] duration-[var(--move-base)]",
        scrolled
          ? "bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Shimmer bar on scroll */}
      {scrolled && <div className="shimmer-bar" aria-hidden="true" />}

      <div className="container-base flex items-center justify-between h-16 md:h-[72px]">
        <Link href="/" className="flex items-center group relative">
          <Image src="/logo.png" alt="SmartLink" width={150} height={38} className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setDesktopServicesOpen(true)}
                onMouseLeave={() => setDesktopServicesOpen(false)}
                onFocus={() => setDesktopServicesOpen(true)}
                onBlur={() => setDesktopServicesOpen(false)}
              >
                <button
                  aria-haspopup="true"
                  aria-expanded={desktopServicesOpen}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-[var(--accent)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
                >
                  {link.label}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover/nav:rotate-180" style={{ transform: desktopServicesOpen ? "rotate(180deg)" : undefined }} />
                </button>
                <AnimatePresence>
                  {desktopServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full right-0 mt-2 w-80"
                    >
                      <div className="glass-strong rounded-2xl p-2 shadow-xl">
                        {link.children.map((child) => {
                          const Icon = child.icon
                          return (
                            <a
                              key={child.label}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${child.label} - رابط خارجي`}
                              className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-[var(--accent)] transition-all duration-200 group/item"
                            >
                              <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                                {Icon && <Icon className="w-5 h-5 text-primary" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">{child.label}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{child.desc}</div>
                              </div>
                            </a>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-[var(--accent)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-1">
          {mounted && (
            <MagneticButton>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === "dark" ? "تفعيل الثيم الفاتح" : "تفعيل الثيم الداكن"}
                className="p-2.5 rounded-xl hover:bg-[var(--accent)] text-muted-foreground hover:text-foreground transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
              >
                <span className={cn("block transition-all duration-500 ease-[var(--ease-spring)]", theme === "dark" ? "rotate-0" : "rotate-180")}>
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </span>
              </button>
            </MagneticButton>
          )}

          <MagneticButton>
            <button
              onClick={() => { setMobileOpen(!mobileOpen); if (mobileOpen) setServicesOpen(false) }}
              aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileOpen}
              className="md:hidden p-2.5 rounded-xl hover:bg-[var(--accent)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mx-2 mb-2"
          >
            <div className="glass-strong rounded-2xl p-2 shadow-xl">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      aria-expanded={servicesOpen}
                      className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-[var(--accent)] transition-all duration-200"
                    >
                      {link.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", servicesOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mr-3"
                        >
                          <div className="space-y-1 pb-1 pt-1">
                            {link.children.map((child) => (
                              <a
                                key={child.label}
                                href={child.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${child.label} - رابط خارجي`}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-xl hover:bg-[var(--accent)] transition-all duration-200"
                              >
                                {child.icon && <child.icon className="w-4 h-4 text-primary" />}
                                <div>
                                  <div className="font-medium">{child.label}</div>
                                  {child.desc && <div className="text-xs text-muted-foreground/70 mt-0.5">{child.desc}</div>}
                                </div>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground rounded-xl hover:bg-[var(--accent)] transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
