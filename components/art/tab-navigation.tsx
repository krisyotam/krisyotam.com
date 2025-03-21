"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Tab = "portfolio" | "timeline" | "text" | "about"
type Filter = "all" | "traditional" | "ai"

export default function TabNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeFilter, setActiveFilter] = useState<Filter>("all")

  const currentTab = pathname.includes("/art/portfolio")
    ? "portfolio"
    : pathname.includes("/art/timeline")
      ? "timeline"
      : pathname.includes("/art/text")
        ? "text"
        : pathname.includes("/art/about")
          ? "about"
          : "portfolio"

  const handleTabChange = (value: string) => {
    const tab = value as Tab
    router.push(`/art/${tab}${tab !== "text" && tab !== "about" ? `?filter=${activeFilter}` : ""}`)
  }

  const handleFilterChange = (value: string) => {
    const filter = value as Filter
    setActiveFilter(filter)

    if (currentTab !== "text" && currentTab !== "about") {
      router.push(`/art/${currentTab}?filter=${filter}`)
    }
  }

  return (
    <div className="flex flex-col space-y-4 mb-8">
      <Tabs defaultValue={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
      </Tabs>

      {(currentTab === "portfolio" || currentTab === "timeline") && (
        <Tabs defaultValue={activeFilter} onValueChange={handleFilterChange} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="traditional">Traditional</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  )
}

