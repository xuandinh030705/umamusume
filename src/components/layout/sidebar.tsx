"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Home, Image, Users, MessageSquare, Bookmark, Heart, Sparkles } from "lucide-react"
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
            className="fixed inset-0 z-50 bg-scrim backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background md:hidden glass-strong"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-border">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary" onClick={onClose}>
                <Sparkles className="h-5 w-5" />
                UmaWall
              </Link>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-xl transition-all"
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
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
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
