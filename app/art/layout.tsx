import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import HelpModal from "@/components/art/help-modal"
import ProfileHeader from "@/components/art/profile-header"
import TabNavigation from "@/components/art/tab-navigation"
import artBio from "@/data/art-bio.json"

export const metadata: Metadata = {
  title: "Art Portfolio | Lael Yotam",
  description: "Explore traditional and AI-generated artwork by Lael Yotam",
}

export default function ArtLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background text-foreground">
        <main className="container max-w-5xl mx-auto px-4 py-8">
          <ProfileHeader profileData={artBio} />
          <TabNavigation />
          {children}
          <HelpModal />
        </main>
      </div>
    </ThemeProvider>
  )
}

