"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface TabSwitcherProps {
  activeTab: "anime" | "manga" | "lists"
  onTabChange?: (tab: "anime" | "manga" | "lists") => void
  listType?: "anime" | "manga" // For lists tab to determine URL
}

export function TabSwitcher({ activeTab, onTabChange, listType = "anime" }: TabSwitcherProps) {
  const router = useRouter()

  const handleTabClick = (tab: "anime" | "manga" | "lists") => {
    // Call the original onTabChange if provided (for compatibility)
    if (onTabChange) {
      onTabChange(tab)
    }

    // Navigate to the appropriate URL
    if (tab === "anime") {
      router.push("/anime")
    } else if (tab === "manga") {
      router.push("/manga")
    } else if (tab === "lists") {
      // For lists, use the listType to determine the URL
      router.push(`/${listType}/lists`)
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
      <button
        onClick={() => handleTabClick("lists")}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
          activeTab === "lists"
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground"
        )}
      >
        Lists
      </button>
    </div>
  )
}
