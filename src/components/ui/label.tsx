import * as React from "react"

import clsxm from "@utils/clsxm"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={clsxm(
      "block text-sm font-medium text-zinc-500 dark:text-zinc-400",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }