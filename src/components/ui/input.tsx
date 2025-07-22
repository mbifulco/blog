import * as React from "react"

import clsxm from "@utils/clsxm"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsxm(
          "block w-full rounded-lg border-zinc-300 shadow-xs focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm",
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