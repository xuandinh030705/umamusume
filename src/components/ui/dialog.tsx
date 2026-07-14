"use client"

import { createContext, useContext, useCallback, useRef, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error("Dialog components must be used within a Dialog")
  return ctx
}

interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value)
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ children, className, asChild, ...props }: { children: ReactNode; className?: string; asChild?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useDialog()

  if (asChild) {
    return (
      <span onClick={() => onOpenChange(true)} className={className} {...props}>
        {children}
      </span>
    )
  }

  return (
    <button onClick={() => onOpenChange(true)} className={className} {...props}>
      {children}
    </button>
  )
}

function DialogContent({ children, className }: { children: ReactNode; className?: string }) {
  const { open, onOpenChange } = useDialog()
  const dialogRef = useRef<HTMLDivElement>(null)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative z-50 w-full max-w-lg rounded-xl border border-[#333] bg-[#161616] p-6 shadow-2xl",
              "max-h-[85vh] overflow-y-auto",
              className
            )}
          >
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-[#999] hover:bg-[#222] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold text-white", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[#999]", className)} {...props} />
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription }
