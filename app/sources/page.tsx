import { Suspense } from "react"
import type { Metadata } from "next"
import SourcesClientPage from "./sources-client-page"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Sources | Kris Yotam",
  description: "Messages and communications that have inspired content on this site.",
}

export default function SourcesPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl pt-12">
      <PageHeader
        title="Sources"
        subtitle="Messages and communications that have inspired content"
        date="2025-03-30"
        preview="A collection of emails, messages, and other communications that have inspired content on this site."
        status="In Progress"
        confidence="likely"
        importance={6}
        className="mb-8"
      />

      <Suspense
        fallback={
          <div className="mt-8 animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <SourcesClientPage />
      </Suspense>
    </div>
  )
}

