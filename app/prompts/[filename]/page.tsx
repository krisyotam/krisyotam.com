import { PageHeader } from "@/components/page-header"
import { PromptViewer } from "./prompt-viewer"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"

export const dynamicParams = true

export async function generateMetadata({ params }: { params: { filename: string } }) {
  const { filename } = params
  const decodedFilename = decodeURIComponent(filename)

  return {
    title: `${decodedFilename} | Prompts | Kris Yotam`,
    description: `View the ${decodedFilename} prompt`,
  }
}

export async function generateStaticParams() {
  const promptsDir = path.join(process.cwd(), "prompts")

  // Create prompts directory if it doesn't exist
  if (!fs.existsSync(promptsDir)) {
    fs.mkdirSync(promptsDir, { recursive: true })
    return []
  }

  try {
    const files = fs.readdirSync(promptsDir, { withFileTypes: true })

    return files
      .filter((file) => file.isFile())
      .map((file) => ({
        filename: file.name,
      }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export default function PromptPage({ params }: { params: { filename: string } }) {
  const { filename } = params
  const decodedFilename = decodeURIComponent(filename)

  // Check if the file exists
  const filePath = path.join(process.cwd(), "prompts", decodedFilename)

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    notFound()
  }

  // Get file stats
  const stats = fs.statSync(filePath)

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-[650px] mx-auto mb-8">
        <PageHeader
          title={decodedFilename}
          subtitle="Prompt Viewer"
          date={stats.mtime.toISOString()}
          preview={`View the ${decodedFilename} prompt file`}
          status="In Progress"
          confidence="certain"
          importance={7}
          backText="Prompts"
          backHref="/prompts"
        />
      </div>

      <PromptViewer filename={decodedFilename} />
    </main>
  )
}
