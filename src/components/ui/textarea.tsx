import { forwardRef, type TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-[#e0e0e0]",
          "placeholder:text-[#666]",
          "focus-visible:outline-none focus-visible:border-[#D4A843] focus-visible:ring-1 focus-visible:ring-[#D4A843]/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
