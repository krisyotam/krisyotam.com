"use client"

import { cn } from "@/lib/utils"

interface TabSwitcherProps {
  activeTab: "anime" | "manga" | "lists"
  onTabChange: (tab: "anime" | "manga" | "lists") => void
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex space-x-4 border-b">
      <button
        onClick={() => onTabChange("anime")}
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
        onClick={() => onTabChange("manga")}
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
        onClick={() => onTabChange("lists")}
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

