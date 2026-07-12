"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Smartphone, Bot, ChevronDown, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "الرئيسية" },
  {
    label: "خدماتنا",
    children: [
      { href: "https://menu.smart-link.ly", label: "Smart Menu — المنيو الرقمي", icon: Smartphone },
      { href: "https://bot.smart-link.ly", label: "SmartBot — البوت الذكي", icon: Bot },
    ],
  },
  { href: "/about", label: "عن SmartLink" },
  { href: "/contact", label: "اتصل بنا" },
]

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes nav-shine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background,backdrop-filter,border-color] duration-[var(--move-base)]",
        scrolled
          ? "bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent backdrop-blur-0 border-b border-transparent"
      )}
    >
      <div className="container-base flex items-center justify-between h-16">
        <Link href="/" className="flex items-center group">
          <Image src="/logo.png" alt="SmartLink" width={140} height={36} className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative group/nav"
                onMouseEnter={() => setDesktopServicesOpen(true)}
                onMouseLeave={() => setDesktopServicesOpen(false)}
                onFocus={() => setDesktopServicesOpen(true)}
                onBlur={() => setDesktopServicesOpen(false)}
              >
                <button
                  aria-haspopup="true"
                  aria-expanded={desktopServicesOpen}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--accent)] focus-visible:bg-[var(--accent)] transition-[color,background-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
                >
                  {link.label}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover/nav:rotate-180" />
                </button>
                <div className="absolute top-full right-0 mt-1 w-72 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible focus-within:opacity-100 focus-within:visible transition-[opacity,visibility,transform] duration-200 translate-y-1 group-hover/nav:translate-y-0 focus-within:translate-y-0">
                  <div className="glass-strong rounded-xl p-2">
                    {link.children.map((child) => {
                      const Icon = child.icon
                      return (
                        <a
                          key={child.label}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${child.label} — رابط خارجي`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--accent)] focus-visible:bg-[var(--accent)] transition-[background-color] group/item focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            {Icon && <Icon className="w-4 h-4 text-primary" />}
                          </div>
                          <div className="text-sm font-medium text-foreground">{child.label}</div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--accent)] transition-[color,background-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "تفعيل الثيم الفاتح" : "تفعيل الثيم الداكن"}
              className="p-3 rounded-lg hover:bg-[var(--accent)] text-muted-foreground hover:text-foreground transition-[color,background-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
            >
              <span className={cn("block transition-transform duration-500 ease-[var(--ease-spring)]", mounted && (theme === "dark" ? "" : "rotate-180"))}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </span>
            </button>
          )}

          <button
            onClick={() => { setMobileOpen(!mobileOpen); if (mobileOpen) setServicesOpen(false) }}
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
            className="md:hidden p-3 rounded-lg hover:bg-[var(--accent)] transition-[background-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden glass-strong m-2 rounded-xl p-2"
          style={{ animation: "fade-in-up 0.2s ease-out" }}
        >
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  aria-expanded={servicesOpen}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-foreground rounded-lg hover:bg-[var(--accent)] transition-[background-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
                >
                  {link.label}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", servicesOpen && "rotate-180")} />
                </button>
                {servicesOpen && (
                  <div className="mr-3 space-y-1 pb-1" style={{ animation: "fade-in-up 0.15s ease-out" }}>
                    {link.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${child.label} — رابط خارجي`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--accent)] transition-[color,background-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
                      >
                        {child.icon && <child.icon className="w-4 h-4" />}
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-foreground rounded-lg hover:bg-[var(--accent)] transition-[background-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
    </>
  )
}
