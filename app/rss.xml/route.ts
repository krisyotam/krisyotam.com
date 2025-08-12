import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read data from all three sources
    const papersPath = path.join(process.cwd(), 'data/papers/papers.json')
    const blogPath = path.join(process.cwd(), 'data/blog/blog.json')
    const essaysPath = path.join(process.cwd(), 'data/essays/essays.json')

    const [papersFile, blogFile, essaysFile] = await Promise.all([
      fs.readFile(papersPath, 'utf-8'),
      fs.readFile(blogPath, 'utf-8'),
      fs.readFile(essaysPath, 'utf-8')
    ])

    const { papers } = JSON.parse(papersFile)
    const blogPosts = JSON.parse(blogFile) // blog feed.json is an array
    const { essays } = JSON.parse(essaysFile)    // Combine all posts and add path information
    const allPosts = [
      ...papers.map((post: any) => ({ ...post, path: 'papers' })),
      ...blogPosts.map((post: any) => ({ ...post, path: 'blog' })),
      ...essays.map((post: any) => ({ ...post, path: 'essays' }))
    ]

    const siteUrl = 'https://krisyotam.com'
    const activePosts = allPosts.filter((post: any) => post.state === 'active')

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
      
      // Use correct URL structure based on post path
      let postUrl: string
      if (post.path === 'papers') {
        postUrl = `${siteUrl}/papers/${post.category}/${slug}`
      } else if (post.path === 'essays') {
        postUrl = `${siteUrl}/essays/${post.category}/${slug}`
      } else {
        // For blog posts, use category-based routing
        const categorySlug = (post.category || '').toLowerCase().replace(/\s+/g, '-')
        postUrl = `${siteUrl}/blog/${categorySlug}/${slug}`
      }

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
