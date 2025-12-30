// /lib/progymnasmata.ts
import { ProgymnasmataEntry } from "@/types/progymnasmata"

export async function getProgymnasmataEntryBySlug(slug: string): Promise<ProgymnasmataEntry | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/progymnasmata/entries`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) {
      throw new Error("Failed to fetch entries")
    }

    const entries: ProgymnasmataEntry[] = await res.json()
    return entries.find((entry) => entry.slug === slug)
  } catch (error) {
    console.error("Error fetching progymnasmata entry by slug:", error)
    return undefined
  }
}
