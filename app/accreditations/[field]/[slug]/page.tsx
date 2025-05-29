import { notFound } from "next/navigation"
import { PostHeader } from "@/components/post-header"
import { Citation } from "@/components/citation"
import { Card } from "@/components/ui/card"
import accreditationsData from "@/data/accreditations.json"

interface Accreditation {
  id: string
  slug: string
  title: string
  organization: string
  field: string
  type: string
  date: string
  expiryDate?: string
  status: string
  description: string
  link?: string
  credentialId?: string
  logo?: string
  certificateImage?: string
  displayName?: string
}

interface PageParams {
  params: {
    field: string
    slug: string
  }
}

export async function generateStaticParams() {
  const accreditations = accreditationsData as Accreditation[]
  
  return accreditations.map(acc => ({
    field: acc.field,
    slug: acc.slug
  }))
}

export async function generateMetadata({ params }: PageParams) {
  const accreditations = accreditationsData as Accreditation[]
  const accreditation = accreditations.find(
    acc => acc.field === params.field && acc.slug === params.slug
  )

  if (!accreditation) {
    return {
      title: "Accreditation Not Found | Kris Yotam"
    }
  }

  return {
    title: `${accreditation.title} | Kris Yotam`,
    description: accreditation.description
  }
}

export default function AccreditationDetailPage({ params }: PageParams) {
  const accreditations = accreditationsData as Accreditation[]
  const accreditation = accreditations.find(
    acc => acc.field === params.field && acc.slug === params.slug
  )

  if (!accreditation) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PostHeader
        title={accreditation.title}
        date={accreditation.date}
        preview={accreditation.description}
        status="Finished"
        confidence="certain"
        importance={8}
        backText="Accreditations"
        backHref="/accreditations"
      />
      
      {/* Certificate Display with Site Design */}
      <div className="mt-8 mb-8">
        <Card className="bg-muted/50 dark:bg-[hsl(var(--popover))] border-border rounded-none overflow-hidden">
          {/* Certificate image */}
          <div className="relative aspect-[4/3] bg-white dark:bg-gray-900 rounded-none overflow-hidden">
            {accreditation.certificateImage ? (
              <iframe
                src={accreditation.certificateImage}
                title={`${accreditation.title} Certificate`}
                className="w-full h-full border-0 rounded-none"
                style={{
                  minHeight: '400px',
                  backgroundColor: 'white'
                }}
                loading="lazy"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/20">
                <div className="text-center p-6">
                  <div className="text-6xl mb-4">📜</div>
                  <div className="font-medium">Certificate Image</div>
                  <div className="text-sm mt-1">Not Available</div>
                </div>
              </div>
            )}
          </div>
            {/* Certificate Info Footer */}
          <div className="p-4 bg-muted/30 dark:bg-muted/20 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <div className="font-medium text-foreground">
                Kris Yotam
              </div>
              <div className="font-medium text-foreground">
                {accreditation.displayName || accreditation.title}
              </div>
            </div>
          </div>
        </Card>
      </div>      {/* Accreditation Details */}
      <Card className="bg-muted/50 dark:bg-[hsl(var(--popover))] border-border rounded-none p-6">
        <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Organization</div>
            <div className="font-medium">{accreditation.organization}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground mb-1">Type</div>
            <div className="font-medium">{accreditation.type}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground mb-1">Date Achieved</div>
            <div className="font-medium">{formatDate(accreditation.date)}</div>
          </div>
          
          {accreditation.expiryDate && (
            <div>
              <div className="text-muted-foreground mb-1">Expiry Date</div>
              <div className="font-medium">{formatDate(accreditation.expiryDate)}</div>
            </div>
          )}
            <div>
            <div className="text-muted-foreground mb-1">Status</div>
            <div className="font-medium">
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted/50 text-foreground border border-border">
                {accreditation.status}
              </span>
            </div>
          </div>
          
          {accreditation.credentialId && (
            <div>
              <div className="text-muted-foreground mb-1">Credential ID</div>
              <div className="font-medium font-mono text-xs">{accreditation.credentialId}</div>
            </div>
          )}
        </div>

        <div>
          <div className="text-muted-foreground mb-2">Description</div>
          <div className="text-sm leading-relaxed">{accreditation.description}</div>
        </div>        {accreditation.link && (
          <div>            <a
              href={accreditation.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors"
            >
              <span>Visit Organization</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>            </a>
          </div>
        )}
        </div>
      </Card>      {/* Citation Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <Citation
          title={accreditation.title}
          slug={accreditation.slug}
          date={accreditation.date}
          url={`https://krisyotam.com/accreditations/${accreditation.field}/${accreditation.slug}`}
        />
      </div>
    </main>
  )
}