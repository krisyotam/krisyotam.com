import poemsData from "@/data/poems.json"
import type { Poem } from "@/utils/poems"
import PoemPageClient from "./PoemPageClient"

export async function generateStaticParams() {
  const poems = poemsData as Poem[]
  return poems.map((poem) => ({
    year: poem.year.toString(),
    slug: poem.slug,
  }))
}

export default function PoemPage({ params }: { params: { year: string; slug: string } }) {
  return <PoemPageClient params={params} />
}

