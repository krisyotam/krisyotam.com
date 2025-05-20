"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { PageDescription } from "@/components/posts/typography/page-description"

interface Category {
  name: string
  slug: string
  count: number
}

interface CategoriesClientProps {
  categories: Category[]
  currentDate: string
}

export function CategoriesClient({ categories, currentDate }: CategoriesClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter categories based on search
  const filteredCategories = categories.filter((category) => {
    return category.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader
          title="Categories"
          subtitle="Content organized by topic"
          date={currentDate}
          preview="Browse articles and essays by subject area to explore related ideas across the site."
          status="Finished"
          confidence="certain"
          importance={8}
          backText="Home"
          backHref="/"
        />

        <div className="mt-8">
          <div className="mb-6">
            <div className="relative">
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

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
                  className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                >
                  <td className="py-2 px-3 font-medium">
                    <Link href={`/category/${category.slug}`} className="text-foreground">
                      {category.name}
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-right text-muted-foreground">{category.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCategories.length === 0 && (
            <div className="text-muted-foreground text-sm mt-6">No categories found.</div>
          )}
        </div>
        
        <PageDescription 
          title="About Categories"
          description="Browse all content categories on this site. Each category represents a collection of related articles and essays."
        />
      </div>
    </div>
  )
} 