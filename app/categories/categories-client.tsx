"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { PageDescription } from "@/components/posts/typography/page-description"
import { Table } from "@/components/shared/table"

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

  const columns = [
    {
      header: "Title",
      key: "name",
      render: (item: Category) => (
        <Link href={`/category/${item.slug}`} className="text-foreground">
          {item.name}
        </Link>
      )
    },
    {
      header: "# of Posts",
      key: "count",
      align: "right" as const
    }
  ]

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

          <Table 
            columns={columns}
            data={filteredCategories}
            emptyMessage="No categories found."
          />
        </div>
        
        <PageDescription 
          title="About Categories"
          description="Browse all content categories on this site. Each category represents a collection of related articles and essays."
        />
      </div>
    </div>
  )
} 