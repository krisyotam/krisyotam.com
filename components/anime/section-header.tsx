import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SectionHeaderProps {
  title: string
  icon: React.ReactNode
  count?: number | null
}

export function SectionHeader({ title, icon, count = null }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="section-title">{title}</h2>
        {count !== null && count > 0 && (
          <Badge variant="outline" className="ml-1 text-xs dark:border-gray-700 dark:text-gray-300">
            {count}
          </Badge>
        )}
      </div>
      <Separator className="flex-1 ml-4 dark:bg-gray-800" />
    </div>
  )
}

