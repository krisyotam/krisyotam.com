#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

const BASE_URL = process.env.BASE_URL || 'https://krisyotam.com'

async function readJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function formatDate(dateStr) {
  // Expecting YYYY-MM-DD; fallback to Date parser
  if (!dateStr) return new Date().toUTCString()
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return new Date().toUTCString()
  return d.toUTCString()
}

function escapeXml(str) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildItem(item, section) {
  const title = escapeXml(item.title || '')
  const description = escapeXml(item.preview || '')
  const slug = item.slug || ''
  const url = `${BASE_URL}/${section}/${slug}`
  const pubDate = formatDate(item.end_date && item.end_date.trim() ? item.end_date : item.start_date)
  return `  <item>\n    <title>${title}</title>\n    <link>${url}</link>\n    <guid isPermaLink="true">${url}</guid>\n    <pubDate>${pubDate}</pubDate>\n    <description>${description}</description>\n  </item>`
}

async function generate() {
  const repoRoot = process.cwd()
  const dataDir = path.join(repoRoot, 'data')

  const blog = await readJson(path.join(dataDir, 'blog', 'blog.json')) || []
  const essaysFile = await readJson(path.join(dataDir, 'essays', 'essays.json')) || {}
  const essays = essaysFile.essays || []
  const papersFile = await readJson(path.join(dataDir, 'papers', 'papers.json')) || {}
  const papers = papersFile.papers || []

  const combined = []

  blog.forEach(b => combined.push({ ...b, __section: 'blog' }))
  essays.forEach(e => combined.push({ ...e, __section: 'essays' }))
  papers.forEach(p => combined.push({ ...p, __section: 'papers' }))

  // Filter by state === 'active'
  const active = combined.filter((p) => (p.state || '').toLowerCase() === 'active')

  // Sort by date descending (use end_date if present)
  active.sort((a, b) => {
    const da = (a.end_date && a.end_date.trim()) ? a.end_date : a.start_date || ''
    const db = (b.end_date && b.end_date.trim()) ? b.end_date : b.start_date || ''
    return db.localeCompare(da)
  })

  const itemsXml = active.map((it) => buildItem(it, it.__section)).join('\n')

  const now = new Date().toUTCString()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>Kris Yotam — Updates</title>\n  <link>${BASE_URL}/</link>\n  <description>Latest active posts from blog, essays, and papers</description>\n  <lastBuildDate>${now}</lastBuildDate>\n${itemsXml}\n</channel>\n</rss>`

  // Ensure public dir exists
  const publicDir = path.join(repoRoot, 'public')
  try { await fs.mkdir(publicDir, { recursive: true }) } catch (e) {}

  const outPath = path.join(publicDir, 'rss.xml')
  await fs.writeFile(outPath, xml, 'utf-8')
  console.log('Wrote', outPath)
}

generate().catch((e) => {
  console.error('Failed to generate RSS:', e)
  process.exit(1)
})
