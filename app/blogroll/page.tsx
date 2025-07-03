// app/blogroll/page.tsx
import type { Metadata } from "next"
import { BlogrollClient } from "./blogroll-client"

export const metadata: Metadata = {
  title: "Blogroll | Kris Yotam",
  description:
    "A curated collection of websites and authors that inspire and inform.",
}

export default function BlogrollPage() {
  return <BlogrollClient />
} 