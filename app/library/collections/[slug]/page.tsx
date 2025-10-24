import { CollectionHeader } from "@/components/collection-header"
import { LocalCollectionContent } from "@/components/local-collection-content"
import fs from "fs"
import path from "path"

// Define the collection type to ensure proper typing
interface Collection {
  id: string
  title: string
  subtitle?: string
  description: string
  lastUpdated?: string
  status?: "abandoned" | "notes" | "draft" | "in progress" | "finished" | "maintained" | "complete"
  confidence?:
    | "impossible"
    | "remote"
    | "highly unlikely"
    | "unlikely"
    | "possible"
    | "likely"
    | "highly likely"
    | "certain"
  importance?: number
  books: any[]
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "data", "local-collections.json")
  const fileData = fs.readFileSync(filePath, "utf8")
  const collectionsData = JSON.parse(fileData)

  return collectionsData.collections.map((collection: { id: string }) => ({
    slug: collection.id,
  }))
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), "data", "local-collections.json")
  const fileData = fs.readFileSync(filePath, "utf8")
  const collectionsData = JSON.parse(fileData)

  const collection = collectionsData.collections.find((c: Collection) => c.id === params.slug) as Collection | undefined

  if (!collection) {
    return <div>Collection not found</div>
  }

  // Reverse the order of notes so the newest show up first
  const reversedCollection = {
    ...collection,
    books: [...collection.books].reverse(),
  }

  // Set metadata for the page
  const metadata = {
    title: `${collection.title} | Kris Yotam's Library`,
    description: collection.description,
  }

  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <CollectionHeader
        title={collection.title}
        subtitle={collection.subtitle}
        date={collection.lastUpdated}
        preview={collection.description}
        status={collection.status}
        confidence={collection.confidence}
        importance={collection.importance}
        backLink="/library"
        backText="Library"
      />
      <LocalCollectionContent collection={reversedCollection} />
    </main>
  )
}
