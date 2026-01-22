import "../app/globals.css"
import "katex/dist/katex.min.css"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "../components/theme-provider"
import { ScrollbarController } from "../components/scrollbar-controller"
import { DarkModeScript } from "../components/dark-mode-script"
import { DarkModeClasses } from "../components/dark-mode-classes"
import { HeaderUnderlineDetector } from "../components/header-underline-detector"
import { Wrapper } from "../components/core/wrapper"
import type React from "react"
import Script from "next/script"
import { MDXProviderWrapper } from './mdx-provider'
import { cn } from '../lib/utils'
import localFont from 'next/font/local'
import { siteConfig } from '@/lib/seo'

// Define fontSans using localFont
const fontSans = localFont({
  src: '../../public/fonts/text/outfit/Outfit-Regular.woff2',
  variable: '--font-sans',
});

// Enhanced metadata for the site
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${siteConfig.url}/feed.xml`,
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og?title=${encodeURIComponent(siteConfig.name)}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.creator,
    images: [`${siteConfig.url}/og?title=${encodeURIComponent(siteConfig.name)}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" type="application/rss+xml" title="Kris Yotam RSS Feed" href="/feed.xml" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0c0c0c" media="(prefers-color-scheme: dark)" />
        <DarkModeScript />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)} suppressHydrationWarning>
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
              {/* Lazy-loaded interactive components */}
              <Wrapper showModal={SHOW_UNIVERSAL_LINK_MODAL} />
              <ScrollbarController />
              <DarkModeClasses />
              <HeaderUnderlineDetector />
            </div>
          </MDXProviderWrapper>
        </ThemeProvider>
        {/* Seline Analytics - loaded after page interactive */}
        <Script
          src="https://cdn.seline.so/seline.js"
          data-token="9bc08e3c42882e0"
          strategy="afterInteractive"
        />
        {/* Page View Beacon */}
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
