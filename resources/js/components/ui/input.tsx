/**
 * Input Component
 * 
 * A reusable input component built on top of @base-ui/react/input.
 * Provides consistent styling and validation states.
 * 
 * Features:
 * - Consistent height and spacing
 * - Focus visible states with ring styling
 * - Disabled states with pointer events and opacity
 * - Accessible with aria-invalid support for validation errors
 * - File input support with custom styling
 */

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/**
 * Input Component
 * 
 * @param {string} className - Additional CSS classes
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {...props} - Additional props passed to input element
 * 
 * @returns {JSX.Element} Rendered input element
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
