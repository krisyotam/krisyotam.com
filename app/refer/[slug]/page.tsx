import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import referData from "@/data/refer/refer.json"
import { PostHeader } from "@/components/post-header"
import { ExternalLink } from "lucide-react"

interface ReferEntry {
  title: string
  slug: string
  url: string
  website?: string
  reward?: string
  description?: string
  category?: string
  tags?: string[]
  socials?: string[]
  importantUrls?: string[]
}

interface PageProps {
  params: { slug: string }
}

function getEntry(slug: string): ReferEntry | null {
  const e = (referData as any).find((x: any) => x.slug === slug)
  return e ? (e as ReferEntry) : null
}

export function generateMetadata({ params }: PageProps): Metadata {
  const entry = getEntry(params.slug)
  if (!entry) return { title: "Not Found | Refer" }
  return { title: `${entry.title} | Refer | Kris Yotam`, description: entry.description }
}

export default function ReferSlugPage({ params }: PageProps) {
  const entry = getEntry(params.slug)
  if (!entry) notFound()

  const domain = (() => {
    try {
      return new URL(entry.url).hostname.replace(/^www\./, '')
    } catch (e) {
      return entry.website || entry.url
    }
  })()

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <PostHeader
          title={entry.title}
          subtitle={domain}
          start_date={new Date().toISOString().split('T')[0]}
          end_date=""
          tags={entry.tags}
          category={entry.category}
          backText="Refer"
          backHref="/refer"
        />

        <div className="mt-8 border border-border bg-card p-6 rounded-sm shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">About this offer</h2>
              <p className="text-sm text-muted-foreground mt-2">{entry.description}</p>

              {entry.reward && (
                <div className="mt-4">
                  <h3 className="font-medium">Reward / Offer</h3>
                  <p className="text-sm text-muted-foreground">{entry.reward}</p>
                </div>
              )}

              {entry.importantUrls && entry.importantUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium">Important Links</h3>
                  <div className="mt-2 space-y-2">
                    {entry.importantUrls.map((u, i) => (
                      <Link key={i} href={u} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 border border-border rounded hover:bg-secondary/50">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm truncate">{u}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-background border border-border p-3 text-sm font-mono text-muted-foreground">
                <div className="mb-2">Referral Link</div>
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="block truncate text-primary underline">
                  {entry.url}
                </a>
                {entry.website && (
                  <div className="mt-3 text-xs text-muted-foreground">Site: {entry.website}</div>
                )}
              </div>
              {entry.socials && entry.socials.length > 0 && (
                <div className="mt-4 border border-border p-3 bg-card">
                  <h4 className="font-medium">Socials</h4>
                  <div className="mt-2 space-y-2">
                    {entry.socials.map((s, i) => (
                      <Link key={i} href={s} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground underline">
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
