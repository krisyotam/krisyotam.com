/**
 * View Toggle Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Fixed position button for toggling between list and grid views
 */

"use client"

import { LayoutGrid, Text } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewToggleProps {
  viewMode: 'list' | 'grid'
  onToggle: (newMode: 'list' | 'grid') => void
}

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  const handleToggle = () => {
    const newView = viewMode === "list" ? "grid" : "list"
    onToggle(newView)
    // Update URL without page reload
    window.history.pushState({}, '', newView === "list" ? "/" : "/home")
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        className="bg-background border border-border shadow-md hover:bg-secondary"
        aria-label={`Switch to ${viewMode === "list" ? "grid" : "list"} view`}
      >
        {viewMode === "list" ? <LayoutGrid className="h-5 w-5" /> : <Text className="h-5 w-5" />}
      </Button>
    </div>
  )
}
