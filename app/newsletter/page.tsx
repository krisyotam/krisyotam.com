import NewsletterClientPage from "./NewsletterClientPage"
import newsletters from "@/data/newsletters.json"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.newsletter

export default async function NewsletterPage() {
  return <NewsletterClientPage initialNewsletters={newsletters} />
}

