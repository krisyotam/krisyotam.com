import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SITE_URL = process.env.BASE_URL || 'https://krisyotam.com'

function escapeXML(str: string) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toDate(post: any) {
  const raw = (post.end_date && post.end_date.trim()) ? post.end_date : (post.start_date || post.date || '')
  const d = raw ? new Date(raw) : new Date()
  if (isNaN(d.getTime())) return new Date()
  return d
}

export async function GET() {
  try {
    const papersPath = path.join(process.cwd(), 'data/papers/papers.json')
    const blogPath = path.join(process.cwd(), 'data/blog/blog.json')
    const essaysPath = path.join(process.cwd(), 'data/essays/essays.json')

    const [papersFile, blogFile, essaysFile] = await Promise.all([
      fs.readFile(papersPath, 'utf-8').catch(() => '{}'),
      fs.readFile(blogPath, 'utf-8').catch(() => '[]'),
      fs.readFile(essaysPath, 'utf-8').catch(() => '{}')
    ])

    const papersData = JSON.parse(papersFile)
    const papers = papersData.papers || []
    const blogPosts = JSON.parse(blogFile) || []
    const essaysData = JSON.parse(essaysFile)
    const essays = essaysData.essays || []

    const allPosts = [
      ...papers.map((post: any) => ({ ...post, path: 'papers' })),
      ...blogPosts.map((post: any) => ({ ...post, path: 'blog' })),
      ...essays.map((post: any) => ({ ...post, path: 'essays' })),
    ]

    const active = allPosts.filter((p: any) => (p.state || '').toLowerCase() === 'active')

    active.sort((a: any, b: any) => toDate(b).getTime() - toDate(a).getTime())

    const items = active.map((post: any) => {
      const date = toDate(post)
      const slug = post.slug || ''
      const title = escapeXML(post.title || '')
      const description = post.preview || post.subtitle || ''

      let postUrl = `${SITE_URL}/${post.path}/${slug}`

      // For blog, optionally include category slug for nicer URLs
      if (post.path === 'blog') {
        const categorySlug = (post.category || '').toLowerCase().replace(/\s+/g, '-')
        postUrl = `${SITE_URL}/blog/${categorySlug}/${slug}`
      }

      return `
        <item>
          <title>${title}</title>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}</guid>
          <pubDate>${date.toUTCString()}</pubDate>
          <description><![CDATA[${description}]]></description>
        </item>
      `.trim()
    }).join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Kris Yotam</title>\n    <link>${SITE_URL}</link>\n    <description>New essays and posts from Kris Yotam.</description>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${items}\n  </channel>\n</rss>`

    return new NextResponse(rss, {
      status: 200,
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    })
  } catch (err) {
    console.error('RSS generation error', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
