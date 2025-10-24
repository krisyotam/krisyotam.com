import { QuestionsClientPage } from "./QuestionsClientPage"
import { PageDescription } from "@/components/posts/typography/page-description"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.questions

export default function QuestionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <QuestionsClientPage showPageHeader={true} />

        <PageDescription
          title="About the Questions Page"
          description="This section contains important questions and problems that I find intellectually compelling. Each question includes its current status (open or solved), relevant tags, source information, and explanatory notes. Use the search and filter controls above to find specific questions by topic, category, or keywords. The questions range from mathematical problems like the Millennium Prize Problems to broader scientific and philosophical inquiries."
        />
      </div>
    </div>
  )
}
