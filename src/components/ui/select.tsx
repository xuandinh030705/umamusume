import { forwardRef, type SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-[#e0e0e0]",
          "focus-visible:outline-none focus-visible:border-[#D4A843] focus-visible:ring-1 focus-visible:ring-[#D4A843]/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
