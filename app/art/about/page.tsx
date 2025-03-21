import { Suspense } from "react"
import fs from "fs"
import path from "path"
import AboutContent from "@/components/art/about-content"

async function getAboutMarkdown() {
  const filePath = path.join(process.cwd(), "art", "about.md")
  const fileContent = fs.readFileSync(filePath, "utf8")
  return fileContent
}

export default async function AboutPage() {
  const markdown = await getAboutMarkdown()

  return (
    <div>
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading content...</div>}>
        <AboutContent markdown={markdown} />
      </Suspense>
    </div>
  )
}

