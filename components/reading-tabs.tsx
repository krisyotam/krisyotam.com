"use client"

import { useState } from "react"
import Reading from "./reading/reading"
import ReadingReadContent from "./reading-read-content"
import ReadingToBeReadContent from "./reading-to-be-read-content"
import ReadingListsContent from "./reading-lists-content"
import ReadingStatsContent from "./reading-stats-content"

export function ReadingTabs() {
  const [activeTab, setActiveTab] = useState("reading")

  const tabs = [
    { id: "reading", label: "Reading" },
    { id: "read", label: "Read" },
    { id: "to-be-read", label: "To Be Read" },
    { id: "lists", label: "Lists" },
    { id: "stats", label: "Stats" }
  ]

  return (
    <div>
      <div className="relative">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium relative transition-colors ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === "reading" && <Reading />}
        {activeTab === "read" && <ReadingReadContent />}
        {activeTab === "to-be-read" && <ReadingToBeReadContent />}
        {activeTab === "lists" && <ReadingListsContent />}
        {activeTab === "stats" && <ReadingStatsContent />}
      </div>
    </div>
  )
}
