"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { FileText, Film, Database, BookOpen, Search, Tag, Video, Headphones, Wrench, Book, LayoutGrid, List, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import archiveJson from "@/data/archive/archive.json"

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

export default function ArchivesComponent() {
  const [query, setQuery] = useState("")
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  // default to the "doc" bucket so /archive behaves like /doc
  const [currentBucket, setCurrentBucket] = useState<string | null>('doc')
  const [currentPath, setCurrentPath] = useState<string>('')

  const buckets = useMemo(() => buildBucketsTree(archiveJson), [])

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
    setCurrentBucket(node.type === 'bucket' ? node.name : currentBucket)
    if (node.type === 'directory') {
      setCurrentPath(node.path)
    } else {
      setCurrentPath('')
    }
  }

  const openNode = (node: Node) => {
    // open files in a new tab, sanitize known duplicate /doc/doc/ prefix
    if (isFile(node) && node.meta?.public_url) {
      const sanitizePublicUrl = (url: string) => {
        if (!url) return url
        try {
          // If currentBucket is set, remove duplicated bucket segments like /doc/doc/
          if (currentBucket) {
            const dup = `/${currentBucket}/${currentBucket}/`
            if (url.includes(dup)) return url.replace(new RegExp(dup, 'g'), `/${currentBucket}/`)
          }
          // Fallback specific fix for /doc/doc/
          if (url.includes('/doc/doc/')) return url.replace(/\/doc\/doc\//g, '/doc/')
        } catch (e) {
          // noop
        }
        return url
      }

      const url = sanitizePublicUrl(node.meta.public_url)
      window.open(url, '_blank')
    } else if (node.type === 'directory') {
      enterFolder(node)
    }
  }

  const breadcrumbs = useMemo(() => {
    if (!currentBucket) return [] as string[]
    if (!currentPath) return [currentBucket]
    return [currentBucket, ...currentPath.split('/').filter(Boolean)]
  }, [currentBucket, currentPath])

  return (
    <main className="w-full py-2">
      <div className="mb-4 flex items-center gap-4">
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

      {/* Breadcrumbs */}
      <div className="text-sm text-muted-foreground mb-4 flex flex-wrap items-center gap-2">
        {breadcrumbs.map((b, i) => {
          const isFirst = i === 0
          // build path for this breadcrumb (skip bucket at index 0)
          const path = isFirst ? '' : breadcrumbs.slice(1, i + 1).join('/')
          return (
            <span key={i} className="flex items-center">
              {i > 0 && <span className="mx-1 text-muted-foreground">/</span>}
              <button
                className="text-sm text-foreground hover:underline"
                onClick={() => {
                  if (isFirst) {
                    setCurrentPath('')
                    setCurrentBucket(b)
                  } else {
                    setCurrentPath(path)
                  }
                }}
              >
                {b}
              </button>
            </span>
          )
        })}
      </div>

      {/* Content */}
      {(!currentBucket) ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {buckets.map(b => (
            <Card key={b.name} className="rounded-none border-border cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => { setCurrentBucket(b.name); setCurrentPath('') }}>
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

