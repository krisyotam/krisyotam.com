"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Film, Database, BookOpen, Download, Search, Filter, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export type ArchiveItem = {
  id: string
  title: string
  type: "pdf" | "video" | "dataset" | "manuscript"
  category: string
  tags: string[]
  description: string
  size: string
  format: string
  duration?: string
  dateAdded: string
  downloadUrl: string
}

interface ArchivesComponentProps {
  archivesData: ArchiveItem[]
}

export default function ArchivesComponent({ archivesData }: ArchivesComponentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Extract unique categories for the filter dropdown
  const categories = ["all", ...new Set(archivesData.map((item) => item.category))].sort()

  // Filter archives based on search query and filters
  const filteredArchives = archivesData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesType && matchesCategory
  })

  // Get icon based on archive type
  const getTypeIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Film className="h-4 w-4" />
      case "dataset":
        return <Database className="h-4 w-4" />
      case "manuscript":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div
      className="container mx-auto pt-0 pb-8 px-4 max-w-6xl dark:bg-[#121212]"
      style={{ fontFamily: "Georgia, serif !important" }}
    >
      <div
        className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4"
        style={{ borderBottom: "1px solid var(--border) !important" }}
      >
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8" style={{ marginBottom: "2rem !important" }}>
        <div className="flex-1 relative">
          <div
            className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            style={{
              position: "absolute !important",
              left: "0 !important",
              paddingLeft: "0.75rem !important",
            }}
          >
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <Input
            placeholder="Search archives by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-700 rounded-none focus:ring-0 focus:border-black dark:focus:border-gray-500 text-sm dark:text-gray-300"
            style={{
              width: "100% !important",
              paddingLeft: "2.5rem !important",
              borderRadius: "0 !important",
              fontSize: "0.875rem !important",
              boxShadow: "none !important",
            }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger
                className="w-[180px] rounded-none border-gray-300 dark:border-gray-700 focus:ring-0 focus:border-black dark:focus:border-gray-500 text-sm bg-white dark:bg-[#1a1a1a] dark:text-gray-300"
                style={{
                  width: "180px !important",
                  borderRadius: "0 !important",
                  fontSize: "0.875rem !important",
                  boxShadow: "none !important",
                }}
              >
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent
                className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-[#1a1a1a]"
                style={{
                  borderRadius: "0 !important",
                }}
              >
                <SelectItem
                  value="all"
                  className="dark:text-gray-300 dark:focus:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] dark:focus:text-gray-100"
                >
                  All Types
                </SelectItem>
                <SelectItem
                  value="pdf"
                  className="dark:text-gray-300 dark:focus:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] dark:focus:text-gray-100"
                >
                  PDF
                </SelectItem>
                <SelectItem
                  value="video"
                  className="dark:text-gray-300 dark:focus:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] dark:focus:text-gray-100"
                >
                  Video
                </SelectItem>
                <SelectItem
                  value="dataset"
                  className="dark:text-gray-300 dark:focus:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] dark:focus:text-gray-100"
                >
                  Dataset
                </SelectItem>
                <SelectItem
                  value="manuscript"
                  className="dark:text-gray-300 dark:focus:bg-[#1a1a1a] dark:hover:bg-[#1a1a1a] dark:focus:text-gray-100"
                >
                  Manuscript
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger
                className="w-[180px] rounded-none border-gray-300 dark:border-gray-700 focus:ring-0 focus:border-black dark:focus:border-gray-500 text-sm bg-white dark:bg-[#1a1a1a] dark:text-gray-300"
                style={{
                  width: "180px !important",
                  borderRadius: "0 !important",
                  fontSize: "0.875rem !important",
                  boxShadow: "none !important",
                }}
              >
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent
                className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-[#1a1a1a]"
                style={{
                  borderRadius: "0 !important",
                }}
              >
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
      </div>

      {/* Archives table */}
      <div
        className="border border-gray-200 dark:border-gray-800 hidden md:block"
        style={{
          border: "1px solid var(--border) !important",
          display: "none !important",
        }}
        className="md:!block"
      >
        <table
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-800"
          style={{
            width: "100% !important",
            borderCollapse: "collapse !important",
          }}
        >
          <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                style={{
                  padding: "0.75rem 1rem !important",
                  textAlign: "left !important",
                  fontSize: "0.75rem !important",
                  fontWeight: "500 !important",
                  textTransform: "uppercase !important",
                  letterSpacing: "0.05em !important",
                }}
              >
                Title & Description
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                style={{
                  padding: "0.75rem 1rem !important",
                  textAlign: "left !important",
                  fontSize: "0.75rem !important",
                  fontWeight: "500 !important",
                  textTransform: "uppercase !important",
                  letterSpacing: "0.05em !important",
                }}
              >
                Type & Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                style={{
                  padding: "0.75rem 1rem !important",
                  textAlign: "left !important",
                  fontSize: "0.75rem !important",
                  fontWeight: "500 !important",
                  textTransform: "uppercase !important",
                  letterSpacing: "0.05em !important",
                }}
              >
                Details
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                style={{
                  padding: "0.75rem 1rem !important",
                  textAlign: "left !important",
                  fontSize: "0.75rem !important",
                  fontWeight: "500 !important",
                  textTransform: "uppercase !important",
                  letterSpacing: "0.05em !important",
                }}
              >
                Download
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#121212] divide-y divide-gray-200 dark:divide-gray-800">
            {filteredArchives.length > 0 ? (
              filteredArchives.map((archive) => (
                <tr key={archive.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                  <td className="px-4 py-4" style={{ padding: "1rem !important" }}>
                    <div
                      className="text-sm font-medium text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: "0.875rem !important",
                        fontWeight: "500 !important",
                      }}
                    >
                      {archive.title}
                    </div>
                    <div
                      className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2"
                      style={{
                        fontSize: "0.75rem !important",
                        marginTop: "0.25rem !important",
                        display: "-webkit-box !important",
                        WebkitLineClamp: "2 !important",
                        WebkitBoxOrient: "vertical !important",
                        overflow: "hidden !important",
                      }}
                    >
                      {archive.description}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1" style={{ marginTop: "0.5rem !important" }}>
                      {archive.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 rounded-sm bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-700"
                          style={{
                            fontSize: "10px !important",
                            padding: "0 0.375rem !important",
                            borderRadius: "0.125rem !important",
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {archive.tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 rounded-sm bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-700"
                          style={{
                            fontSize: "10px !important",
                            padding: "0 0.375rem !important",
                            borderRadius: "0.125rem !important",
                          }}
                        >
                          +{archive.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4" style={{ padding: "1rem !important" }}>
                    <div className="flex items-center">
                      <span
                        className="flex-shrink-0 mr-2 dark:text-gray-300"
                        style={{ marginRight: "0.5rem !important" }}
                      >
                        {getTypeIcon(archive.type)}
                      </span>
                      <span
                        className="text-xs uppercase tracking-wide text-gray-700 dark:text-gray-300"
                        style={{
                          fontSize: "0.75rem !important",
                          textTransform: "uppercase !important",
                          letterSpacing: "0.025em !important",
                        }}
                      >
                        {archive.type}
                      </span>
                    </div>
                    <div
                      className="text-xs text-gray-500 dark:text-gray-400 mt-2"
                      style={{
                        fontSize: "0.75rem !important",
                        marginTop: "0.5rem !important",
                      }}
                    >
                      Category:{" "}
                      <span
                        className="text-gray-700 dark:text-gray-300 font-medium"
                        style={{
                          fontWeight: "500 !important",
                        }}
                      >
                        {archive.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4" style={{ padding: "1rem !important" }}>
                    <div
                      className="text-xs text-gray-500 dark:text-gray-400"
                      style={{ fontSize: "0.75rem !important" }}
                    >
                      <div className="mb-1" style={{ marginBottom: "0.25rem !important" }}>
                        Size: <span className="text-gray-700 dark:text-gray-300">{archive.size}</span>
                      </div>
                      <div className="mb-1" style={{ marginBottom: "0.25rem !important" }}>
                        Format: <span className="text-gray-700 dark:text-gray-300">{archive.format}</span>
                      </div>
                      {archive.duration && (
                        <div className="mb-1" style={{ marginBottom: "0.25rem !important" }}>
                          Duration: <span className="text-gray-700 dark:text-gray-300">{archive.duration}</span>
                        </div>
                      )}
                      <div>
                        Added: <span className="text-gray-700 dark:text-gray-300">{archive.dateAdded}</span>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-4 py-4 text-sm"
                    style={{ padding: "1rem !important", fontSize: "0.875rem !important" }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-gray-100 text-xs h-8 px-3 dark:text-gray-300"
                      style={{
                        borderRadius: "0 !important",
                        fontSize: "0.75rem !important",
                        height: "2rem !important",
                        padding: "0 0.75rem !important",
                      }}
                    >
                      <Link href={archive.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Download
                          className="h-3 w-3 mr-1"
                          style={{
                            height: "0.75rem !important",
                            width: "0.75rem !important",
                            marginRight: "0.25rem !important",
                          }}
                        />
                        Download
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  style={{
                    padding: "2rem 1rem !important",
                    textAlign: "center !important",
                    fontSize: "0.875rem !important",
                  }}
                >
                  <div>No archives found matching your criteria.</div>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-xs dark:text-gray-300"
                    style={{
                      marginTop: "1rem !important",
                      borderRadius: "0 !important",
                      fontSize: "0.75rem !important",
                    }}
                    onClick={() => {
                      setSearchQuery("")
                      setTypeFilter("all")
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

      {/* Alternative card view for mobile */}
      <div className="md:hidden mt-8 space-y-4" style={{ marginTop: "2rem !important" }}>
        {filteredArchives.length > 0 ? (
          filteredArchives.map((archive) => (
            <Card
              key={archive.id}
              className="rounded-none border-gray-200 dark:border-gray-800 dark:bg-[#121212]"
              style={{
                borderRadius: "0 !important",
                boxShadow: "none !important",
              }}
            >
              <CardHeader
                className="p-4 pb-2 border-b border-gray-100 dark:border-gray-800"
                style={{
                  padding: "1rem !important",
                  paddingBottom: "0.5rem !important",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="dark:text-gray-300">{getTypeIcon(archive.type)}</span>
                    <span
                      className="text-xs uppercase tracking-wide text-gray-700 dark:text-gray-300"
                      style={{
                        fontSize: "0.75rem !important",
                        textTransform: "uppercase !important",
                        letterSpacing: "0.025em !important",
                      }}
                    >
                      {archive.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400" style={{ fontSize: "0.75rem !important" }}>
                    {archive.dateAdded}
                  </span>
                </div>
                <h3
                  className="text-sm font-medium mt-2 dark:text-gray-100"
                  style={{
                    fontSize: "0.875rem !important",
                    fontWeight: "500 !important",
                    marginTop: "0.5rem !important",
                  }}
                >
                  {archive.title}
                </h3>
                <div
                  className="text-xs text-gray-600 dark:text-gray-400 mt-1"
                  style={{
                    fontSize: "0.75rem !important",
                    marginTop: "0.25rem !important",
                  }}
                >
                  Category: {archive.category}
                </div>
              </CardHeader>
              <CardContent
                className="p-4 pt-3 text-xs text-gray-500 dark:text-gray-400"
                style={{
                  padding: "1rem !important",
                  paddingTop: "0.75rem !important",
                  fontSize: "0.75rem !important",
                }}
              >
                <p
                  className="mb-3 line-clamp-2"
                  style={{
                    marginBottom: "0.75rem !important",
                    display: "-webkit-box !important",
                    WebkitLineClamp: "2 !important",
                    WebkitBoxOrient: "vertical !important",
                    overflow: "hidden !important",
                  }}
                >
                  {archive.description}
                </p>
                <div className="mb-3 flex flex-wrap gap-1" style={{ marginBottom: "0.75rem !important" }}>
                  {archive.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 rounded-sm bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-700"
                      style={{
                        fontSize: "10px !important",
                        padding: "0 0.375rem !important",
                        borderRadius: "0.125rem !important",
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {archive.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 rounded-sm bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-700"
                      style={{
                        fontSize: "10px !important",
                        padding: "0 0.375rem !important",
                        borderRadius: "0.125rem !important",
                      }}
                    >
                      +{archive.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                <div
                  className="grid grid-cols-2 gap-2"
                  style={{
                    display: "grid !important",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr)) !important",
                    gap: "0.5rem !important",
                  }}
                >
                  <div>
                    Size: <span className="text-gray-700 dark:text-gray-300">{archive.size}</span>
                  </div>
                  <div>
                    Format: <span className="text-gray-700 dark:text-gray-300">{archive.format}</span>
                  </div>
                  {archive.duration && (
                    <div className="col-span-2" style={{ gridColumn: "span 2 / span 2 !important" }}>
                      Duration: <span className="text-gray-700 dark:text-gray-300">{archive.duration}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0" style={{ padding: "1rem !important", paddingTop: "0 !important" }}>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-gray-100 text-xs h-8 dark:text-gray-300"
                  style={{
                    width: "100% !important",
                    borderRadius: "0 !important",
                    fontSize: "0.75rem !important",
                    height: "2rem !important",
                  }}
                >
                  <Link href={archive.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download
                      className="h-3 w-3 mr-1"
                      style={{
                        height: "0.75rem !important",
                        width: "0.75rem !important",
                        marginRight: "0.25rem !important",
                      }}
                    />
                    Download
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div
            className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
            style={{
              textAlign: "center !important",
              padding: "2rem 0 !important",
              fontSize: "0.875rem !important",
            }}
          >
            <div>No archives found matching your criteria.</div>
            <Button
              variant="outline"
              className="mt-4 rounded-none border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-xs dark:text-gray-300"
              style={{
                marginTop: "1rem !important",
                borderRadius: "0 !important",
                fontSize: "0.75rem !important",
              }}
              onClick={() => {
                setSearchQuery("")
                setTypeFilter("all")
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

