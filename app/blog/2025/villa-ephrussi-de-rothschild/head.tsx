import feedData from '@/data/feed.json'

export default function Head() {
  const post = (feedData.posts || []).find((p: any) => p.slug === 'villa-ephrussi-de-rothschild')
  if (!post) return null
  const title = post.title
  const description = post.preview
  const coverUrl = post.cover_image || post.cover || `https://picsum.photos/1200/630?text=${encodeURIComponent(title)}`
  const url = `https://krisyotam.com/blog/2025/${post.slug}`
  return (
    <>
      <title>{`${title} | Kris Yotam`}</title>
      <meta name="description" content={description} />
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={coverUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={coverUrl} />
    </>
  )
} 