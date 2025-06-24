import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import DirectoryClient from "./directory-client"

export const metadata: Metadata = {
  title: "Directory | Kris Yotam",
  description: "A comprehensive directory of all pages on Kris Yotam's website.",
}

export default async function DirectoryPage() {
  return (
    <main className="max-w-[1100px] mx-auto px-4 py-10">
      <PageHeader
        title="Site Directory"
        subtitle="Complete Index of Pages & Categories"
        date={new Date().toISOString()}
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
