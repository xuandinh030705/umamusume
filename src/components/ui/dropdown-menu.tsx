"use client"

import { useState, useRef, useEffect, createContext, useContext, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined)

function useDropdownMenu() {
  const ctx = useContext(DropdownMenuContext)
  if (!ctx) throw new Error("DropdownMenu components must be used within a DropdownMenu")
  return ctx
}

function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({ children, className, asChild }: { children: ReactNode; className?: string; asChild?: boolean }) {
  const { setOpen } = useDropdownMenu()

  if (asChild) {
    return (
      <span onClick={() => setOpen(true)} className={cn("cursor-pointer", className)}>
        {children}
      </span>
    )
  }

  return (
    <button onClick={() => setOpen(true)} className={className}>
      {children}
    </button>
  )
}

function DropdownMenuContent({ children, className, align = "center" }: { children: ReactNode; className?: string; align?: "start" | "center" | "end" }) {
  const { open, setOpen } = useDropdownMenu()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[12rem] rounded-lg border border-[#333] bg-[#161616] p-1 shadow-xl",
        "animate-in fade-in zoom-in-95",
        {
          "left-0": align === "start",
          "left-1/2 -translate-x-1/2": align === "center",
          "right-0": align === "end",
        },
        className
      )}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const { setOpen } = useDropdownMenu()

  return (
    <button
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#e0e0e0] hover:bg-[#222] transition-colors cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1 h-px bg-[#333]", className)} />
}

function DropdownMenuLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-3 py-1.5 text-xs font-medium text-[#999] uppercase tracking-wider", className)}>{children}</div>
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel }
