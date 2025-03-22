import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ocsData from "../../../data/ocs.json"
import worldsData from "../../../data/worlds.json"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { getCharacterContent, getWorldContent } from "../../../utils/markdown-reader"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateStaticParams() {
  const characterSlugs = ocsData.characters.map((character) => ({
    slug: character.slug,
  }))

  const worldSlugs = worldsData.worlds.map((world) => ({
    slug: world.slug,
  }))

  return [...characterSlugs, ...worldSlugs]
}

export default async function ContentPage({ params }: { params: { slug: string } }) {
  try {
    // Check if it's a character
    const characterData = ocsData.characters.find((c) => c.slug === params.slug)

    if (characterData && characterData.status !== "hidden") {
      const content = await getCharacterContent(params.slug)

      if (!content) {
        notFound()
      }

      return (
        <div className="relative min-h-screen bg-background text-foreground">
          <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
            <div className="mb-8">
              <Button variant="outline" asChild>
                <Link href="/ocs">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Characters
                </Link>
              </Button>
            </div>
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src={characterData.photo || `/placeholder-square.svg`}
                  alt={characterData.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-center">{characterData.name}</h1>
            <p className="text-xl mb-4 text-center">from {characterData.book}</p>
            <p className="text-center mb-8 text-muted-foreground">by Kris Yotam</p>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.html }} />
          </div>
        </div>
      )
    }

    // Check if it's a world
    const worldData = worldsData.worlds.find((w) => w.slug === params.slug)

    if (worldData && worldData.status !== "hidden") {
      const content = await getWorldContent(params.slug)

      if (!content) {
        notFound()
      }

      return (
        <div className="relative min-h-screen bg-background text-foreground">
          <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
            <div className="mb-8">
              <Button variant="outline" asChild>
                <Link href="/ocs">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Worlds
                </Link>
              </Button>
            </div>
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-md aspect-video">
                <Image
                  src={worldData.photo || `/placeholder.svg?height=600&width=800`}
                  alt={worldData.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-center">{worldData.name}</h1>
            <p className="text-xl mb-4 text-center">
              {worldData.books.length > 0 ? `Featured in ${worldData.books.join(", ")}` : "Upcoming"}
            </p>
            <p className="text-center mb-8 text-muted-foreground">by Kris Yotam</p>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.html }} />
          </div>
        </div>
      )
    }

    // If neither character nor world is found
    notFound()
  } catch (error) {
    console.error("Failed to fetch content:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground">Failed to load content. Please try again later.</p>
      </div>
    )
  }
}

