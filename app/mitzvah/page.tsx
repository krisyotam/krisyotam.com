import { PageHeader } from "@/components/page-header"
import { MitzvahClient } from "./mitzvah-client"
import { PageDescription } from "@/components/posts/typography/page-description"

export const metadata = {
  title: "Mitzvah | Kris Yotam",
  description: "Mitzvah laws, commandments, and their scriptural references",
}

export default function MitzvahPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="Mitzvah"
          subtitle="Commandments and Scriptures"
          date={new Date().toISOString()}
          preview="A comprehensive listing of the Biblical commandments (Mitzvot)"
          status="Finished"
          confidence="certain"
          importance={10}
        />

        <PageDescription
          title="About the Mitzvah Laws"
          description="This page presents the Mitzvah laws, which are the commandments in Judaism as derived from the Torah. These 613 commandments (תרי״ג מצוות, taryag mitzvot) include both positive commandments (things to do) and negative commandments (things to refrain from doing). They serve as a comprehensive guide for Jewish religious life and practice. Each commandment is presented with its scriptural reference."
        />

        <div className="mt-8">
          <MitzvahClient />
        </div>
      </div>
    </main>
  )
} 