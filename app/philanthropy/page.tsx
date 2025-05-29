import { Suspense } from "react"
import { PhilanthropyClient } from "./philanthropy-client"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Philanthropy | Kris Yotam",
  description: "Explore causes and organizations I support through charitable giving and volunteer work.",
  openGraph: {
    title: "Philanthropy | Kris Yotam",
    description: "Explore causes and organizations I support through charitable giving and volunteer work.",
    images: ["https://i.postimg.cc/6p4X2MNX/philanthropy.png"],
  },
}

export default function PhilanthropyPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle redirect from old ?type=X format to new /philanthropy/X format
  if (searchParams && searchParams.type) {
    const typeParam = typeof searchParams.type === 'string' ? searchParams.type : searchParams.type[0]
    if (typeParam && typeParam.toLowerCase() !== 'all') {
      redirect(`/philanthropy/${typeParam.toLowerCase().replace(/\s+/g, '-')}`)
    }
  }
  
  // If no type filter or "All" is selected, show all causes
  return <PhilanthropyClient initialType="All" />
}
