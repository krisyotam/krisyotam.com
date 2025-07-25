import Link from "next/link"
import { getSeries } from "@/utils/series"
import { PageHeader } from "@/components/page-header"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.series

export const dynamic = "force-dynamic"

export default async function SeriesPage() {
  try {
    const seriesList = await getSeries()
    const currentDate = new Date().toISOString()

    if (seriesList.length === 0) {
      return (
        <div className="relative min-h-screen bg-background text-foreground">
          <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
            <PageHeader
              title="Series"
              subtitle="Content organized in sequential collections"
              date={currentDate}
              preview="This directory helps you navigate content organized in thematic series."
              status="In Progress"
              confidence="certain"
              importance={8}
              backText="Home"
              backHref="/"
            />
            <p className="text-xl text-muted-foreground">No series found.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <PageHeader
            title="Series"
            subtitle="Content organized in sequential collections"
            date={currentDate}
            preview="Browse articles and essays organized in thematic series, designed to be read in order."
            status="Finished"
            confidence="certain"
            importance={8}
            backText="Home"
            backHref="/"
          />

          <main>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-foreground">
                    <th className="py-2 text-left font-medium px-3">
                      Series
                    </th>
                    <th className="py-2 text-right font-medium px-3">
                      # of Posts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {seriesList.map((series, index) => (
                    <tr
                      key={series.slug}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                    >
                      <td className="py-2 px-3">
                        <Link href={`/series/${series.slug}`} className="text-foreground">
                          {series.name}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-right text-muted-foreground">
                        {series.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch series:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load series. Please try again later.</p>
      </div>
    )
  }
}