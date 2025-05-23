import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import othersData from "@/data/others.json"
import { UrlControls, IframeWithUrlBar } from "./client-components"
import { PostHeader } from "@/components/post-header"

// Define the interface for Others data - using a type assertion to handle any fields in data
interface OtherEntry {
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  slug: string;
  publishDate?: string;
  status?: "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  confidence?: "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  importance?: number;
}

interface PageProps {
  params: { slug: string }
}

function getOtherEntry(slug: string): OtherEntry | null {
  // Find the entry directly from the imported data and cast to OtherEntry type
  const entry = othersData.find((entry: any) => entry.slug === slug)
  return entry ? entry as OtherEntry : null
}

export function generateMetadata({ params }: PageProps): Metadata {
  const entry = getOtherEntry(params.slug)
  if (!entry) {
    return { title: "Entry Not Found | Others" }
  }
  return {
    title: `${entry.title} | Others | Kris Yotam`,
    description: entry.description,
  }
}

export default function OtherEntryPage({ params }: PageProps) {
  const entry = getOtherEntry(params.slug)
  if (!entry) notFound()

  // Extract domain name for display
  const domainName = new URL(entry.url).hostname.replace(/^www\./, '')
  
  // Default values for if they don't exist in the JSON yet
  const publishDate = entry.publishDate || "2023-04-01";
  const status = (entry.status || "Finished") as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
  const confidence = (entry.confidence || "likely") as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
  const importance = entry.importance || 7;
  return (
    <div className="min-h-screen py-4 px-4 sm:px-6">      
      <div className="max-w-4xl mx-auto">
        {/* Post Header */}        <PostHeader
          title={entry.title}
          subtitle={domainName}
          date={publishDate}
          tags={entry.tags}
          category={entry.category}
          status={status as any}
          confidence={confidence as any}
          importance={importance}
          backText="Others"
          backHref="/others"
        />
        
        {/* Iframe with URL bar */}
        <div className="my-8">
          <IframeWithUrlBar url={entry.url} title={entry.title} height={550} />
        </div>
        
        {/* Site information below the iframe */}
        <div className="mt-8 border border-border p-4 bg-card">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Site info */}
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{entry.title}</h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                  {entry.category}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">{entry.description}</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {entry.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 text-xs font-medium bg-muted/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* URL and controls */}
            <div className="flex flex-col gap-2 md:items-end">
              <div className="flex items-center bg-background border border-border px-3 py-2 text-sm font-mono text-muted-foreground">
                <span className="truncate max-w-[200px] md:max-w-[300px]">{domainName}</span>
              </div>
              <UrlControls url={entry.url} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}