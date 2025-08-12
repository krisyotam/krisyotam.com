"use client"
import { useState, useEffect } from "react"
import { Progymnasmata } from "@/components/progymnasmata/progymnasmata"
import { PostHeader } from "@/components/post-header"
import { Footer } from "@/app/(content)/essays/components/footer"
import { usePathname } from "next/navigation"

// Interface for progymnasmata data
interface ProgymnasmataEntry {
  title: string
  slug: string
  type: string
  date: string
  description: string
  paragraphs: string[]
  image?: string
  importance: number
  citation?: string
  tags: string[]
  readingTime: string
  preview: string
}

export default function ProgymnasmataClientPage() {
  const pathname = usePathname()
  const [postData, setPostData] = useState<ProgymnasmataEntry | null>(null)
  const slug = pathname.split('/').pop() || ''
  
  useEffect(() => {
    // Fetch the specific entry data based on the slug
    async function fetchPostData() {
      try {
        const response = await fetch(`/api/progymnasmata/entries`)
        if (!response.ok) throw new Error("Failed to fetch entries")
        
        const entries: ProgymnasmataEntry[] = await response.json()
        const entry = entries.find(e => e.slug === slug)
        
        if (entry) {
          setPostData(entry)
        }
      } catch (error) {
        console.error("Error fetching progymnasmata entry:", error)
      }
    }
    
    if (slug) {
      fetchPostData()
    }
  }, [slug])
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {postData && (
          <PostHeader
            title={postData.title}
            preview={postData.preview}
            start_date={(postData as any).start_date || postData.date || new Date().toISOString().split('T')[0]}
            end_date={(postData as any).end_date}
            tags={postData.tags}
            importance={postData.importance}
            backText="Progymnasmata"
            backHref="/progymnasmata"
          />
        )}
        <Progymnasmata />
      </div>
      
      {/* Citation section */}
      {postData?.citation && (
        <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-600 dark:text-gray-400">
          <h3 className="font-semibold mb-2">Citation</h3>
          <p>{postData.citation}</p>
        </div>
      )}
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

