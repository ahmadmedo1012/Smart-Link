"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X, Smartphone, Bot, ChevronDown } from "lucide-react"
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]" />
      <div className="relative container-base flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-extrabold text-sm group-hover:shadow-[0_0_20px_var(--orange-muted)] transition-shadow duration-300">
            S
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            Smart<span className="text-[var(--primary)]">Link</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative group/nav">
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] transition-colors">
                  {link.label} <ChevronDown className="w-3.5 h-3.5 group-hover/nav:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full right-0 mt-1 w-72 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 translate-y-1 group-hover/nav:translate-y-0">
                  <div className="glass-strong rounded-xl p-2">
                    {link.children.map((child) => {
                      const Icon = child.icon
                      return (
                        <a
                          key={child.label}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--accent)] transition-colors group/item"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[var(--orange-muted)] flex items-center justify-center text-[var(--primary)] group-hover/item:scale-110 transition-transform">
                            {Icon && <Icon className="w-4.5 h-4.5" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[var(--foreground)]">{child.label}</div>
                          </div>
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
                className="px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-[var(--accent)] transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-strong m-2 rounded-xl p-2 animate-[fade-in_0.2s_ease-out]">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] transition-colors"
                >
                  {link.label} <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", servicesOpen && "rotate-180")} />
                </button>
                {servicesOpen && (
                  <div className="mr-3 space-y-1 pb-1">
                    {link.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] transition-colors"
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
                className="block px-3 py-2.5 text-sm font-medium text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  )
}
