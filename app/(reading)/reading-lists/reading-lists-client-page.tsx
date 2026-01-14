"use client"

import { ReadingLists } from "@/components/reading-lists"
import { ReadingNavigation } from "@/components/reading-navigation"

export function ReadingListsClientPage() {
  return (
    <div>
      <ReadingNavigation />
      <div className="mt-8">
        <ReadingLists />
      </div>
    </div>
  )
}
