import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"

interface PageProps {
  params: { slug: string }
}

async function getOtherEntry(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/others/entry?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error("Error fetching other entry:", err)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const entry = await getOtherEntry(params.slug)
  if (!entry) {
    return { title: "Entry Not Found | Others" }
  }
  return {
    title: `${entry.title} | Others | Kris Yotam`,
    description: entry.description,
  }
}

export default async function OtherEntryPage({ params }: PageProps) {
  const entry = await getOtherEntry(params.slug)
  if (!entry) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav className="mb-8">
        <Link href="/others" className="text-sm text-primary hover:underline">
          ← Back to Others
        </Link>
      </nav>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{entry.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-md bg-muted/30">
              {entry.category}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground">{entry.description}</p>

        <div>
          <a 
            href={entry.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Visit Website
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </div>

        <div className="pt-4">
          <h2 className="text-lg font-medium mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-2.5 py-1 text-sm rounded-md bg-muted/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 