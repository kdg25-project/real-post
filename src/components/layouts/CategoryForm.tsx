import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type title = {
  title: string
}

function CategoryForm({title, className, ...props }: React.ComponentProps<"select">) {
  return (
    <div
      className="flex flex-col gap-3 group/native-select  has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
    >
      <p className="text-[16px] font-bold">{title}</p>
      <div className="relative">
        <select
          data-slot="native-select"
          className={cn(
            "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 w-full min-w-0 appearance-none rounded-[14px] bg-white px-[20px] py-[15px]  text-sm shadow-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
        <ChevronDownIcon
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-5 size-6 -translate-y-1/2  select-none"
          aria-hidden="true"
          data-slot="native-select-icon"
        />
      </div>
    </div>
  )
}

function NativeSelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  )
}

export { CategoryForm, NativeSelectOptGroup, NativeSelectOption }
