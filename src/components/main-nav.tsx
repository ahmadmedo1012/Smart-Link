"use client"
import { useState, useEffect, useRef, useSyncExternalStore } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Smartphone, Bot, ChevronDown, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { SITE } from "@/lib/site"
// NOTE: framer-motion removed from the critical path (122 KB initial chunk,
// ~1.5 s script evaluation). Menu/dropdown animations are now CSS-only.

const navLinks = [
  { href: "/", label: "الرئيسية" },
  {
    label: "خدماتنا",
    children: [
      { href: SITE.products.menu.url, label: SITE.products.menu.label, icon: Smartphone, desc: SITE.products.menu.desc },
      { href: SITE.products.bot.url, label: SITE.products.bot.label, icon: Bot, desc: SITE.products.bot.desc },
    ],
  },
  /* r9 (audit L2): pricing was reachable only from the footer — a primary
     conversion page hidden from the main nav. Now a first-class link. */
  { href: "/pricing", label: "الأسعار" },
  { href: "/about", label: "عن SmartLink" },
  { href: "/contact", label: "تواصل معنا" },
]

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* Direct DOM transform — a state update per mousemove re-rendered the
       whole header; this path costs zero renders. */
    /* r8: rect is measured ONCE on mouseenter and cached — the old version
       called getBoundingClientRect() inside every mousemove (60Hz), a
       forced sync layout each time (Lighthouse: 113.9ms of unattributed
       reflow during header hover). Cache invalidated on leave. */
    let rect: DOMRect | null = null
    const onMove = (e: MouseEvent) => {
      if (!rect) rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const onLeave = () => {
      rect = null
      el.style.transform = "translate(0px, 0px)"
    }
    const onEnter = () => { rect = el.getBoundingClientRect() }
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={cn("magnetic-btn", className)}>
      {children}
    </div>
  )
}

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  /* r5 (gstack /review — react-hooks/set-state-in-effect): hydration-safe
     "mounted" without a cascading render — server snapshot false, client
     snapshot true, evaluated once. */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const headerRef = useRef<HTMLDivElement>(null)

  /* r5 (gstack /qa — a11y polish): Escape closes any open menu (always
     active), and the mobile menu locks body scroll while open. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
        setServicesOpen(false)
        setDesktopServicesOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

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
        {/* r8: prefetch={false} — the logo Link was prefetching the CURRENT
            route on every page (three duplicate RSC prefetches measured on
            first load). The logo dimensions now match the source ratio
            (600×409) at a display-appropriate size (was 150×38 — the
            optimizer was generating a 384w AVIF for a ~53px slot). */}
        <Link href="/" prefetch={false} className="flex items-center group relative">
          <Image src="/logo.png" alt="SmartLink" width={120} height={82} sizes="(max-width: 768px) 48px, 54px" className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" priority />
        </Link>

        {/* Desktop nav — r6: named landmark for screen readers */}
        <nav className="hidden md:flex items-center gap-1" aria-label="التنقل الرئيسي">
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
                  {/* r6: removed dead group-hover/nav:rotate-180 — no parent
                      carries group/nav, so the class never fired; the inline
                      style below is what actually rotates the chevron. */}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" style={{ transform: desktopServicesOpen ? "rotate(180deg)" : undefined }} />
                </button>
                {desktopServicesOpen && (
                <div className="menu-pop menu-pop-fast absolute top-full right-0 mt-2 w-80">
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
                </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "px-4 py-2.5 text-sm rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]",
                  pathname === link.href
                    ? "text-foreground bg-[var(--accent)] font-semibold"
                    : "font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--accent)]"
                )}
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

      {/* Mobile menu — CSS menu-pop; sub-menu uses the grid-rows accordion.
          r6: named nav landmark (was a bare div). */}
      {mobileOpen && (
          <nav className="menu-pop md:hidden mx-2 mb-2" aria-label="قائمة الجوال">
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
                    <div className={cn("acc mr-3", servicesOpen && "open")}>
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
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200",
                      pathname === link.href
                        ? "text-foreground bg-[var(--accent)] font-semibold"
                        : "font-medium text-foreground hover:bg-[var(--accent)]"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </nav>
        )}
    </header>
  )
}
