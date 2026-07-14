"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#D4A843] text-[#0a0a0a] hover:bg-[#c49c3a] shadow-lg shadow-[#D4A843]/20",
        outline:
          "border border-[#333] bg-transparent text-[#e0e0e0] hover:bg-[#1a1a2e] hover:border-[#D4A843]/50",
        ghost:
          "text-[#e0e0e0] hover:bg-[#1a1a2e] hover:text-white",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20",
        premium:
          "bg-gradient-to-r from-[#D4A843] to-[#F5E6C8] text-[#0a0a0a] hover:brightness-110 shadow-lg shadow-[#D4A843]/30 font-semibold",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 py-2 gap-2",
        lg: "h-12 px-6 py-3 text-base gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
