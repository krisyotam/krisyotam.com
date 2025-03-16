"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Tab {
  id: string
  label: string
}

interface TabSwitcherProps {
  activeTab: string
  onChange: (value: any) => void
  tabs?: Tab[]
}

export function TabSwitcher({ activeTab, onChange, tabs }: TabSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const defaultTabs = [
    { id: "anime", label: "Anime" },
    { id: "manga", label: "Manga" },
    { id: "collections", label: "Collections" },
  ]

  const tabsToUse = tabs || defaultTabs

  const handleTabChange = (value: string) => {
    // Update URL query parameter
    const params = new URLSearchParams(searchParams)
    if (value === "anime") {
      params.delete("tab")
    } else {
      params.set("tab", value)
    }

    // Update the URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`, { scroll: false })

    // Call the onChange handler
    onChange(value)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {tabsToUse.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

