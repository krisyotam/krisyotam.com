"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"
import format from "date-fns/format"
import { useRouter } from "next/navigation"

// Import legal data
import legalData from './legal.json'

interface LegalDocument {
  name: string
  slug: string
  status: "active" | "hidden"
  lastUpdated: string
  description?: string
}

export function LegalDocumentsClient() {
  const [documents] = useState(
    legalData.documents.filter(doc => doc.status === 'active') as LegalDocument[]
  )
  const router = useRouter()

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd")
    } catch (error) {
      return dateString
    }
  }

  const handleDocumentClick = (slug: string) => {
    router.push(`/legal/${slug}`)
  }

  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>, slug: string) => {
    event.stopPropagation()
    window.open(`/legal/documents/${slug}.pdf`, '_blank')
  }
  return (
    <div className="mx-auto mt-8 font-mono">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm text-muted-foreground">
            <th className="pb-2 font-normal">date</th>
            <th className="pb-2 font-normal">document</th>
            <th className="pb-2 font-normal text-right">action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.slug}
              onClick={() => handleDocumentClick(doc.slug)}
              className="border-t border-border hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
            >
              <td className="py-3 pr-4 text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(doc.lastUpdated)}
              </td>
              <td className="py-3 pr-4">{doc.name}</td>
              <td className="py-3 text-right">
                <button
                  onClick={(e) => handleDownloadClick(e, doc.slug)}
                  className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
