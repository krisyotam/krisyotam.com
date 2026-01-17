import { PageHeader } from "@/components/core"
import { LibraryTabs } from "@/components/library-tabs"
import { PageDescription } from "@/components/core"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"
import "./library.css"

export const metadata: Metadata = staticMetadata.library

export default function LibraryPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Library"
        subtitle="Books, Notes, and Literary Collections"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="a catalog of my personal physical library"
        status="In Progress"
        confidence="certain"
        importance={8}
      />
      <LibraryTabs />

      <PageDescription
        title="About the Library Page"
        description="This page showcases my personal physical book collection, organized by categories and reading lists. It includes books I own, notes I've taken, and curated literary collections. This is separate from my reading tracking page and focuses specifically on the books I physically possess."
      />
    </main>
  )
}

