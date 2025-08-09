import { getTilData } from "@/lib/data"
import TilClientPage from "./TilClientPage"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const dynamic = "force-static"

export const metadata: Metadata = staticMetadata.til

export default async function TILPage() {
  try {
    const tilData = await getTilData()
    const tilEntries = tilData.til

    // Sort by date (newest first)
    const sortedEntries = tilEntries
      .slice() // Copy to avoid modifying the original array
      .sort((a, b) => {
        const aDate = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date;
        const bDate = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      }); // Sort by date in descending order

    return (
      <div className="til-container">
        <TilClientPage tilEntries={sortedEntries} initialCategory="all" />
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch TIL entries:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Error Loading TIL Entries</h2>
          <p className="text-muted-foreground mb-6">
            Failed to load TIL entries. The GitHub repository might be unavailable or there might be an issue with the
            connection.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
}

