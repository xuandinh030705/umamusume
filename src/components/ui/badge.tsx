import { type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border-primary/20",
        secondary:
          "bg-surface text-muted-foreground border-border-strong",
        outline:
          "border-border-strong text-muted-foreground bg-transparent",
        premium:
          "bg-gradient-to-r from-primary/20 to-primary-light/10 text-primary-light border-primary/30",
        runner: "bg-info/10 text-blue-400 border-info/20",
        support: "bg-success/10 text-green-400 border-success/20",
        tier: "bg-purple-500/10 text-purple-400 border-purple-500/20",
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
