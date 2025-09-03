import type React from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, HelpCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalloutProps {
  icon?: string
  children?: React.ReactNode
  type?: "default" | "warning" | "danger" | "info" | "success"
  className?: string
}

const icons = {
  default: HelpCircle,
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  success: CheckCircle2,
}

export function Callout({ children, icon, type = "default", className, ...props }: CalloutProps) {
  const IconComponent = icons[type]

  return (
    <div
      className={cn(
        "my-6 flex items-start rounded-sm border border-border bg-card text-card-foreground p-4 shadow-sm",
        {
          "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-100": type === "info",
          "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100":
            type === "warning",
          "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20 dark:text-red-100": type === "danger",
          "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20 dark:text-green-100":
            type === "success",
        },
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="mr-4 text-2xl">{icon}</div>
      ) : (
        IconComponent && (
          <div className="mr-4 mt-1">
            <IconComponent
              className={cn("h-5 w-5", {
                "text-blue-600 dark:text-blue-400": type === "info",
                "text-amber-600 dark:text-amber-400": type === "warning",
                "text-red-600 dark:text-red-400": type === "danger",
                "text-green-600 dark:text-green-400": type === "success",
                "text-gray-600 dark:text-gray-400": type === "default",
              })}
            />
          </div>
        )
      )}
      <div className="w-full [&>p]:m-0 [&>p]:text-sm">{children}</div>
    </div>
  )
}

