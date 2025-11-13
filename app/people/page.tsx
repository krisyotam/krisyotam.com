import fs from "fs"
import path from "path"
import React from "react"
import "../film/film.css"
import { PageHeader } from "@/components/page-header"
import { TraktSectionHeader } from "@/components/trakt/trakt-section-header"
import { TraktFavActorCard } from "@/components/trakt/trakt-fav-actor-card"
import { TraktHorizontalScroll } from "@/components/trakt/trakt-horizontal-scroll"
import { PageDescription } from "@/components/posts/typography/page-description"

type PersonEntry = {
  id?: string | number
  name: string
  image?: string
  avatar?: string
  [k: string]: any
}

type PeopleFile = {
  file: string
  label?: string
  people: PersonEntry[]
}

async function loadPeopleFiles(): Promise<PeopleFile[]> {
  const dir = path.join(process.cwd(), "data", "people")
  try {
    const filenames = await fs.promises.readdir(dir)
    const out: PeopleFile[] = []
    // Prefer these files (in order) if they exist, otherwise fall back to all JSONs
  const preferred = ["journalists.json", "writers.json", "mathematicians.json", "designers.json"]
    // prefer showing artists first when present
    const preferredWithArtists = ["artists.json", ...preferred]
    const toRead = preferredWithArtists.filter((f) => filenames.includes(f))
    const finalList = toRead.length > 0 ? toRead : filenames.filter((f) => f.endsWith(".json"))

    await Promise.all(
      finalList.map(async (file) => {
        const content = await fs.promises.readFile(path.join(dir, file), "utf8")
        try {
          const parsed = JSON.parse(content)
          let people: PersonEntry[] = []

          if (Array.isArray(parsed)) {
            people = parsed
          } else if (parsed && Array.isArray((parsed as any).people)) {
            people = (parsed as any).people
          } else if (parsed && parsed.name) {
            people = [parsed]
          }

          // nicer labels for known files
          const displayNames: Record<string, string> = {
            "journalists.json": "Journalists",
            "artists.json": "Artists",
            "writers.json": "Writers",
            "mathematicians.json": "Mathematicians",
            "designers.json": "Designers",
          }

          out.push({ file, label: displayNames[file] ?? path.basename(file, ".json"), people })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(`Failed to parse ${file}:`, err)
        }
      })
    )

    return out
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error loading people data:", err)
    return []
  }
}

export default async function PeoplePage() {
  const files = await loadPeopleFiles()

  return (
    <div className="py-12">
      <div className="film-page">
        <PageHeader
          title="People"
          preview="people that I admire from various fields with descriptions of their significance to me"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split("T")[0]}
          status="Finished"
          confidence="certain"
          importance={6}
        />

        <div className="mt-6">
          {files.length === 0 && (
            <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full text-center">
              <p className="text-gray-600 dark:text-zinc-400">No people files found in data/people.</p>
            </div>
          )}

          {files.map((f) => (
            <section key={f.file} className="film-section">
              <TraktSectionHeader title={f.label ?? f.file} count={f.people.length} />

              {f.people && f.people.length > 0 ? (
                <TraktHorizontalScroll squareButtons={true}>
                  {f.people.map((p, idx) => (
                    <TraktFavActorCard
                      key={p.id ?? p.name ?? idx}
                      id={p.id ?? p.name ?? idx}
                      name={p.name}
                      image={p.image ?? p.avatar ?? "/imgs/placeholder.svg"}
                    />
                  ))}
                </TraktHorizontalScroll>
              ) : (
                <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full text-center">
                  <p className="text-gray-600 dark:text-zinc-400">No people in this file.</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Page info button (bottom-left) */}
        <PageDescription
          title="People"
          description={`This page renders lists of people pulled from JSON files in data/people. Each file is shown as its own horizontal row using the same actor cards as the /film page.`}
        />
      </div>
    </div>
  )
}
