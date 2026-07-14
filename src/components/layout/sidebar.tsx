"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Home, Image, Users, MessageSquare, Bookmark, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wallpapers", label: "Wallpapers", icon: Image },
  { href: "/characters", label: "Characters", icon: Users },
  { href: "/requests", label: "Requests", icon: MessageSquare },
  { href: "/collections", label: "Collections", icon: Bookmark },
  { href: "/favorites", label: "Favorites", icon: Heart },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#222] bg-[#0a0a0a] md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-[#222]">
              <Link href="/" className="text-xl font-bold text-[#D4A843]" onClick={onClose}>
                UmaWall
              </Link>
              <button
                onClick={onClose}
                className="p-2 text-[#999] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-[#D4A843] bg-[#D4A843]/10"
                      : "text-[#999] hover:text-white hover:bg-[#111]"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export { Sidebar }
