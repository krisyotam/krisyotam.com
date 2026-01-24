"use client"

import { useState, useEffect, ReactNode } from "react"
import Image from "next/image"

interface NowEntry {
  title: string
  preview: string
  date: string
  tags: string[]
  category: string
  slug: string
  cover_image?: string
  status: string
  confidence: string
  importance: number
  state: string
}

interface NowEntryWithContent {
  entry: NowEntry
  content: ReactNode
}

interface NowFeedProps {
  entries: NowEntryWithContent[]
}

interface NowItemProps {
  entry: NowEntry
  content: ReactNode
  formatDate: (dateStr: string) => string
  formatMonth: (dateStr: string) => string
  reactions: Record<string, number>
  userReactions: string[]
  onReaction: (slug: string, reactionType: string) => void
  isAuthenticated: boolean
}

const GITHUB_USERNAME = "krisyotam"
const GITHUB_AVATAR = `https://github.com/${GITHUB_USERNAME}.png`

const REACTIONS = [
  { type: "thumbsUp", emoji: "👍" },
  { type: "thumbsDown", emoji: "👎" },
  { type: "laugh", emoji: "😄" },
  { type: "hooray", emoji: "🎉" },
  { type: "confused", emoji: "😕" },
  { type: "heart", emoji: "❤️" },
  { type: "rocket", emoji: "🚀" },
  { type: "eyes", emoji: "👀" },
]

function NowItem({
  entry,
  content,
  formatDate,
  formatMonth,
  reactions,
  userReactions,
  onReaction,
  isAuthenticated
}: NowItemProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)

  const activeReactions = REACTIONS.filter(
    ({ type }) => (reactions[type] || 0) > 0
  )

  return (
    <article className="border border-border">
      {/* Header */}
      <div className="flex items-stretch border-b border-border">
        {/* Avatar */}
        <div className="flex items-center justify-center w-14 border-r border-border">
          <Image
            src={GITHUB_AVATAR}
            alt={GITHUB_USERNAME}
            width={40}
            height={40}
            className="flex-shrink-0 object-cover"
            unoptimized
          />
        </div>
        {/* Username */}
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 border-r border-border text-sm font-medium hover:bg-muted/30 transition-colors"
          title={`https://github.com/${GITHUB_USERNAME}`}
        >
          @{GITHUB_USERNAME}
        </a>
        {/* Month badge */}
        <div className="flex items-center justify-center px-2 border-r border-border">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {formatMonth(entry.date)}
          </span>
        </div>
        {/* Info */}
        <div className="flex-1 flex items-center px-3 py-2 gap-2 flex-wrap">
          <span className="text-muted-foreground text-sm">
            posted on {formatDate(entry.date)}
          </span>
        </div>
        {/* Reaction picker button */}
        <div className="relative border-l border-border">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors h-full flex items-center"
            title="Add reaction"
          >
            <span className="text-sm">+</span>
            <svg className="w-4 h-4 ml-1" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM5.5 5.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-5.3 5.5a.5.5 0 0 0-.4.8 4.5 4.5 0 0 0 6.4 0 .5.5 0 0 0-.4-.8z"/>
            </svg>
          </button>
          {/* Reaction picker dropdown */}
          {showReactionPicker && (
            <>
              {/* Invisible backdrop to capture outside clicks */}
              <div
                className="fixed inset-0 z-[5]"
                onClick={() => setShowReactionPicker(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-10 bg-popover border border-border shadow-lg">
                <div className="text-xs text-muted-foreground px-3 py-2 border-b border-border whitespace-nowrap">
                  {isAuthenticated ? "Pick your reaction" : "Sign in to react"}
                </div>
                {isAuthenticated && (
                  <div className="flex items-stretch">
                    {REACTIONS.map(({ type, emoji }, index) => (
                      <button
                        key={type}
                        onClick={() => {
                          onReaction(entry.slug, type)
                          setShowReactionPicker(false)
                        }}
                        className={`px-3 py-2 text-lg hover:bg-muted transition-colors ${
                          index < REACTIONS.length - 1 ? "border-r border-border" : ""
                        }`}
                        title={type}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 comment-content">
        <h3 className="font-medium text-lg mb-3 pb-2 border-b border-border">{entry.title}</h3>
        <div className="[&>*:first-child]:mt-0">{content}</div>
      </div>

      {/* Footer - Reactions */}
      <div className="flex items-stretch border-t border-border">
        {activeReactions.map(({ type, emoji }) => {
          const count = reactions[type] || 0
          const hasReacted = userReactions.includes(type)

          return (
            <button
              key={type}
              onClick={() => isAuthenticated && onReaction(entry.slug, type)}
              disabled={!isAuthenticated}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm transition-colors border-r border-border ${
                hasReacted
                  ? "bg-muted text-foreground"
                  : "hover:bg-muted/30"
              } ${!isAuthenticated ? "cursor-default" : ""}`}
            >
              <span>{emoji}</span>
              <span className="text-xs font-medium">{count}</span>
            </button>
          )
        })}
        {activeReactions.length === 0 && (
          <div className="flex-1 px-3 py-2 text-xs text-muted-foreground">
            No reactions yet
          </div>
        )}
      </div>
    </article>
  )
}

export function NowFeed({ entries }: NowFeedProps) {
  const [allReactions, setAllReactions] = useState<Record<string, Record<string, number>>>({})
  const [allUserReactions, setAllUserReactions] = useState<Record<string, string[]>>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data.user)
      })
      .catch(() => setIsAuthenticated(false))
  }, [])

  // Fetch reactions for all entries
  useEffect(() => {
    const fetchReactions = async () => {
      const reactions: Record<string, Record<string, number>> = {}
      const userReactions: Record<string, string[]> = {}

      await Promise.all(
        entries.map(async ({ entry }) => {
          try {
            const res = await fetch(`/api/interactions?resource=reactions&type=now&slug=${entry.slug}`)
            if (res.ok) {
              const data = await res.json()
              reactions[entry.slug] = data.reactions || {}
              userReactions[entry.slug] = data.userReactions || []
            }
          } catch {
            reactions[entry.slug] = {}
            userReactions[entry.slug] = []
          }
        })
      )

      setAllReactions(reactions)
      setAllUserReactions(userReactions)
    }

    if (entries.length > 0) {
      fetchReactions()
    }
  }, [entries])

  const handleReaction = async (slug: string, reactionType: string) => {
    if (!isAuthenticated) return

    try {
      const res = await fetch("/api/interactions?resource=reactions&type=now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, reactionType }),
      })

      if (res.ok) {
        const data = await res.json()

        setAllReactions((prev) => {
          const current = prev[slug] || {}
          const currentCount = current[reactionType] || 0
          return {
            ...prev,
            [slug]: {
              ...current,
              [reactionType]: data.action === "added" ? currentCount + 1 : Math.max(0, currentCount - 1),
            },
          }
        })

        setAllUserReactions((prev) => {
          const current = prev[slug] || []
          if (data.action === "added") {
            return { ...prev, [slug]: [...current, reactionType] }
          } else {
            return { ...prev, [slug]: current.filter((r) => r !== reactionType) }
          }
        })
      }
    } catch (error) {
      console.error("Failed to update reaction:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const year = date.getFullYear()
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    hours = hours ? hours : 12
    const hoursStr = String(hours).padStart(2, "0")
    return `${month}.${day}.${year} at ${hoursStr}:${minutes} ${ampm}`
  }

  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Sort entries by date, newest first
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.entry.date).getTime() - new Date(a.entry.date).getTime()
  })

  return (
    <div className="space-y-4">
      {sortedEntries.map(({ entry, content }) => (
        <NowItem
          key={entry.slug}
          entry={entry}
          content={content}
          formatDate={formatDate}
          formatMonth={formatMonth}
          reactions={allReactions[entry.slug] || {}}
          userReactions={allUserReactions[entry.slug] || []}
          onReaction={handleReaction}
          isAuthenticated={isAuthenticated}
        />
      ))}
      {sortedEntries.length === 0 && (
        <div className="text-muted-foreground text-sm text-center py-8">
          No Now entries found.
        </div>
      )}
    </div>
  )
}

export default NowFeed
