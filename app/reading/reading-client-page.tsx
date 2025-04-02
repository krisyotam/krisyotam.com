"use client"

import { ApolloProvider } from "@apollo/client"
import { client } from "@/lib/apollo-client"
import { ReadingContent } from "@/components/reading-content"
import { useEffect } from "react"

export function ReadingClientPage() {
  // Log when the component mounts for debugging
  useEffect(() => {
    console.log("ReadingClientPage mounted, Apollo client initialized")
  }, [])

  return (
    <ApolloProvider client={client}>
      <ReadingContent />
    </ApolloProvider>
  )
}

