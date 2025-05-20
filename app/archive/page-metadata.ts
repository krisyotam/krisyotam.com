import { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Archive - Kris Yotam",
  description: "Archive of all posts, writings, and content by Kris Yotam",
  openGraph: {
    title: "Archive - Kris Yotam",
    description: "Archive of all posts, writings, and content by Kris Yotam"
  },
  twitter: {
    title: "Archive - Kris Yotam",
    description: "Archive of all posts, writings, and content by Kris Yotam"
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" }
  ]
} 