"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Film, Database, BookOpen, Download, Search, Filter, Tag, Video, Headphones, Wrench, Code, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

type ArchiveType = "note" | "essay" | "lecture-note" | "book" | "article" | "video" | "podcast" | "tool" | "project" | "dataset" | "manuscript" | "pdf"

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
  const getTypeIcon = (type: ArchiveType) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      case "essay":
        return <Book className="h-4 w-4" />
      case "lecture-note":
        return <Book className="h-4 w-4" />
      case "book":
        return <Book className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "podcast":
        return <Headphones className="h-4 w-4" />
      case "tool":
        return <Wrench className="h-4 w-4" />
      case "project":
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
      style={{ fontFamily: "Georgia, serif" }}
    >
      <div
        className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Search archives by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 bg-background rounded-none",
              "border-border focus:ring-0 focus:ring-offset-0 focus:border-border",
              "dark:border-border dark:focus:border-border"
            )}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className={cn(
                "w-[180px] rounded-none border-border",
                "focus:ring-0 focus:ring-offset-0 focus:border-border",
                "dark:border-border dark:focus:border-border"
              )}>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="dataset">Dataset</SelectItem>
                <SelectItem value="manuscript">Manuscript</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger 
                className={cn(
                  "w-[180px] rounded-none border-border",
                  "focus:ring-0 focus:ring-offset-0 focus:border-border",
                  "dark:border-border dark:focus:border-border"
                )}
              >
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Archives table */}
      <div className="border border-border hidden md:block">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50 dark:bg-[hsl(var(--popover))]">
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
                Type & Category
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Details
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background dark:bg-[hsl(var(--popover))] divide-y divide-border">
            {filteredArchives.length > 0 ? (
              filteredArchives.map((archive) => (
                <tr key={archive.id} className="hover:bg-muted/50 dark:hover:bg-muted/5">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {archive.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {archive.description}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {archive.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-none text-[10px] px-1.5 py-0 bg-muted/50 dark:bg-[hsl(var(--popover))]"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {archive.tags.length > 3 && (
                        <Badge 
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))]"
                        >
                          +{archive.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span className="flex-shrink-0 mr-2 text-muted-foreground">
                        {getTypeIcon(archive.type)}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-foreground">
                        {archive.type}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Category: <span className="text-foreground">{archive.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-muted-foreground">
                      <div className="mb-1">
                        Size: <span className="text-foreground">{archive.size}</span>
                      </div>
                      <div className="mb-1">
                        Format: <span className="text-foreground">{archive.format}</span>
                      </div>
                      {archive.duration && (
                        <div className="mb-1">
                          Duration: <span className="text-foreground">{archive.duration}</span>
                        </div>
                      )}
                      <div>
                        Added: <span className="text-foreground">{archive.dateAdded}</span>
                      </div>
                    </div>
                  </td>                  <td className="px-4 py-4">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-none w-full text-xs"
                    >
                      <Link 
                        href={archive.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center"
                      >
                        Open Archive
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">
                  <div className="text-sm">No archives found matching your criteria.</div>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-none text-xs"
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
      <div className="md:hidden mt-8 space-y-4">
        {filteredArchives.length > 0 ? (
          filteredArchives.map((archive) => (
            <Card
              key={archive.id}
              className="rounded-none border-border bg-muted/50 dark:bg-[hsl(var(--popover))]"
            >
              <CardHeader className="p-4 pb-2 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{getTypeIcon(archive.type)}</span>
                    <span className="text-xs uppercase tracking-wide text-foreground">
                      {archive.type}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {archive.dateAdded}
                  </span>
                </div>
                <h3 className="text-sm font-medium mt-2 text-foreground">
                  {archive.title}
                </h3>
                <div className="text-xs text-muted-foreground mt-1">
                  Category: {archive.category}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3 text-xs text-muted-foreground">
                <p className="mb-3 line-clamp-2">
                  {archive.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {archive.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-none text-[10px] px-1.5 py-0 bg-muted/50 dark:bg-[hsl(var(--popover))]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    Size: <span className="text-foreground">{archive.size}</span>
                  </div>
                  <div>
                    Format: <span className="text-foreground">{archive.format}</span>
                  </div>
                  {archive.duration && (
                    <div className="col-span-2">
                      Duration: <span className="text-foreground">{archive.duration}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-none text-xs"
                >
                  <Link 
                    href={archive.downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center"
                  >
                    Open Archive
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center">
            <div className="text-sm text-muted-foreground">No archives found matching your criteria.</div>
            <Button
              variant="outline" 
              className="mt-4 rounded-none text-xs"
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

