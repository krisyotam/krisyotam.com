import Database from "better-sqlite3"
import path from "path"
import React from "react"
import "../../(tracking)/film/film.css"
import { PageHeader } from "@/components/core"
import { MediaSectionHeader } from "@/components/core/section-header"
import { ActorCard } from "@/components/content/PersonCard"
import { PaginatedCardGrid } from "@/components/content/PaginatedCardGrid"
import { PageDescription } from "@/components/core"

type Person = {
  slug: string
  name: string
  type: string
  image: string
  wiki: string
  sort_actor: number
  sort_artist: number
  sort_author: number
  sort_designer: number
  sort_mathematician: number
  sort_musician: number
  sort_philosopher: number
  sort_poet: number
}

const sortColumnMap: Record<string, keyof Person> = {
  Actor: 'sort_actor',
  Artist: 'sort_artist',
  Author: 'sort_author',
  Designer: 'sort_designer',
  Mathematician: 'sort_mathematician',
  Musician: 'sort_musician',
  Philosopher: 'sort_philosopher',
  Poet: 'sort_poet',
}

function loadPeople(): Person[] {
  const dbPath = path.join(process.cwd(), "public", "data", "system.db")
  const db = new Database(dbPath, { readonly: true })
  try {
    return db.prepare(`
      SELECT slug, name, type, image, wiki,
             sort_actor, sort_artist, sort_author,
             sort_designer, sort_mathematician, sort_musician,
             sort_philosopher, sort_poet
      FROM people
    `).all() as Person[]
  } finally {
    db.close()
  }
}

function groupByType(people: Person[]): Record<string, Person[]> {
  const grouped = people.reduce((acc, person) => {
    const type = person.type || "Other"
    if (!acc[type]) acc[type] = []
    acc[type].push(person)
    return acc
  }, {} as Record<string, Person[]>)

  // Sort each group by its type-specific sort column
  for (const type of Object.keys(grouped)) {
    const sortCol = sortColumnMap[type]
    if (sortCol) {
      grouped[type].sort((a, b) => {
        const aSort = (a[sortCol] as number) ?? 999
        const bSort = (b[sortCol] as number) ?? 999
        if (aSort !== bSort) return aSort - bSort
        return a.name.localeCompare(b.name)
      })
    } else {
      grouped[type].sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  return grouped
}

export default function PeoplePage() {
  const people = loadPeople()
  const groupedPeople = groupByType(people)
  const types = Object.keys(groupedPeople).sort()

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
          {types.length === 0 ? (
            <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full text-center">
              <p className="text-gray-600 dark:text-zinc-400">No people found.</p>
            </div>
          ) : (
            types.map((type) => (
              <section key={type} className="film-section">
                <MediaSectionHeader title={type + "s"} count={groupedPeople[type].length} />
                <PaginatedCardGrid squareButtons={true}>
                  {groupedPeople[type].map((p) => (
                    <ActorCard
                      key={p.slug}
                      id={p.slug}
                      name={p.name}
                      image={p.image || "/imgs/placeholder.svg"}
                    />
                  ))}
                </PaginatedCardGrid>
              </section>
            ))
          )}
        </div>

        <PageDescription
          title="People"
          description="I am often asked who my favorite person is in this or that respect, which has led to a great deal of thought on the figures who have influenced me most in various ways. I present to you the most coherent answer I could possibly give to such a question."
        />
      </div>
    </div>
  )
}
