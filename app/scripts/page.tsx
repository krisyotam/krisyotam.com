import { PageHeader } from "@/components/page-header"
import { ScriptsClient } from "./scripts-client"

export const metadata = {
  title: "Scripts | Kris Yotam",
  description: "A collection of useful scripts and utilities",
}

export default function ScriptsPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader 
        title="Scripts"
        subtitle="Utility Scripts Collection"
        date={new Date().toISOString()}
        preview="useful scripts created to manage krisyotam.com and krisyotam.net."
        status="In Progress"
        confidence="certain"
        importance={7}
      />
      <ScriptsClient />
    </main>
  )
}
