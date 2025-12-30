import { PageHeader } from "@/components/core"
import MapList from "@/components/map-list"
import fs from "fs/promises"
import path from "path"

async function fetchMap() {
  try {
    const file = path.join(process.cwd(), "data", "map", "map.json")
    const raw = await fs.readFile(file, "utf8")
    return JSON.parse(raw)
  } catch (err) {
    console.error("fetchMap error:", err)
    return []
  }
}

export default async function MapPage() {
  const pages = await fetchMap()

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title="Map"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="a map of the pages available on krisyotam.com"
        />

        <MapList pages={pages} />
      </div>
    </div>
  )
}
