import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { ProgymHeader } from "@/components/progymnasmata/progym-header"
import { ProgymFooter } from "@/components/progymnasmata/progym-footer"
import type { Metadata } from "next"

interface ProgymnasmataItem {
  title: string
  category: string
  date: string
  description: string
  slug: string
  inspiration?: string
  image?: string // Add this line
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = await getWorkBySlug(params.slug)

  if (!work) {
    return {
      title: "Work Not Found | Progymnasmata",
    }
  }

  return {
    title: `${work.title} | Progymnasmata`,
    description: work.description,
  }
}

async function getWorkBySlug(slug: string): Promise<ProgymnasmataItem | null> {
  try {
    const filePath = path.join(process.cwd(), "data", "progymnasmata.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)

    return data.find((item: ProgymnasmataItem) => item.slug === slug) || null
  } catch (error) {
    console.error("Error fetching work by slug:", error)
    return null
  }
}

async function getWorkContent(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "app", "progymnasmata", "works", slug, "page.md")

    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8")
    }

    return null
  } catch (error) {
    console.error("Error reading work content:", error)
    return null
  }
}

export default async function WorkPage({ params }: Props) {
  const { slug } = params
  const work = await getWorkBySlug(slug)
  const content = await getWorkContent(slug)

  if (!work) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4">
      <article className="max-w-2xl mx-auto">
        <ProgymHeader title={work.title} category={work.category} date={work.date} />

        <main className="py-8">
          {work.inspiration && (
            <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">Inspiration:</span> {work.inspiration}
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">Content for this work is not available yet.</p>
            )}
          </div>
        </main>

        <ProgymFooter />
      </article>
    </div>
  )
}

