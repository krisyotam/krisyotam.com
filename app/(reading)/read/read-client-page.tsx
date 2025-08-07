"use client"

import { ApolloProvider } from "@apollo/client"
import { client } from "@/lib/apollo-client"
import { ReadingSubTabs } from "@/components/reading-sub-tabs"
import { ReadingNavigation } from "@/components/reading-navigation"
import { ReadingDataLoader } from "@/components/reading-data-loader"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function ReadClientPage() {
  const [activeSubTab, setActiveSubTab] = useState<string>("books")
  const router = useRouter()

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && ['books', 'blog-posts', 'short-stories', 'verse', 'essays', 'papers'].includes(hash)) {
        setActiveSubTab(hash)
      } else {
        setActiveSubTab('books')
      }
    }

    // Set initial state from hash
    handleHashChange()
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Update hash when subtab changes
  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab)
    router.push(`/read#${subTab}`, { scroll: false })
  }

  return (
    <ApolloProvider client={client}>
      <ReadingNavigation />
      <ReadingDataLoader>
        <ReadingSubTabs 
          activeTab={activeSubTab} 
          onTabChange={handleSubTabChange}
          showBooks={true}
        />
      </ReadingDataLoader>
    </ApolloProvider>
  )
}
