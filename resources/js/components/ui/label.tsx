/**
 * Label Component
 * 
 * A reusable label component for form inputs.
 * Provides consistent styling and accessibility support.
 * 
 * Features:
 * - Consistent typography and spacing
 * - Disabled state handling
 * - Peer-disabled state support for form validation
 * - Accessible label association with inputs
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Label Component
 * 
 * @param {string} className - Additional CSS classes
 * @param {...props} - Additional props passed to label element
 * 
 * @returns {JSX.Element} Rendered label element
 */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
