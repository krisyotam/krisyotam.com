import { PageHeader } from "@/components/page-header"
import { RulesOfTheInternetClient } from "./rules-of-the-internet-client"
import { PageDescription } from "@/components/posts/typography/page-description"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.rulesOfTheInternet

export default function RulesOfTheInternetPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="Rules of the Internet"
          subtitle="Internet Culture Guidelines"
          start_date={new Date().toISOString()}
          preview="The unofficial rules governing internet behavior and culture according to 4chan"
          status="Finished"
          confidence="certain"
          importance={8}
        />

        <PageDescription
          title="About the Rules of the Internet"
          description="&quot;Rules of the Internet&quot; is a loose collection of rules and aphorisms spawned by 4chan. Depending on whom you ask, they are either not meant to be taken seriously or are very Serious Business. Most of them don't apply except for within the community they originated from, and the list is continuously changing, but through Memetic Mutation, a handful have become well-known. Almost none of the numbers are standardized, so it's not uncommon to find many rules reordered or simply replaced altogether. The only numbers that are standardized are Rule 34, Rule 50, and Rule 63, as well as possibly Rules 1 and 2 (and that's probably only because of Fight Club)."
        />

        <div className="mt-8">
          <RulesOfTheInternetClient />
        </div>
      </div>
    </main>
  )
}
