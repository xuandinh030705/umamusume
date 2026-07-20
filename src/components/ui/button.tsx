"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-background hover:bg-primary-light shadow-lg shadow-primary/20 hover:shadow-primary/30",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-surface-hover hover:border-primary/30",
        ghost:
          "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-destructive/20",
        premium:
          "bg-gradient-to-r from-primary via-primary-light to-primary text-background font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:brightness-110",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
        md: "h-10 px-4 py-2 gap-2",
        lg: "h-12 px-6 py-3 text-base gap-2.5",
        icon: "h-10 w-10 p-0",
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
