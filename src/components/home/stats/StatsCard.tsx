/**
 * Stats Card Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Displays a stat with icon, title, value, and optional subtitle
 */

import type React from "react"
import { Card } from "@/components/ui/card"

interface StatsCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle?: string
}

export function StatsCard({
  icon,
  title,
  value,
  subtitle,
}: StatsCardProps) {
  return (
    <Card className="p-4 flex flex-col items-center justify-center text-center bg-card border border-border">
      <div className="mb-2 p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </Card>
  )
}
