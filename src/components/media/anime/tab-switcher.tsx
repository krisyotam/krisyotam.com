"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface TabSwitcherProps {
  activeTab: "anime" | "manga"
  onTabChange?: (tab: "anime" | "manga") => void
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const router = useRouter()

  const handleTabClick = (tab: "anime" | "manga") => {
    if (onTabChange) {
      onTabChange(tab)
    }

    if (tab === "anime") {
      router.push("/anime")
    } else if (tab === "manga") {
      router.push("/manga")
    }
  }

  return (
    <div className="flex space-x-4 border-b">
      <button
        onClick={() => handleTabClick("anime")}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
          activeTab === "anime"
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground"
        )}
      >
        Anime
      </button>
      <button
        onClick={() => handleTabClick("manga")}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
          activeTab === "manga"
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground"
        )}
      >
        Manga
      </button>
    </div>
  )
}
