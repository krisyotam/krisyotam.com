import NewsletterClientPage from "./NewsletterClientPage"
import newsletters from "@/data/newsletters.json"

export const metadata = {
  title: "Newsletter Archive",
  description: "A collection of thoughts, ideas, and insights delivered straight to your inbox.",
}

export default async function NewsletterPage() {
  return <NewsletterClientPage initialNewsletters={newsletters} />
}

