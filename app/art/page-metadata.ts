import { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Art - Kris Yotam",
  description: "Art, creative works and projects by Kris Yotam",
  openGraph: {
    title: "Art - Kris Yotam",
    description: "Art, creative works and projects by Kris Yotam"
  },
  twitter: {
    title: "Art - Kris Yotam",
    description: "Art, creative works and projects by Kris Yotam"
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" }
  ]
} 