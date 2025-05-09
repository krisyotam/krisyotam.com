import { Metadata } from "next"

// Define default metadata for the blog section (server component)
export const metadata: Metadata = {
  title: {
    template: "%s | Kris Yotam",
    default: "Blog | Kris Yotam"
  },
  description: "Articles, essays, and thoughts on a variety of topics",
  openGraph: {
    type: "website",
    title: {
      template: "%s | Kris Yotam",
      default: "Blog | Kris Yotam"
    },
    description: "Articles, essays, and thoughts on a variety of topics"
  }
}