import type { Metadata } from "next"
import { ReportsClient } from "./reports-client"
import { redirect } from "next/navigation"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.reports
  twitter: {
    card: "summary_large_image",
    title: "Reports Collection | Kris Yotam",
    description: "Explore a diverse collection of formal reports by Kris Yotam.",
    images: ["https://i.postimg.cc/jSDMT1Sn/research.png"],
  },
}

export default function ReportsPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle redirect from old ?category=X format to new /reports format
  if (searchParams && searchParams.category) {
    const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : searchParams.category[0]
    if (categoryParam && categoryParam.toLowerCase() !== 'all') {
      redirect(`/reports`)
    }
  }
  
  // Show all reports
  return <ReportsClient initialCategory="All" />
}