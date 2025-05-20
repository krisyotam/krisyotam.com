import { Metadata, Viewport } from "next"

// Add metadata export
export const metadata: Metadata = {
  title: "Page Not Found - Kris Yotam",
  description: "The page you're looking for doesn't exist",
  openGraph: {
    title: "Page Not Found - Kris Yotam",
    description: "The page you're looking for doesn't exist"
  },
  twitter: {
    title: "Page Not Found - Kris Yotam",
    description: "The page you're looking for doesn't exist"
  }
}

// Add viewport export with themeColor
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" }
  ]
} 