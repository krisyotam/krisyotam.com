import "../app/globals.css"
import "katex/dist/katex.min.css"
import { CommandMenu } from "../components/command-menu"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "../components/theme-provider"
import { UniversalLinkModal } from "../components/universal-link-modal"
import { SettingsMenu } from "../components/settings-menu"
import { ScrollbarController } from "../components/scrollbar-controller"
import { DarkModeScript } from "../components/dark-mode-script"
import { DarkModeClasses } from "../components/dark-mode-classes"
import type React from "react"
import Script from "next/script"
import { MDXProviderWrapper } from './mdx-provider'
import { cn } from '../lib/utils'
import localFont from 'next/font/local';

// Define fontSans using localFont
const fontSans = localFont({
  src: '../public/fonts/outfit.woff2', // Adjust path if necessary
  variable: '--font-sans', // Optional: for CSS variable usage
});

// Default metadata for the site
export const metadata: Metadata = {
  title: "Kris Yotam",
  description: "Ideas, works, and reflections of a contemporary polymath",
  openGraph: {
    title: "Kris Yotam",
    description: "Ideas, works, and reflections of a contemporary polymath",
    url: "https://krisyotam.com",
    siteName: "Kris Yotam",    images: [
      {
        url: "https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png",
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
    images: ["https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png"]
  },
  metadataBase: new URL("https://krisyotam.com"),
}

// Viewport export for theme color
export const viewport: Viewport = {
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0c0c0c" media="(prefers-color-scheme: dark)" />
        <script async src="https://cdn.seline.so/seline.js" data-token="9bc08e3c42882e0"></script>
        <DarkModeScript />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
          storageKey="theme"
        >
          <MDXProviderWrapper>
            <div className="min-h-screen flex flex-col">
              <main className="flex-grow">{children}</main>
              <CommandMenu />
              <SettingsMenu />
              <UniversalLinkModalWrapper />
              <ScrollbarController />
              <DarkModeClasses />
            </div>
          </MDXProviderWrapper>
        </ThemeProvider>
        {/* Analytics Beacon */}
        <Script id="kris-analytics" strategy="afterInteractive">{`
          navigator.sendBeacon(
            '/api/page-view',
            JSON.stringify({
              path: window.location.pathname,
              referrer: document.referrer
            })
          );
        `}</Script>
      </body>
    </html>
  )
}
