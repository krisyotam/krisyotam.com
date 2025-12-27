"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Film, Database, BookOpen, Search, Tag, Video, Headphones, Wrench, Book, LayoutGrid, List, Folder, ArrowLeft, Copy as CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import archiveJson from "@/data/doc/archive.json"

type RawObject = {
  bucket: string
  key: string
  size: number
  last_modified: string
  original_url?: string
  public_url?: string
}

type NodeType = string

type Node = {
  id: string
  name: string
  path: string // relative path inside bucket
  type: NodeType
  children?: Node[]
  meta?: RawObject
}

function isFile(node: Node) {
  return node.type !== 'directory' && node.type !== 'bucket'
}

function formatSize(bytes: number) {
  if (!bytes || bytes === 0) return "—"
  const units = ["B", "KB", "MB", "GB", "TB"]
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(n >= 10 ? 0 : 1)} ${units[i]}`
}

function getIconForName(name: string, isFolder = false) {
  if (isFolder) return <Folder className="h-5 w-5" />
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return <FileText className="h-5 w-5" />
  if (['mp4', 'mkv', 'webm'].includes(ext)) return <Video className="h-5 w-5" />
  if (['mp3', 'm4a', 'flac'].includes(ext)) return <Headphones className="h-5 w-5" />
  if (['zip', 'tar', 'gz'].includes(ext)) return <Database className="h-5 w-5" />
  return <FileText className="h-5 w-5" />
}

// Build a tree of nodes per bucket from the JSON listing
function buildBucketsTree(data: any): Node[] {
  const buckets: Node[] = []
  if (!data?.buckets) return buckets

  for (const b of data.buckets) {
    const bucketNode: Node = { id: b.name, name: b.name, path: '', type: 'bucket', children: [] }
    const map = new Map<string, Node>()
    map.set('', bucketNode)

    for (const obj of b.objects as RawObject[]) {
      const key = obj.key
      const parts = key.split('/').filter(Boolean)
      if (parts.length === 0) continue

      for (let i = 0; i < parts.length; i++) {
        const subpath = parts.slice(0, i + 1).join('/')
        const parentPath = parts.slice(0, i).join('/')
        const isLast = i === parts.length - 1
  const isDirectory = key.endsWith('/') || !isLast ? true : false

        if (!map.has(subpath)) {
          const node: Node = {
            id: `${b.name}/${subpath}`,
            name: parts[i],
            path: subpath,
            type: isDirectory ? 'directory' : (obj?.key.split('.').pop() ?? 'file').toLowerCase(),
            children: isDirectory ? [] : undefined,
            meta: isDirectory ? undefined : obj,
          }
          map.set(subpath, node)
          const parent = map.get(parentPath)!
          parent.children = parent.children || []
          parent.children.push(node)
        } else if (!isDirectory) {
          // existing node but mark as file and attach meta; set type to extension
          const existing = map.get(subpath)!
          existing.type = (obj?.key.split('.').pop() ?? 'file').toLowerCase()
          existing.meta = obj
        }
      }
    }

    // assign children sorted
    const addChildren = (node: Node) => {
      if (!node.children) return
      node.children.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name)
        return a.type === 'directory' ? -1 : 1
      })
      node.children.forEach(addChildren)
    }
    addChildren(bucketNode)
    buckets.push(bucketNode)
  }

  return buckets
}

export default function ArchivesComponent({ defaultBucket, data }: { defaultBucket?: string; data?: any } = {}) {
  const [query, setQuery] = useState("")
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  // allow caller to set default bucket (pages like /src, /doc, /archive pass this)
  const [currentBucket, setCurrentBucket] = useState<string | null>(defaultBucket ?? 'doc')
  const [currentPath, setCurrentPath] = useState<string>('')

  // mapping between bucket names and site path segments
  const bucketToSegment: Record<string, string> = {
    doc: 'doc',
    src: 'src',
    'public-archive': 'archive',
    public_archive: 'archive',
  }
  const segmentToBucket: Record<string, string> = Object.fromEntries(Object.entries(bucketToSegment).map(([k, v]) => [v, k]))

  const buckets = useMemo(() => buildBucketsTree(data ?? archiveJson), [data])

  // find current node
  const currentNode = useMemo(() => {
    if (!currentBucket) return null
    const bucket = buckets.find(b => b.name === currentBucket)
    if (!bucket) return null
    if (!currentPath) return bucket
    const parts = currentPath.split('/').filter(Boolean)
    let node: Node | undefined = bucket
    for (const p of parts) {
      node = node.children?.find(c => c.name === p)
      if (!node) break
    }
    return node ?? null
  }, [buckets, currentBucket, currentPath])

  // items to display: if not in bucket show buckets, else show children of currentNode filtered by query
  const itemsToShow = useMemo(() => {
    if (!currentBucket) return buckets
    const children = currentNode?.children ?? []
    if (!query) return children
    const q = query.toLowerCase()
    // filter children and directories whose subtree contains match
    const results: Node[] = []
    const walk = (n: Node) => {
      if (n.name.toLowerCase().includes(q) && n !== currentNode) results.push(n)
      if (n.children) n.children.forEach(walk)
    }
    children.forEach(c => {
      if (c.name.toLowerCase().includes(q)) results.push(c)
      else if (c.type === 'directory') walk(c)
    })
    return results
  }, [buckets, currentBucket, currentNode, query])

  const enterFolder = (node: Node) => {
    if (node.type !== 'directory' && node.type !== 'bucket') return
    const newBucket = node.type === 'bucket' ? node.name : (currentBucket ?? 'doc')
    const newPath = node.type === 'directory' ? node.path : ''
    setCurrentBucket(newBucket)
    setCurrentPath(newPath)
  }

  const openNode = (node: Node) => {
    // open files in a new tab, sanitize known duplicate /doc/doc/ prefix
    if (isFile(node) && node.meta?.public_url) {
      // Build a deterministic public URL from the bucket and key so files
      // always open under the correct site root. This avoids cases where
      // generated `public_url` values accidentally point to the wrong root
      // (e.g. a /doc URL showing up while browsing /src).
      // Use the current origin in dev (localhost) so links open on the same host.
      // On the server (SSR) `window` is undefined; fall back to the canonical host.
      const baseOrigin = (typeof window !== 'undefined') ? window.location.origin : 'https://krisyotam.com'
      const rootMap: Record<string, string> = {
        doc: `${baseOrigin}/doc`,
        src: `${baseOrigin}/src`,
        'public-archive': `${baseOrigin}/archive`,
        public_archive: `${baseOrigin}/archive`,
      }

      const bucket = node.meta?.bucket ?? currentBucket ?? 'doc'
      const key = node.meta?.key ?? node.path
      if (key) {
        const root = rootMap[bucket] ?? rootMap[currentBucket ?? 'doc'] ?? `${baseOrigin}/doc`
        const cleanedRoot = root.replace(/\/$/, '')
        const cleanedKey = key.replace(/^\/+/, '')
        const url = `${cleanedRoot}/${cleanedKey}`
        window.open(url, '_blank')
      } else {
        // Fallback to the generated public_url if no key is available
        // If running locally, prefer to rewrite https://krisyotam.com -> baseOrigin
        let fallback = node.meta.public_url
        try {
          if (fallback && typeof window !== 'undefined') {
            // replace canonical host with local origin when appropriate
            fallback = fallback.replace(/^https?:\/\/krisyotam\.com/, baseOrigin)
          }
        } catch (e) {
          // noop
        }
        window.open(fallback, '_blank')
      }
    } else if (node.type === 'directory') {
      enterFolder(node)
    }
  }

  const breadcrumbs = useMemo(() => {
    if (!currentBucket) return [] as string[]
    if (!currentPath) return [currentBucket]
    return [currentBucket, ...currentPath.split('/').filter(Boolean)]
  }, [currentBucket, currentPath])

  // address bar state for copy feedback
  const [copied, setCopied] = useState(false)

  const getDisplayUrl = () => {
    const origin = (typeof window !== 'undefined') ? window.location.origin : 'https://krisyotam.com'
    const seg = currentBucket ? (bucketToSegment[currentBucket] ?? currentBucket) : ''
    const cleanedPath = currentPath ? `/${currentPath.replace(/^\/+/, '')}` : ''
    return seg ? `${origin}/${seg}${cleanedPath}` : origin
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getDisplayUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      // ignore copy errors
    }
  }

  const handleBack = () => {
    // perform internal navigation: go up one path segment or exit bucket
    if (currentPath) {
      const parts = currentPath.split('/').filter(Boolean)
      if (parts.length <= 1) {
        setCurrentPath('')
      } else {
        setCurrentPath(parts.slice(0, -1).join('/'))
      }
    } else if (currentBucket) {
      setCurrentBucket(null)
    }
  }

  // sync state from current pathname on mount so direct links work
  useEffect(() => {
    if (typeof window === 'undefined') return
    const parts = window.location.pathname.split('/').filter(Boolean)
    if (parts.length === 0) return
    const seg = parts[0]
    const mapped = segmentToBucket[seg]
    if (mapped) {
      setCurrentBucket(mapped)
      setCurrentPath(parts.slice(1).join('/'))
    }
  }, [])

  return (
    <main className="w-full py-2">
      {/* Address bar (matches search row width) */}
      <div className="mb-3 flex items-center gap-4">
        <div className="flex-1 relative">
          <Input
            readOnly
            value={getDisplayUrl()}
            onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
            className="w-full rounded-none font-mono text-sm"
            aria-label="Current location"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack} className="rounded-none" aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleCopy} className="rounded-none" aria-label="Copy URL">
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input placeholder="Search files and folders..." className="w-full pl-10 rounded-none" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className={cn('rounded-none', viewMode === 'list' ? 'bg-secondary/50' : '')} onClick={() => setViewMode('list')} aria-label="List view"><List className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className={cn('rounded-none', viewMode === 'grid' ? 'bg-secondary/50' : '')} onClick={() => setViewMode('grid')} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* (breadcrumb removed) */}

      {/* Content */}
      {(!currentBucket) ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {buckets.map(b => (
            <Card key={b.name} className="rounded-none border-border cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => enterFolder(b)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Folder className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.children?.length ?? 0} items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // inside bucket
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {itemsToShow.map(item => (
              <Card key={item.id} className="rounded-none border-border hover:bg-secondary/50 transition-colors">
                <CardContent className="p-4 cursor-pointer" onClick={() => openNode(item)}>
                  <div className="flex items-center gap-3">
                    {getIconForName(item.name, item.type === 'directory')}
                    <div>
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{isFile(item) ? formatSize(item.meta?.size ?? 0) : `${item.children?.length ?? 0} items`}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                  {isFile(item) ? (
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{formatSize(item.meta?.size ?? 0)}</span>
                      <span>{item.meta?.last_modified ? new Date(item.meta.last_modified).toLocaleString('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">{`${item.children?.length ?? 0} items`}</div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-foreground">
                  <th className="py-2 text-left font-medium px-3">Name</th>
                  <th className="py-2 text-left font-medium px-3">Type</th>
                  <th className="py-2 text-left font-medium px-3">Size</th>
                  <th className="py-2 text-left font-medium px-3">Modified</th>
                  
                </tr>
              </thead>
              <tbody>
        {itemsToShow.map((item) => (
          <tr key={item.id} className="border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => openNode(item)}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {getIconForName(item.name, item.type === 'directory')}
                          <div className="font-medium">{item.name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3">{item.type}</td>
                      <td className="py-3 px-3">{isFile(item) ? formatSize(item.meta?.size ?? 0) : `${item.children?.length ?? 0} items`}</td>
                      <td className="py-3 px-3">{item.meta?.last_modified ? new Date(item.meta.last_modified).toLocaleString('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}</td>
                    
                    </tr>
                ))}
                {itemsToShow.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">No items found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      )}
    </main>
  )
}

