import type { Metadata } from "next"
import fs from "fs"
import path from "path"
import ResearchBountiesClient from "./ResearchBountiesClient"
import { ExpandableSubsection } from "@/components/expandable-subsection"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Research Bounties | Kris Magnum Opus",
  description:
    "A list of papers, books, and materials I have failed to obtain, with financial bounties for anyone who can provide copies.",
}

async function getBounties() {
  try {
    const filePath = path.resolve("./data/research-bounties.json")
    console.log("Attempting to read file from:", filePath)

    if (!fs.existsSync(filePath)) {
      console.error("File does not exist at path:", filePath)
      return []
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)
    return data.bounties || []
  } catch (error) {
    console.error("Error reading bounties file:", error)
    return []
  }
}

export default async function ResearchBountiesPage() {
  const bounties = await getBounties()

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
      <PageHeader
        title="Research Bounties"
        subtitle="Rewards for obscure files"
        preview="A list of rare or inaccessible research materials I've been unable to obtain—offering financial rewards for those who can help locate them."
        date="2025-01-15"
        status="In Progress"
        confidence="certain"
        importance={1}
      />

      <div className="mb-8">
        <ExpandableSubsection title="About Research Bounties">
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
            <p>
              Sometimes in research, despite my best search techniques, I am unable to get a digital copy of a paper or
              book to upload to Libgen. This page lists my failures to date, and offers bounties for anyone who can get
              me a digital copy of them (often possible via a university ILL department, which are no longer accessible
              to me).
            </p>
            <p>
              Internet Archive scans are not accepted due to low quality, unless there are extenuating circumstances.
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">Standard bounties:</span> $10 for
              papers/theses/chapters & $20 for books/videos/miscellaneous
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">Payment methods:</span> PayPal or Amazon
              gift cards preferred; other methods possible but may require more work
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">Additional costs:</span> I may pay
              bounty+costs if not unreasonable or you contact me in advance with the total
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">To claim:</span> Contact me with the copy.
              Payments are first-come-first served unless you contact me in advance so I can remove it from the list &
              avoid unnecessary duplication.
            </p>
            <p className="font-medium text-gray-700 dark:text-gray-300">Current count of filled bounties: 47</p>
          </div>
        </ExpandableSubsection>
      </div>

      <ResearchBountiesClient initialBounties={bounties} />
    </div>
  )
}
