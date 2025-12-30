"use client"

import { useState } from "react"
import { PageHeader } from "@/components/core"
import { TabSwitcher } from "@/components/anime/tab-switcher"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PageDescription } from "@/components/core"
import animangaLists from "@/data/animanga-lists.json"

export default function MangaListsClientPage() {
  const [selectedListType, setSelectedListType] = useState<"anime" | "manga">("manga")

  const filteredLists = animangaLists.lists.filter(list => 
    list.type === selectedListType
  )

  const listTypeOptions: SelectOption[] = [
    { value: "anime", label: "Anime Lists" },
    { value: "manga", label: "Manga Lists" }
  ]

  return (
    <div className="min-h-screen dark:bg-[#121212]">        <div className="max-w-6xl mx-auto p-6">
        <PageHeader
          title="Manga Lists"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="curated collections and themed manga lists"
          status="In Progress"
          confidence="certain"
          importance={7}
        />        <PageDescription
          title="About Manga Lists"
          description="Curated manga collections organized by themes, genres, and personal preferences."
        />

        {/* Tab Navigation */}
        <div className="mb-8">
          <TabSwitcher activeTab="lists" listType="manga" />
        </div>

        <div className="space-y-6">
          {/* List Type Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">List Type:</span>            <CustomSelect
              options={listTypeOptions}
              value={selectedListType}
              onValueChange={(value) => setSelectedListType(value as "anime" | "manga")}
              placeholder="Select list type"
            />
          </div>

          {/* Lists Table */}
          <div className="bg-card rounded-lg border shadow-sm dark:bg-[#1a1a1a] dark:border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedListType === "anime" ? "Anime" : "Manga"} Collections
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-medium">Name</th>
                      <th className="text-left py-3 px-2 font-medium">Description</th>
                      <th className="text-left py-3 px-2 font-medium">Items</th>
                      <th className="text-left py-3 px-2 font-medium">Tags</th>
                      <th className="text-left py-3 px-2 font-medium">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLists.map((list, index) => (
                      <tr key={index} className="border-b dark:border-gray-700/50 hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{list.name}</td>
                        <td className="py-3 px-2 text-sm text-muted-foreground max-w-md">
                          {list.description}
                        </td>
                        <td className="py-3 px-2 text-sm">{list.count} items</td>
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-1">
                            {list.tags.map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <a
                            href={list.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLists.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No {selectedListType} lists found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
