import Link from "next/link"
import { Globe, Heart, GitBranch } from "lucide-react"

function Footer() {
  return (
    <footer className="border-t border-[#222] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold text-[#D4A843]">
              UmaWall
            </Link>
            <p className="mt-2 text-sm text-[#666]">
              The ultimate gallery for Umamusume Pretty Derby wallpapers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/wallpapers" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/characters" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  Characters
                </Link>
              </li>
              <li>
                <Link href="/requests" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  Requests
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-sm text-[#999] hover:text-[#D4A843] transition-colors">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#222] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#666]">
            &copy; {new Date().getFullYear()} UmaWall. UmaMusume Pretty Derby is a trademark of Cygames, Inc.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#D4A843] transition-colors">
              <GitBranch className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#D4A843] transition-colors">
              <Globe className="h-5 w-5" />
            </a>
            <span className="flex items-center gap-1 text-xs text-[#666]">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for the community
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
