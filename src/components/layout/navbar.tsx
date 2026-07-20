"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Search, Menu, Heart, ChevronDown, LogOut, Settings, User, Bookmark, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { NotificationBell } from "@/components/shared/notification-bell"
import { Sidebar } from "@/components/layout/sidebar"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/characters", label: "Characters" },
  { href: "/requests", label: "Requests" },
]

const userMenuItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/collections", label: "Collections", icon: Bookmark },
]

interface NavbarProps {
  onSearch?: (query: string) => void
}

function Navbar({ onSearch }: NavbarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const userRole = (user as { role?: string })?.role
  const userId = (user as { id?: string })?.id
  const isAdmin = userRole === "ADMIN"

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/wallpapers?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary shrink-0">
            <Sparkles className="h-5 w-5" />
            UmaWall
          </Link>

          <div className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              type="search"
              placeholder="Search wallpapers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm rounded-xl"
            />
          </form>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-xl transition-all"
          >
            <Search className="h-5 w-5" />
          </button>

          {userId && <NotificationBell userId={userId} />}

          <button
            onClick={() => router.push("/favorites")}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-xl transition-all"
          >
            <Heart className="h-5 w-5" />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-surface-hover transition-all"
              >
                <Avatar
                  src={user.image || undefined}
                  fallback={user.name?.charAt(0) || "U"}
                  className="h-8 w-8"
                />
                <ChevronDown className={cn("h-4 w-4 text-muted transition-transform duration-200", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl border border-card-border bg-card p-1.5 shadow-2xl glass-strong animate-scale-in">
                    <div className="px-3 py-2.5 border-b border-border-strong mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-primary hover:bg-surface-hover transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="my-1 h-px bg-border-strong" />
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }) }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-surface-hover transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-xl border border-border-strong px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary-light transition-all shadow-lg shadow-primary/20 hidden sm:block"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {searchOpen && (
          <div className="md:hidden border-t border-border p-3 glass-strong">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  type="search"
                  placeholder="Search wallpapers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </nav>

      <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}

export { Navbar }
