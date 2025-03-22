import fs from "fs"
import path from "path"
import { Suspense } from "react"
import { WikiPages } from "@/components/wiki-pages"
import wikiPagesData from "@/data/wiki-pages.json"
import { remark } from "remark"
import html from "remark-html"
import { PageHeader } from "@/components/page-header"
import { WikiLinkHandler } from "@/components/wiki-link-handler"
import "./wiki.css"

export const metadata = {
  title: "Wiki | Kris Yotam",
  description: "Personal wiki and knowledge base of Kris Yotam",
}

// Content component that handles the async operation
async function WikiContent() {
  const filePath = path.join(process.cwd(), "app/wiki", "wiki.md")
  const fileContents = fs.readFileSync(filePath, "utf8")

  const processedContent = await remark().use(html).process(fileContents)

  const contentHtml = processedContent.toString()

  return (
    <>
      <article
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-pre:bg-muted prose-pre:rounded-lg prose-img:rounded-lg font-serif wiki-content"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <WikiLinkHandler />
    </>
  )
}

// Non-async component as the default export
export default function WikiPage() {
  // Wiki page metadata
  const wikiPageData = {
    title: "Personal Wiki",
    subtitle: "A Collection of Knowledge and Thoughts",
    date: new Date().toISOString(),
    preview: "This wiki serves as a personal knowledge base and digital garden, evolving as new insights are gathered.",
    status: "In Progress" as const,
    confidence: "likely" as const,
    importance: 7,
  }

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
      {/* Add the PageHeader component */}
      <PageHeader
        title={wikiPageData.title}
        subtitle={wikiPageData.subtitle}
        date={wikiPageData.date}
        preview={wikiPageData.preview}
        status={wikiPageData.status}
        confidence={wikiPageData.confidence}
        importance={wikiPageData.importance}
      />

      {/* Add academic styling to the WikiPages component */}
      <div className="mb-12 border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
        <h2 className="text-2xl font-serif font-medium tracking-tight mb-6 text-center uppercase">Wiki-Pages-Index</h2>
        <WikiPages pages={wikiPagesData.pages} />
      </div>

      {/* Add academic styling to the content */}
      <div className="border border-border bg-card text-card-foreground p-6 rounded-sm shadow-sm">
        <Suspense
          fallback={
            <div className="py-8 text-center text-muted-foreground font-serif italic">Loading scholarly content...</div>
          }
        >
          <WikiContent />
        </Suspense>
      </div>

      {/* Add a decorative footer */}
      <footer className="mt-12 text-center">
        <div className="inline-block border-t border-border w-1/3"></div>
        <p className="mt-4 text-sm font-serif italic text-muted-foreground">
        "the unexamined life is not worth living" - Socrates
        </p>
      </footer>
    </div>
  )
}
