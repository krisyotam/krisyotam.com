import Database from "better-sqlite3"
import path from "path"
import React from "react"
import "../../(tracking)/film/film.css"
import { PageHeader } from "@/components/core"
import { TraktSectionHeader } from "@/components/trakt/trakt-section-header"
import { TraktFavActorCard } from "@/components/trakt/trakt-fav-actor-card"
import { TraktHorizontalScroll } from "@/components/trakt/trakt-horizontal-scroll"
import { PageDescription } from "@/components/core"

type Person = {
  slug: string
  name: string
  type: string
  image: string
  wiki: string
}

function loadPeople(): Person[] {
  const dbPath = path.join(process.cwd(), "public", "data", "system.db")
  const db = new Database(dbPath, { readonly: true })
  try {
    return db.prepare("SELECT slug, name, type, image, wiki FROM people ORDER BY name").all() as Person[]
  } finally {
    db.close()
  }
}

function groupByType(people: Person[]): Record<string, Person[]> {
  return people.reduce((acc, person) => {
    const type = person.type || "Other"
    if (!acc[type]) acc[type] = []
    acc[type].push(person)
    return acc
  }, {} as Record<string, Person[]>)
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
                <TraktSectionHeader title={type + "s"} count={groupedPeople[type].length} />
                <TraktHorizontalScroll squareButtons={true}>
                  {groupedPeople[type].map((p) => (
                    <TraktFavActorCard
                      key={p.slug}
                      id={p.slug}
                      name={p.name}
                      image={p.image || "/imgs/placeholder.svg"}
                    />
                  ))}
                </TraktHorizontalScroll>
              </section>
            ))
          )}
        </div>

        <PageDescription
          title="People"
          description="People I admire from various fields."
        />
      </div>
    </div>
  )
}
