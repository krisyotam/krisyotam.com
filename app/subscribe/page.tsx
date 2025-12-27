"use client"

import React from "react"
import { PostHeader } from "@/components/post-header"
import PageDescription from "@/components/posts/typography/page-description"
import SubscribeClient from "./SubscribeClient"

export default function SubscribePage() {
  return (
    <main className="container mx-auto px-4 py-8">
  <div className="max-w-2xl mx-auto mb-4">
        <PostHeader
          title="Subscribe"
          subtitle="Follow along: newsletters and updates"
          start_date="2025-12-25"
          end_date={new Date().toISOString().split("T")[0]}
          preview="My offsite writings mainly publications both independant and one's I contribute to"
          status="Published"
          confidence="certain"
          importance={5}
        />
      </div>

  <div className="max-w-2xl mx-auto space-y-4">
        {/* Page description component (floating help) */}
        <PageDescription
          title="Subscribe"
          description="Embedded sign-up widgets for my newsletters. Substack manages subscriptions and stores subscriber emails; see the site's privacy policy for details."
        />

        {/* Client-side search + embeds */}
        <SubscribeClient />
      </div>
    </main>
  )
}
