import { type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#D4A843]/20 text-[#D4A843] border border-[#D4A843]/30",
        secondary:
          "bg-[#1a1a2e] text-[#e0e0e0] border border-[#333]",
        outline:
          "border border-[#D4A843] text-[#D4A843] bg-transparent",
        premium:
          "bg-gradient-to-r from-[#D4A843]/30 to-[#F5E6C8]/20 text-[#F5E6C8] border border-[#D4A843]/40",
        runner: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        support: "bg-green-500/20 text-green-400 border border-green-500/30",
        tier: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
