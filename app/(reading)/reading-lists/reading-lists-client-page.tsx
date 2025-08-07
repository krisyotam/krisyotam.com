"use client"

import { ApolloProvider } from "@apollo/client"
import { client } from "@/lib/apollo-client"
import { ReadingLists } from "@/components/reading-lists"
import { ReadingNavigation } from "@/components/reading-navigation"

export function ReadingListsClientPage() {
  return (
    <ApolloProvider client={client}>
      <div>
        <ReadingNavigation />
        <div className="mt-8">
          <ReadingLists />
        </div>
      </div>
    </ApolloProvider>
  )
}
