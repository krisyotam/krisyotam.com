import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import poemsData from "@/data/poems.json"
import { PoetryCard } from "@/components/poetry"
import type { Poem } from "@/utils/poems"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateStaticParams() {
  const years = Array.from(new Set(poemsData.map((poem: any) => poem.year.toString())))
  return years.map((year) => ({ year }))
}

export default function YearPage({ params }: { params: { year: string } }) {
  const year = Number.parseInt(params.year)

  if (isNaN(year)) {
    notFound()
  }

  const poems = poemsData.filter((poem: any) => poem.year === year) as Poem[]

  if (poems.length === 0) {
    notFound()
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/poetry">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Poetry
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-semibold mb-3 text-foreground">Poems from {year}</h1>
          <p className="text-muted-foreground">
            {poems.length} {poems.length === 1 ? "poem" : "poems"} from this year
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {poems.map((poem) => (
            <PoetryCard key={poem.id} poem={poem} />
          ))}
        </div>
      </div>
    </div>
  )
}

