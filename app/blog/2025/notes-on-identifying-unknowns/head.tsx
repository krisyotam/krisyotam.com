import type { Metadata } from 'next'
import feedData from '@/data/feed.json'

export async function generateMetadata(): Promise<Metadata> {
  const post = (feedData.posts || []).find((p: any) => p.slug === 'notes-on-identifying-unknowns')
  if (!post) return {}
  const title = post.title
  const description = post.preview
  const coverUrl = post.cover_image || `https://picsum.photos/1200/630?text=${encodeURIComponent(title)}`
  const url = `https://krisyotam.com/blog/2025/${post.slug}`
  return {
    title: `${title} | Kris Yotam`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Kris Yotam',
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverUrl],
      creator: '@krisyotam',
    },
    alternates: {
      canonical: url,
    },
  }
}
// No default Head component; metadata is generated above 