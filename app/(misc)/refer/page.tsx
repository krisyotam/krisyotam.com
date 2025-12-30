import { PageHeader } from "@/components/core"
import { ReferClient } from "./refer-client"
import { PageDescription } from "@/components/core"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.blogroll

export default function ReferPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="Refer"
          subtitle="Referral Links & Partner Offers"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split("T")[0]}
          preview="A curated list of referral links, partner offers, and discounts I recommend. Click any item for details and the referral URL."
          status="In Progress"
          confidence="likely"
          importance={6}
        />

        <PageDescription
          title="About the Refer Page"
          description="This page collects referral links and partner offers I use or recommend. Each entry includes the referral URL, a short description, and any rewards or discounts available to new signups."
        />

        <div className="mt-8">
          <ReferClient />
        </div>
      </div>
    </main>
  )
}
