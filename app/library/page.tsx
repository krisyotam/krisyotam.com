import { PageHeader } from "@/components/page-header"
import { LibraryTabs } from "@/components/library-tabs"
import "./library.css"

export const metadata = {
  title: "Personal Library | Kris Yotam",
  description: "A curated collection of books, notes, and reading materials in my personal library",
}

export default function LibraryPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Personal Library"
        subtitle="Books, Notes, and Literary Collections"
        date={new Date().toISOString()}
        preview="A curated collection of books, notes, and reading materials in my personal library."
        status="In Progress"
        confidence="certain"
        importance={8}
      />
      <LibraryTabs />
    </main>
  )
}

