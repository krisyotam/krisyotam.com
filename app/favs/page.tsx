import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import FavsClient from "@/app/favs/favs-client"
import { redirect } from "next/navigation"

export default function FavsPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle redirect from old ?category=X format to new /favs/X format
  if (searchParams && searchParams.category) {
    const categoryParam = typeof searchParams.category === 'string' 
      ? searchParams.category 
      : searchParams.category[0]
      
    if (categoryParam && categoryParam.toLowerCase() !== 'all') {
      redirect(`/favs/${categoryParam.toLowerCase()}`)
    }
  }
  
  // If no category filter is selected, show all items
  return <FavsClient initialCategory="All" />
} 