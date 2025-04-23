import { PageHeader } from "@/components/page-header"
import { ScriptViewer } from "./script-viewer"
import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"

export const dynamicParams = true

export async function generateMetadata({ params }: { params: { filename: string } }) {
  const { filename } = params
  const decodedFilename = decodeURIComponent(filename)

  return {
    title: `${decodedFilename} | Scripts | Kris Yotam`,
    description: `View the ${decodedFilename} script`,
  }
}

export async function generateStaticParams() {
  const scriptsDir = path.join(process.cwd(), "scripts")

  // Create scripts directory if it doesn't exist
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true })
    return []
  }

  try {
    const files = fs.readdirSync(scriptsDir, { withFileTypes: true })

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

export default function ScriptPage({ params }: { params: { filename: string } }) {
  const { filename } = params
  const decodedFilename = decodeURIComponent(filename)

  // Check if the file exists
  const filePath = path.join(process.cwd(), "scripts", decodedFilename)

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
          subtitle="Script Viewer"
          date={stats.mtime.toISOString()}
          preview={`View the ${decodedFilename} script file`}
          status="In Progress"
          confidence="certain"
          importance={7}
        />
      </div>

      <ScriptViewer filename={decodedFilename} />
    </main>
  )
}
