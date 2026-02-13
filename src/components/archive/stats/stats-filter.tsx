"use client"

import { useState } from "react"
import { Box } from "@/components/typography/box"

interface StatsFilterProps {
  activeTab: "posts" | "referrers" | "cities"
  onChange: (tab: "posts" | "referrers" | "cities") => void
}

export function StatsFilter({ activeTab, onChange }: StatsFilterProps) {
  return (
    <Box className="p-0 my-4">
      <div className="flex justify-center border-b border-border">
        <button
          onClick={() => onChange("posts")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "posts"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Top Posts
        </button>
        <button
          onClick={() => onChange("referrers")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "referrers"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Top Referrers
        </button>
        <button
          onClick={() => onChange("cities")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "cities"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Top Cities
        </button>
      </div>
    </Box>
  )
}
