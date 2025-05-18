import "../app/globals.css"
import { CommandMenu } from "../components/command-menu"
import type { Metadata } from "next"
import { ThemeProvider } from "../components/theme-provider"
import { UniversalLinkModal } from "../components/universal-link-modal"
import { SettingsMenu } from "../components/settings-menu"
import { ScrollbarController } from "../components/scrollbar-controller"
import { DarkModeScript } from "../components/dark-mode-script"
import type React from "react"
import Script from "next/script"

// Default metadata for the site
export const metadata: Metadata = {
  title: "Kris Yotam",
  description: "Ideas, works, and reflections of a contemporary polymath",
  openGraph: {
    title: "Kris Yotam",
    description: "Ideas, works, and reflections of a contemporary polymath",
    url: "https://krisyotam.com",
    siteName: "Kris Yotam",
    images: [
      {
        url: "https://krisyotam.com/social.png", // Update this with your default image
        width: 1200,
        height: 630,
        alt: "Kris Yotam",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kris Yotam",
    description: "Ideas, works, and reflections of a contemporary polymath",
    creator: "@krisyotam",
    images: ["https://krisyotam.com/social.png"], // Update this with your default image
  },
  metadataBase: new URL("https://krisyotam.com"),
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" },
  ],
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
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0c0c0c" media="(prefers-color-scheme: dark)" />
        <script async src="https://cdn.seline.so/seline.js" data-token="9bc08e3c42882e0"></script>
        <DarkModeScript />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
          storageKey="theme"
        >
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <CommandMenu />
            <SettingsMenu />
            <UniversalLinkModalWrapper />
            <ScrollbarController />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
