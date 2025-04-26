import "../app/globals.css"
import { CommandMenu } from "../components/command-menu"
import type { Metadata } from "next"
import { ThemeProvider } from "../components/theme-provider"
import { UniversalLinkModal } from "../components/universal-link-modal"
import { SettingsMenu } from "../components/settings-menu"
import type React from "react"

export const metadata: Metadata = {
  title: "Kris Yotam",
  description: "Ideas, works, and reflections of a contemporary polymath",
}

// Toggle this to true or false to control execution
const SHOW_UNIVERSAL_LINK_MODAL = true

function UniversalLinkModalWrapper() {
  if (!SHOW_UNIVERSAL_LINK_MODAL) return null
  return <UniversalLinkModal />
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <script async src="https://cdn.seline.so/seline.js" data-token="9bc08e3c42882e0"></script>
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <CommandMenu />
            <SettingsMenu />
            <UniversalLinkModalWrapper />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
