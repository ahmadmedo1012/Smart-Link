import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

/* r128 Stage B (F2b) — per-page site chrome for every NON-landing surface.
 *
 * The landing ("/") now owns its entire world (LandingHeader + landing
 * footer + grain inside the .landing scope, R4), so the shared product
 * chrome (MainNav + the CSS scroll-progress ribbon + Footer) moved out of
 * the RootLayout and into this wrapper: inner pages render byte-identical
 * to before (same nav, same <main id="main-content"> target for the
   layout's skip link, same footer), and the landing renders no product
   chrome at all. */

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* r8: scroll progress bar is a pure CSS scroll-driven animation
          (scroll(root) timeline, styles.css) — zero JS. */}
      <div className="scroll-progress" aria-hidden="true" />
      <MainNav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
