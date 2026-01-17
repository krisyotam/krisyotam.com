/**
 * Home Stats Section
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Stats grid showing writing streak, years blogging, and topics
 */

import { StatsCard } from "./stats"
import { Calendar, BookOpen, Hash } from "lucide-react"

interface HomeStatsProps {
  uniqueCategories: string[]
}

export function HomeStats({ uniqueCategories }: HomeStatsProps) {
  // Calculate consecutive writing streak (days since Jan 1, 2025)
  const startDate = new Date("2025-01-01")
  const currentDate = new Date()
  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Calculate years blogging (always > 1 as requested)
  const yearsBlogging = "> 1"

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <StatsCard
        icon={<Calendar className="h-5 w-5" />}
        title="Writing Streak"
        value={diffDays}
        subtitle="consecutive days"
      />
      <StatsCard
        icon={<BookOpen className="h-5 w-5" />}
        title="Years Blogging"
        value={yearsBlogging}
        subtitle="since 2025"
      />
      <StatsCard
        icon={<Hash className="h-5 w-5" />}
        title="Topics"
        value={uniqueCategories.length}
        subtitle="unique categories"
      />
    </div>
  )
}
