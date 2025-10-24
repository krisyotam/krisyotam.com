import type React from "react"

interface MarginNoteProps {
  id: string
  title: string
  index: number
  source?: string
  priority?: number
  children: React.ReactNode
}

export function MarginNote({ id, title, index, source, priority, children }: MarginNoteProps) {
  // This component is primarily for MDX parsing
  // The actual rendering is handled by the MarginCard component
  return <>{children}</>
}

