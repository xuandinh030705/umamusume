"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs components must be used within a Tabs")
  return ctx
}

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

function Tabs({ defaultValue, value: controlledValue, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const activeTab = isControlled ? controlledValue : internalValue

  const setActiveTab = (v: string) => {
    if (!isControlled) setInternalValue(v)
    onValueChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-1 rounded-lg bg-[#111] p-1", className)}>
      {children}
    </div>
  )
}

function TabsTrigger({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
        isActive ? "text-[#D4A843]" : "text-[#999] hover:text-[#e0e0e0]",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 rounded-md bg-[#1a1a2e]"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

function TabsContent({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { activeTab } = useTabs()
  if (activeTab !== value) return null
  return <div className={cn("mt-4", className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
