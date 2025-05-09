import { Metadata } from 'next'
import feedData from '@/data/feed.json'

interface Props {
  children: React.ReactNode
  params: { year: string; slug: string }
}

export async function generateMetadata(
  { params }: { params: { year: string; slug: string } }
): Promise<Metadata> {
  const { slug } = params
  
  // Find the post metadata from feed.json
  const meta = feedData.posts.find(p => p.slug === slug)

  if (!meta) {
    return {
      title: "Post Not Found | Kris Yotam",
      description: "The requested post could not be found."
    }
  }

  return {
    title: `${meta.title} | Kris Yotam`,
    description: meta.preview,
    openGraph: {
      title: meta.title,
      description: meta.preview,
      images: meta.cover_image ? [meta.cover_image] : undefined,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.preview,
      images: meta.cover_image ? [meta.cover_image] : undefined
    }
  }
}

export default function PostLayout({ children }: Props) {
  return <>{children}</>
}