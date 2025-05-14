import { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import DonateContent from "./donate-content.mdx"
import { Footer } from "@/app/blog/(post)/components/footer"

export const metadata: Metadata = {
  title: "Donate | Kris Yotam",
  description: "Your contributions help me continue creating high-quality stable essays",
}

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <PageHeader
        title="Donate"
        date={new Date().toISOString()}
        status="In Progress"
        confidence="certain"
        importance={8}
        preview="Your support helps me continue creating high-quality content and research."
      />
      
      <div className="mt-4">
        <DonateContent />
      </div>

      <Footer />
    </div>
  )
} 