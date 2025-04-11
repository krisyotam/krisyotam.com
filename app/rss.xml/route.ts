import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data/feed.json')
    const file = await fs.readFile(filePath, 'utf-8')
    const { posts } = JSON.parse(file)

    const siteUrl = 'https://krisyotam.com'
    const activePosts = posts.filter((post: any) => post.state === 'active')

    const escapeXML = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

    const items = activePosts.map((post: any) => {
      const safeDate = post.date ? new Date(post.date) : new Date()
      const year = safeDate.getFullYear()
      const slug = post.slug || ''
      const title = escapeXML(post.title || '')
      const description = escapeXML(post.preview || post.subtitle || '')

      const postUrl = `${siteUrl}/blog/${year}/${slug}`

      return `
        <item>
          <title>${title}</title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <pubDate>${safeDate.toUTCString()}</pubDate>
          <description><![CDATA[${description}]]></description>
        </item>
      `.trim()
    }).join('\n')

    const rss = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Kris Yotam</title>
          <link>${siteUrl}</link>
          <description>New essays and case files from Kris Yotam.</description>
          ${items}
        </channel>
      </rss>
    `.trim()

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
      },
    })
  } catch (error) {
    console.error('RSS feed generation failed:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
