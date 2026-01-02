import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/date"

interface Set {
  id: string
  title: string
  description: string
  coverImage: string
  link: string
  dateCreated: string
  notes: number
  audio: number
  images: number
}

interface SetGridProps {
  sets: Set[]
}

export default function SetGrid({ sets = [] }: SetGridProps) {
  if (!sets || sets.length === 0) {
    return <div className="mt-8 text-center text-muted-foreground">No flashcard sets found.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sets.map((s) => {
        const formattedDate = s.dateCreated ? formatDate(s.dateCreated) : ""

        return (
          <Link key={s.id} href={s.link} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="player not-prose flex flex-col bg-[#EAEEEA] dark:bg-[#0E0E0E] border dark:border-[#131313] p-1">
              <div className="flex flex-col bg-white dark:bg-[#18181A] p-3 shadow-2xs transition-colors rounded-sm">
                <div className="relative aspect-square overflow-hidden mb-3 rounded-sm">
                  <Image
                    src={s.coverImage || "/placeholder.svg?height=400&width=400"}
                    alt={s.title}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">Flashcards</span>
                    <span className="text-xs text-muted-foreground">{formattedDate}</span>
                  </div>

                  <h3 className="text-base font-medium text-foreground">{s.title}</h3>

                  <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>

                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Notes: </span>
                    {s.notes} • {s.audio} audio • {s.images} images
                  </div>
                </div>
              </div>

              <div className="pt-2 pl-2">
                <span className="flex items-center gap-2 text-xs leading-normal text-gray-500">
                  <div className="h-2 w-2 bg-[#ababab] dark:bg-[#454545] rounded-full" />
                  Last updated {formattedDate}
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
