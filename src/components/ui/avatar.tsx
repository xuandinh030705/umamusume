import { forwardRef, useState, type ImgHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
  fallbackClassName?: string
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, fallback, src, alt, fallbackClassName, ...props }, ref) => {
    const [error, setError] = useState(false)

    if (error || !src) {
      return (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-surface text-primary font-medium text-sm border border-border-strong",
            className
          )}
        >
          <span className={cn("select-none", fallbackClassName)}>
            {fallback || alt?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>
      )
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || ""}
        onError={() => setError(true)}
        className={cn("rounded-full object-cover border border-border-strong", className)}
        {...props}
      />
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
