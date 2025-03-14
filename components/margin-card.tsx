"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MarginNote {
  id: string
  title: string
  content: string
  index: number
  priority?: number
}

interface MarginCardProps {
  className?: string
  note: MarginNote
}

export function MarginCard({ className, note }: MarginCardProps) {
  return (
    <Card className={cn("p-4 text-sm aspect-square w-[320px] rounded-none bg-card text-card-foreground", className)}>
      <h4 className="font-medium mb-3 pb-2 border-b">{note.title}</h4>
      <p>{note.content}</p>
    </Card>
  )
}

export default MarginCard

