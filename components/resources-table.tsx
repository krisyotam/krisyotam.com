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
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <Input
            placeholder="Search resources by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-700 rounded-none focus:ring-0 focus:border-black dark:focus:border-gray-500 text-sm dark:text-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] rounded-none border-gray-300 dark:border-gray-700 focus:ring-0 focus:border-black dark:focus:border-gray-500 text-sm bg-white dark:bg-[#1a1a1a] dark:text-gray-300">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-[#1a1a1a]">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="dark:text-gray-300 dark:focus:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] dark:focus:text-gray-100"
                >
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resources table */}
      <div className="border border-gray-200 dark:border-gray-800 hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Title & Description
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Tags
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Link
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#121212] divide-y divide-gray-200 dark:divide-gray-800">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{resource.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{resource.description}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 rounded-sm bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-700"
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
                      className="rounded-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-gray-100 text-xs h-8 px-3 dark:text-gray-300"
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
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  <div>No resources found matching your criteria.</div>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-xs dark:text-gray-300"
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
              className="border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-[#121212]"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{resource.title}</h3>
                <span className="text-xs uppercase tracking-wide text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1a1a1a] px-2 py-1">
                  {resource.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{resource.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {resource.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 rounded-sm bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-gray-100 text-xs h-8 dark:text-gray-300"
              >
                <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Visit Resource
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            <div>No resources found matching your criteria.</div>
            <Button
              variant="outline"
              className="mt-4 rounded-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-xs dark:text-gray-300"
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
