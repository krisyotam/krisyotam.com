"use client"

import { useState } from "react"

interface SitemapItem {
  path: string
  title: string
  children?: SitemapItem[]
}

const siteStructure: SitemapItem[] = [
  {
    path: "/",
    title: "krisyotam.com",
    children: [
      {
        path: "#content",
        title: "Content",
        children: [
          { path: "/blog", title: "blog" },
          { path: "/essays", title: "essays" },
          { path: "/notes", title: "notes" },
          { path: "/papers", title: "papers" },
          { path: "/fiction", title: "fiction" },
          { path: "/verse", title: "verse" },
          { path: "/reviews", title: "reviews" },
          { path: "/news", title: "news" },
          { path: "/til", title: "til" },
          { path: "/now", title: "now" },
          { path: "/sequences", title: "sequences" },
          { path: "/newsletter", title: "newsletter" },
          { path: "/progymnasmata", title: "progymnasmata" },
          { path: "/ocs", title: "ocs" },
        ]
      },
      {
        path: "#media",
        title: "Media",
        children: [
          { path: "/anime", title: "anime" },
          { path: "/manga", title: "manga" },
          { path: "/film", title: "film" },
          { path: "/games", title: "games" },
          { path: "/music", title: "music" },
          { path: "/playlists", title: "playlists" },
          { path: "/library", title: "library" },
          { path: "/art", title: "art" },
          { path: "/gallery", title: "gallery" },
          { path: "/videos", title: "videos" },
          { path: "/prompts", title: "prompts" },
        ]
      },
      {
        path: "#info",
        title: "Info",
        children: [
          { path: "/profile", title: "profile" },
          { path: "/cv", title: "cv" },
          { path: "/resume", title: "resume" },
          { path: "/portfolio", title: "portfolio" },
          { path: "/colophon", title: "colophon" },
          { path: "/contact", title: "contact" },
          { path: "/legal", title: "legal" },
          { path: "/social", title: "social" },
        ]
      },
      {
        path: "#misc",
        title: "Misc",
        children: [
          { path: "/blogroll", title: "blogroll" },
          { path: "/quotes", title: "quotes" },
          { path: "/predictions", title: "predictions" },
          { path: "/questions", title: "questions" },
          { path: "/research", title: "research" },
          { path: "/sources", title: "sources" },
          { path: "/stats", title: "stats" },
          { path: "/supporters", title: "supporters" },
          { path: "/surveys", title: "surveys" },
          { path: "/symbols", title: "symbols" },
          { path: "/people", title: "people" },
          { path: "/refer", title: "refer" },
          { path: "/weeks", title: "weeks" },
          { path: "/type", title: "type" },
        ]
      },
      {
        path: "#explore",
        title: "Explore",
        children: [
          { path: "/grid", title: "grid" },
          { path: "/archive", title: "archive" },
          { path: "/directory", title: "directory" },
          { path: "/categories", title: "categories" },
          { path: "/tags", title: "tags" },
          { path: "/globe", title: "globe" },
        ]
      },
    ]
  }
]

function generateTreeOutput(items: SitemapItem[], prefix = "", isLast = true, isRoot = true): string {
  let output = ""

  items.forEach((item, index) => {
    const isLastItem = index === items.length - 1
    const connector = isRoot ? "" : (isLastItem ? "└── " : "├── ")
    const newPrefix = isRoot ? "" : prefix + (isLastItem ? "    " : "│   ")

    if (isRoot) {
      output += item.title + "\n"
    } else {
      output += prefix + connector + item.title + "\n"
    }

    if (item.children && item.children.length > 0) {
      output += generateTreeOutput(item.children, newPrefix, isLastItem, false)
    }
  })

  return output
}

function countPages(items: SitemapItem[]): number {
  let count = 0
  items.forEach(item => {
    if (!item.path.startsWith("#")) {
      count++
    }
    if (item.children) {
      count += countPages(item.children)
    }
  })
  return count
}

export function Sitemap() {
  const [copied, setCopied] = useState(false)
  const treeOutput = generateTreeOutput(siteStructure)
  const pageCount = countPages(siteStructure)
  const directoryCount = siteStructure[0].children?.length || 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(treeOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="sitemap-terminal">
      <div className="terminal-header">
        <div className="terminal-title">
          <span className="terminal-prompt">$</span> tree krisyotam.com
        </div>
        <button
          onClick={handleCopy}
          className="terminal-copy-btn"
          title="Copy to clipboard"
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>
      <pre className="terminal-output">
        <code>{treeOutput}</code>
        <span className="terminal-stats">{"\n"}{directoryCount} directories, {pageCount} pages</span>
      </pre>
      <style jsx>{`
        .sitemap-terminal {
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
          font-family: var(--font-mono), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
        }
        .terminal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: var(--muted);
          border-bottom: 1px solid var(--border);
        }
        .terminal-title {
          font-size: 13px;
          color: var(--muted-foreground);
        }
        .terminal-prompt {
          color: var(--foreground);
          margin-right: 6px;
        }
        .terminal-copy-btn {
          font-size: 12px;
          padding: 2px 8px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 3px;
          color: var(--muted-foreground);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s ease;
        }
        .terminal-copy-btn:hover {
          background: var(--accent);
          color: var(--accent-foreground);
        }
        .terminal-output {
          margin: 0;
          padding: 16px;
          background: var(--background);
          font-size: 13px;
          line-height: 1.5;
          overflow-x: auto;
          white-space: pre;
        }
        .terminal-output code {
          color: var(--foreground);
        }
        .terminal-stats {
          color: var(--muted-foreground);
        }
      `}</style>
    </div>
  )
}
