"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Resource {
  id: string
  title: string
  url: string
  description: string
  category: string
  tags: string[]
}

interface ResourcesTableProps {
  resources: Resource[]
}

export default function ResourcesTable({ resources }: ResourcesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources)

  // Extract unique categories
  const categories = ["all", ...Array.from(new Set(resources.map((resource) => resource.category)))].sort()

  // Filter resources based on search query and category
  useEffect(() => {
    const filtered = resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter

      return matchesSearch && matchesCategory
    })

    setFilteredResources(filtered)
  }, [searchQuery, categoryFilter, resources])

  return (
    <div className="w-full space-y-6">
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Search resources by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-background border-border rounded-none focus:ring-0 focus:border-primary text-sm text-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] rounded-none border-border focus:ring-0 focus:border-primary text-sm bg-background text-foreground">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-border bg-background">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-foreground hover:bg-secondary focus:bg-secondary"
                >
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resources table */}
      <div className="border border-border hidden md:block">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Title & Description
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Tags
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Link
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-foreground">{resource.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{resource.description}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs uppercase tracking-wide text-foreground">
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 rounded-sm bg-muted text-muted-foreground border-border"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-none border-border hover:bg-secondary hover:text-foreground text-xs h-8 px-3 text-foreground"
                    >
                      <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  <div>No resources found matching your criteria.</div>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-none border-border hover:bg-secondary text-xs text-foreground"
                    onClick={() => {
                      setSearchQuery("")
                      setCategoryFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="border border-border p-4 bg-background"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-foreground">{resource.title}</h3>
                <span className="text-xs uppercase tracking-wide text-foreground bg-secondary px-2 py-1">
                  {resource.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {resource.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 rounded-sm bg-muted text-muted-foreground border-border"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none border-border hover:bg-secondary hover:text-foreground text-xs h-8 text-foreground"
              >
                <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Visit Resource
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <div>No resources found matching your criteria.</div>
            <Button
              variant="outline"
              className="mt-4 rounded-none border-border hover:bg-secondary text-xs text-foreground"
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
