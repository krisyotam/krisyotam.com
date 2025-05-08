"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ContentTableProps {
  title: string
  items: {
    title: string
    type?: string
    date: string
    description: string
    slug: string
    year?: number
  }[]
  onItemClick: (item: any) => void
  searchPlaceholder?: string
}

export function ContentTable({ title, items, onItemClick, searchPlaceholder = "Search..." }: ContentTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.type && item.type.toLowerCase().includes(query))
    )
  })

  return (
    <div className="w-full">
      <div className="mb-6">
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              {items[0]?.type && <th className="px-4 py-3 text-left font-medium">Type</th>}
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.slug}
                className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onItemClick(item)}
              >
                <td className="px-4 py-3 font-medium">{item.title}</td>
                {item.type && <td className="px-4 py-3">{item.type}</td>}
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 