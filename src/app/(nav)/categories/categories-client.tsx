"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/core"
import { PageDescription } from "@/components/core"
import { Navigation } from "@/components/content/navigation"

interface Category {
  name: string
  slug: string
  count: number
}

interface CategoriesClientProps {
  categories: Category[]
  currentDate: string
}

/**
 * Convert lowercase/hyphenated strings to Title Case
 * e.g., "computer-science" → "Computer Science", "philosophy" → "Philosophy"
 */
function toProperCase(str: string): string {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function CategoriesClient({ categories, currentDate }: CategoriesClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = categories.filter((category) => {
    return category.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title="Categories"
          subtitle="Content organized by topic"
          start_date={currentDate}
          end_date=""
          preview="Browse articles and essays by subject area to explore related ideas across the site."
          status="Finished"
          confidence="certain"
          importance={8}
          backText="Home"
          backHref="/"
          className="mb-3"
        />

        <Navigation
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search categories..."
          viewMode="list"
          onViewModeChange={() => {}}
          showViewToggle={false}
          className="mb-3"
        />

        <main>
          {filteredCategories.length === 0 ? (
            <p className="text-muted-foreground">No categories found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-foreground">
                    <th className="py-2 text-left font-medium px-3">Title</th>
                    <th className="py-2 text-right font-medium px-3"># of Posts</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, index) => (
                    <tr
                      key={category.slug}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                      }`}
                    >
                      <td className="py-2 px-3">
                        <Link href={`/category/${category.slug}`} className="text-foreground hover:text-primary">
                          {toProperCase(category.name)}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-right">{category.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <PageDescription
          title="About Categories"
          description="Browse all content categories on this site. Each category represents a collection of related articles and essays."
        />
      </div>
    </div>
  )
}
