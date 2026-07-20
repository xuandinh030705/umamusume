import Link from "next/link"
import { Heart, Sparkles } from "lucide-react"

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Sparkles className="h-5 w-5" />
              UmaWall
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The ultimate gallery for Umamusume Pretty Derby wallpapers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Explore</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/wallpapers", label: "Wallpapers" },
                { href: "/characters", label: "Characters" },
                { href: "/requests", label: "Requests" },
                { href: "/collections", label: "Collections" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Support</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
                { href: "/guidelines", label: "Guidelines" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/dmca", label: "DMCA" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} UmaWall. UmaMusume Pretty Derby is a trademark of Cygames, Inc.
          </p>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for the community
          </span>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
