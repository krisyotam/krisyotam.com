import type { Metadata } from "next"
import { Progymnasmata } from "@/components/progymnasmata/progymnasmata"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Progymnasmata | Kris Yotam",
  description:
    "A collection of rhetorical exercises in the classical tradition, exploring various forms of composition and argumentation.",
}

export default function ProgymnasmataPage() {
  return (
    <main className="max-w-[850px] mx-auto px-1 py-12">
      <PageHeader
        title="Progymnasmata"
        subtitle="Classical Rhetorical Exercises"
        date="2025-01-01"
        preview="A collection of rhetorical exercises in the classical tradition, exploring various forms of composition and argumentation."
        status="In Progress"
        confidence="likely"
        importance={7}
        className="w-full" // Add this to ensure the header takes the full width of its container
      />
      <div className="mt-8">
        <Progymnasmata />
      </div>
    </main>
  )
}

