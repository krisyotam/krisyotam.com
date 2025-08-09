import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import DirectoryClient from "./directory-client"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.directory

export default async function DirectoryPage() {
  return (
    <main className="max-w-[1100px] mx-auto px-4 py-10">
      <PageHeader
        title="Site Directory"
        subtitle="Complete Index of Pages & Categories"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="A comprehensive listing of all pages and content categories available on this website, organized for easy navigation and discovery."
        status="Finished"
        confidence="certain"
        importance={8}
      />
      <div className="mt-8">
        <DirectoryClient />
      </div>
    </main>
  )
}
