import { ReactNode } from "react"

interface StatsPageHeaderProps {
  children: ReactNode
}

export function StatsPageHeader({ children }: StatsPageHeaderProps) {
  return (
    <h1 className="text-3xl font-bold tracking-tight mb-3 text-center">{children}</h1>
  )
}

interface StatsPageDescriptionProps {
  children: ReactNode
}

export function StatsPageDescription({ children }: StatsPageDescriptionProps) {
  return (
    <p className="text-lg text-muted-foreground mb-6 text-center max-w-2xl mx-auto">{children}</p>
  )
}
