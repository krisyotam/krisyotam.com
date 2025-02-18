import "../app/globals.css"
import { CommandMenu } from "../components/command-menu"
import type { Metadata } from "next"
import { ThemeProvider } from "../components/theme-provider"
import type React from "react" // Added import for React

export const metadata: Metadata = {
  title: "Kris Yotam - Personal Blog",
  description: "Explore insights on minimalism, technology, and personal growth with Kris Yotam's blog.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <CommandMenu />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'