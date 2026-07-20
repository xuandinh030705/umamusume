"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard, Image, Users, MessageSquare, Star,
  Settings, BarChart3, Flag, Loader2, Upload
} from "lucide-react"
import { cn } from "@/lib/utils"

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/upload", label: "Upload", icon: Upload },
  { href: "/admin/wallpapers", label: "Wallpapers", icon: Image },
  { href: "/admin/characters", label: "Characters", icon: Users },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/requests", label: "Requests", icon: MessageSquare },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const userRole = (session?.user as { role?: string })?.role

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && userRole !== "ADMIN") {
      router.push("/")
    }
  }, [status, userRole, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A843]" />
      </div>
    )
  }

  if (!session || userRole !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-[#222] bg-[#0a0a0a] hidden lg:block">
        <div className="p-4 border-b border-[#222]">
          <Link href="/admin" className="text-lg font-bold text-[#D4A843]">
            Admin Panel
          </Link>
          <p className="text-xs text-[#666] mt-0.5">Manage UmaWall</p>
        </div>
        <nav className="p-3 space-y-0.5">
          {adminLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#D4A843] bg-[#D4A843]/10"
                    : "text-[#999] hover:text-white hover:bg-[#111]"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
