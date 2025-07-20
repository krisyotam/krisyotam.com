// app/blogroll/page.tsx
import type { Metadata } from "next"
import { BlogrollClient } from "./blogroll-client"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.blogroll

export default function BlogrollPage() {
  return <BlogrollClient />
} 