import { PageHeader } from "@/components/page-header"
import { PromptsClient } from "./prompts-client"

export const metadata = {
  title: "Prompts | Kris Yotam",
  description: "A collection of useful prompts for AI models",
}

export default function PromptsPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Prompts"
        subtitle="AI Prompt Collection"
        date={new Date().toISOString()}
        preview="A collection of useful prompts for various AI models and use cases."
        status="In Progress"
        confidence="certain"
        importance={7}
      />
      <PromptsClient />
    </main>
  )
}
