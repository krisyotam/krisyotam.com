import Link from "next/link"
import { getCategories } from "@/utils/posts"
import { PageHeader } from "@/components/page-header"
import { PageDescription } from "@/components/posts/typography/page-description"
import { CategoriesClient } from "./categories-client"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.categories

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  try {
    const categories = await getCategories()
    const currentDate = new Date().toISOString()

    if (categories.length === 0) {
      return (
        <div className="relative min-h-screen bg-background text-foreground">
          <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
            <PageHeader
              title="Categories"
              subtitle="Content organized by topic"
              start_date={currentDate}
              end_date=""
              preview="This directory helps you navigate content by subject area."
              status="In Progress"
              confidence="certain"
              importance={8}
              backText="Home"
              backHref="/"
            />
            <p className="text-xl text-muted-foreground">No categories found.</p>
          </div>
        </div>
      )
    }

    return <CategoriesClient categories={categories} currentDate={currentDate} />
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load categories. Please try again later.</p>
      </div>
    )
  }
}
