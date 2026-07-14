import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-[#e0e0e0]",
          "placeholder:text-[#666]",
          "focus-visible:outline-none focus-visible:border-[#D4A843] focus-visible:ring-1 focus-visible:ring-[#D4A843]/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#e0e0e0]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
