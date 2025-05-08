import { PageHeader } from "@/components/page-header"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import { ReferenceViewerWrapper } from "./reference-viewer-wrapper"

interface Reference {
  id: string
  title: string
  type: string
  format: string
  author: string
  date: string
  url: string
  preview?: string
  status?: string
  confidence?: string
  importance?: number
}

export const dynamicParams = true

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params
  const reference = await getReferenceById(id)
  
  if (!reference) {
    return {
      title: "Reference Not Found | Kris Yotam",
      description: "The requested reference could not be found",
    }
  }

  return {
    title: `${reference.title} | References | Kris Yotam`,
    description: reference.preview || `View the ${reference.title} reference`,
  }
}

export async function generateStaticParams() {
  const references = await getAllReferences()
  
  return references.map((reference) => ({
    id: reference.id,
  }))
}

async function getAllReferences(): Promise<Reference[]> {
  const filePath = path.join(process.cwd(), "data", "references.json")
  
  if (!fs.existsSync(filePath)) {
    return []
  }
  
  try {
    const fileContents = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error reading references file:", error)
    return []
  }
}

async function getReferenceById(id: string): Promise<Reference | null> {
  const references = await getAllReferences()
  const reference = references.find((ref) => ref.id === id)
  
  return reference || null
}

export default async function ReferencePage({ params }: { params: { id: string } }) {
  const { id } = params
  const reference = await getReferenceById(id)
  
  if (!reference) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-[650px] mx-auto mb-8">
        <PageHeader
          title={reference.title}
          subtitle={reference.type}
          date={reference.date}
          preview={reference.preview}
          status={reference.status as any || "Finished"}
          confidence={reference.confidence as any || "certain"}
          importance={reference.importance || 7}
          backText="References"
          backHref="/references"
        />
      </div>

      <ReferenceViewerWrapper reference={reference} />
    </main>
  )
} 