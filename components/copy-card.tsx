"use client"

import { useState, ReactNode } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyCardProps {
  title: string
  value: string
  icon?: ReactNode
  className?: string
}

export function CopyCard({ title, value, icon, className }: CopyCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("border border-border p-4 rounded-sm bg-card shadow-sm", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <div>{icon}</div>}
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-7 w-7 p-0"
          aria-label={`Copy ${title} address`}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="font-mono text-xs bg-muted p-2 rounded-sm overflow-hidden text-ellipsis break-all">
        {value}
      </div>
    </div>
  )
} 