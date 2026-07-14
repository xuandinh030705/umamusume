"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, Heart, Bell, ChevronDown, LogOut, Settings, User, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/wallpapers", label: "Wallpapers" },
  { href: "/characters", label: "Characters" },
  { href: "/requests", label: "Requests" },
]

const userMenuItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/collections", label: "Collections", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
]

interface UserData {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
}

interface NavbarProps {
  user?: UserData | null
  onSearch?: (query: string) => void
}

function Navbar({ user, onSearch }: NavbarProps) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isAdmin = user?.role === "ADMIN"

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-[#D4A843] shrink-0">
          UmaWall
        </Link>

        <div className="hidden md:flex items-center gap-1 ml-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-[#D4A843] bg-[#D4A843]/10"
                  : "text-[#999] hover:text-white hover:bg-[#111]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        <form onSubmit={handleSearch} className={cn(
          "hidden md:flex items-center relative max-w-xs w-full",
          searchOpen && "flex"
        )}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666]" />
          <Input
            type="search"
            placeholder="Search wallpapers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </form>

        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2 text-[#999] hover:text-white transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>

        <button className=" relative p-2 text-[#999] hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#D4A843] text-[10px] font-bold text-black flex items-center justify-center">
            3
          </span>
        </button>

        <button className="relative p-2 text-[#999] hover:text-white transition-colors">
          <Heart className="h-5 w-5" />
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[#111] transition-colors"
            >
              <Avatar
                src={user.image || undefined}
                fallback={user.name?.charAt(0) || "U"}
                className="h-8 w-8"
              />
              <ChevronDown className="h-4 w-4 text-[#666] hidden sm:block" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-lg border border-[#333] bg-[#161616] p-1 shadow-xl">
                  <div className="px-3 py-2 border-b border-[#222]">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-[#666] truncate">{user.email}</p>
                  </div>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#e0e0e0] hover:bg-[#222] transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-[#666]" />
                      {item.label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#D4A843] hover:bg-[#222] transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <div className="my-1 h-px bg-[#222]" />
                  <button
                    onClick={() => { setUserMenuOpen(false) }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-[#222] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-lg bg-[#D4A843] px-4 py-2 text-sm font-medium text-black hover:bg-[#c49c3a] transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>

      {searchOpen && (
        <div className="md:hidden border-t border-[#222] p-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666]" />
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
  )
}

export { Navbar }
