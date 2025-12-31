"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark, prism } from "react-syntax-highlighter/dist/cjs/styles/prism"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

interface User {
  id: string
  username: string
  avatar_url: string
}

interface Comment {
  id: string
  page_slug: string
  content: string
  user_id: string
  username: string
  avatar_url: string | null
  created_at: string
  reactions: Record<string, number>
  userReactions: string[]
}

interface Pagination {
  page: number
  totalPages: number
  totalComments: number
  hasMore: boolean
}

interface CommentsProps {
  pageSlug?: string
}

const REACTIONS = [
  { type: "thumbsUp", emoji: "\uD83D\uDC4D" },
  { type: "thumbsDown", emoji: "\uD83D\uDC4E" },
  { type: "party", emoji: "\uD83C\uDF89" },
  { type: "heart", emoji: "\u2764\uFE0F" },
  { type: "rocket", emoji: "\uD83D\uDE80" },
  { type: "eyes", emoji: "\uD83D\uDC40" },
]

export function Comments({ pageSlug }: CommentsProps) {
  const pathname = usePathname()
  const slug = pageSlug || pathname
  const { resolvedTheme } = useTheme()

  const [user, setUser] = useState<User | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch current user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  // Fetch comments
  const fetchComments = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments?pageSlug=${encodeURIComponent(slug)}&page=${page}`)
      const data = await res.json()
      if (page === 1) {
        setComments(data.comments)
      } else {
        setComments((prev) => [...prev, ...data.comments])
      }
      setPagination(data.pagination)
    } catch {
      setError("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchComments(1)
  }, [fetchComments])

  // Handle login
  const handleLogin = () => {
    const returnUrl = window.location.pathname
    window.location.href = `/api/auth/github?returnUrl=${encodeURIComponent(returnUrl)}`
  }

  // Handle logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  // Submit comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug: slug, content }),
      })

      if (!res.ok) {
        throw new Error("Failed to post comment")
      }

      const data = await res.json()
      setComments((prev) => [data.comment, ...prev])
      setContent("")
    } catch {
      setError("Failed to post comment")
    } finally {
      setSubmitting(false)
    }
  }

  // Delete comment (soft delete)
  const handleDeleteRequest = (commentId: string) => {
    setDeleteConfirm(commentId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return

    try {
      const res = await fetch(`/api/comments?id=${deleteConfirm}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to delete comment")
        return
      }

      // Remove from local state
      setComments((prev) => prev.filter((c) => c.id !== deleteConfirm))
    } catch {
      setError("Failed to delete comment")
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Toggle reaction
  const handleReaction = async (commentId: string, reactionType: string) => {
    if (!user) {
      handleLogin()
      return
    }

    try {
      const res = await fetch("/api/comments/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, reactionType }),
      })

      if (!res.ok) throw new Error()

      const data = await res.json()

      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id !== commentId) return comment

          const newReactions = { ...comment.reactions }
          const newUserReactions = [...comment.userReactions]

          if (data.action === "added") {
            newReactions[reactionType] = (newReactions[reactionType] || 0) + 1
            newUserReactions.push(reactionType)
          } else {
            newReactions[reactionType] = Math.max(0, (newReactions[reactionType] || 0) - 1)
            const idx = newUserReactions.indexOf(reactionType)
            if (idx > -1) newUserReactions.splice(idx, 1)
          }

          return { ...comment, reactions: newReactions, userReactions: newUserReactions }
        })
      )
    } catch {
      // Silently fail
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <section className="mt-8 pt-6 border-t border-border">
      {/* Comment Input Box (at top) */}
      <div className="mb-4">
        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="border border-border">
              {/* Header with avatar and tabs */}
              <div className="flex items-stretch border-b border-border">
                {/* Avatar */}
                <div className="flex items-center justify-center w-14 border-r border-border">
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-10 h-10 flex-shrink-0 object-cover"
                  />
                </div>
                {/* Write Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-r border-border ${
                    activeTab === "write"
                      ? "text-foreground bg-muted/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  Write
                </button>
                {/* Preview Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-r border-border ${
                    activeTab === "preview"
                      ? "text-foreground bg-muted/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  Preview
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border-l border-border"
                >
                  Sign out @{user.username}
                </button>
              </div>

                {/* Write / Preview Content */}
                {activeTab === "write" ? (
                  <textarea
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value)
                      // Auto-expand textarea
                      e.target.style.height = "auto"
                      e.target.style.height = `${Math.max(100, e.target.scrollHeight)}px`
                    }}
                    placeholder="Leave a comment"
                    className="w-full min-h-[100px] p-3 bg-transparent resize-none focus:outline-none text-sm overflow-hidden"
                    disabled={submitting}
                    style={{ height: content ? "auto" : "100px" }}
                  />
                ) : (
                  <div className="min-h-[100px] p-3 prose prose-sm dark:prose-invert max-w-none prose-headings:mt-0 prose-headings:mb-2 prose-p:my-1 prose-p:leading-relaxed">
                    {content.trim() ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "")
                            const inline = !match && !className
                            if (inline) {
                              return (
                                <code className="px-1.5 py-0.5 bg-muted text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              )
                            }
                            return (
                              <div className="my-3 overflow-hidden border border-border">
                                <SyntaxHighlighter
                                  style={resolvedTheme === "dark" ? atomDark : prism}
                                  language={match ? match[1] : "text"}
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,
                                    padding: "1rem",
                                    fontSize: "0.875rem",
                                    background: resolvedTheme === "dark" ? "#1e1e1e" : "#f6f8fa",
                                  }}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              </div>
                            )
                          },
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    ) : (
                      <span className="text-muted-foreground">Nothing to preview</span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-stretch border-t border-border">
                  {/* Info section */}
                  <details className="group flex-1">
                    <summary className="flex items-center gap-2 px-3 py-3 text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 transition-colors list-none">
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.93 4.89l-.465 4.655a.47.47 0 0 1-.93 0L7.07 4.89a.93.93 0 1 1 1.86 0zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                      </svg>
                      <span>Styling with Markdown & KaTeX is supported</span>
                      <svg className="w-3 h-3 ml-1 transition-transform group-open:rotate-180" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z"/>
                      </svg>
                    </summary>
                    <div className="px-3 py-3 text-xs text-muted-foreground border-t border-border bg-muted/20 space-y-2">
                      <div>
                        <span className="font-medium text-foreground">Markdown:</span>
                        <span className="ml-2">**bold** *italic* `code` [link](url)</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Headers:</span>
                        <span className="ml-2"># H1 ## H2 ### H3</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Code blocks:</span>
                        <span className="ml-2">```language ... ```</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Math:</span>
                        <span className="ml-2">$inline$ or $$block$$</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Lists:</span>
                        <span className="ml-2">- item or 1. item</span>
                      </div>
                    </div>
                  </details>
                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="px-6 py-3 bg-muted/50 text-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors border-l border-border"
                  >
                    {submitting ? "Posting..." : "Comment"}
                  </button>
                </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 bg-muted/30 border border-border">
            <p className="text-muted-foreground mb-3">Sign in with GitHub to comment</p>
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#24292e] text-white text-sm font-medium hover:bg-[#2f363d] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {(comments || []).map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={user?.id}
            resolvedTheme={resolvedTheme}
            onReaction={handleReaction}
            onDelete={handleDeleteRequest}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* Loading / Empty State */}
      {loading && comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchComments(pagination.page + 1)}
            disabled={loading}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : `Load more (${pagination.totalComments - comments.length} remaining)`}
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          {/* Modal */}
          <div className="relative border border-border bg-background p-6 shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-2">Delete comment</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex items-stretch border border-border">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors border-l border-border"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// Separate component for each comment to handle markdown rendering
function CommentItem({
  comment,
  currentUserId,
  resolvedTheme,
  onReaction,
  onDelete,
  formatDate,
}: {
  comment: Comment
  currentUserId: string | undefined
  resolvedTheme: string | undefined
  onReaction: (commentId: string, reactionType: string) => void
  onDelete: (commentId: string) => void
  formatDate: (date: string) => string
}) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const isOwner = currentUserId && currentUserId === comment.user_id

  // Get reactions that have counts > 0
  const activeReactions = REACTIONS.filter(
    ({ type }) => (comment.reactions[type] || 0) > 0
  )

  return (
    <article className="border border-border">
      {/* Header */}
      <div className="flex items-stretch border-b border-border">
        {/* Avatar */}
        <div className="flex items-center justify-center w-14 border-r border-border">
          <img
            src={comment.avatar_url || `https://github.com/${comment.username}.png`}
            alt={comment.username}
            className="w-10 h-10 flex-shrink-0 object-cover"
          />
        </div>
        {/* Info */}
        <div className="flex-1 flex items-center px-3 py-2 gap-2">
          <a
            href={`https://github.com/${comment.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm hover:underline"
          >
            {comment.username}
          </a>
          <span className="text-muted-foreground text-sm">
            commented on {formatDate(comment.created_at)}
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
            <div className="absolute right-0 top-full mt-1 z-10 bg-popover border border-border shadow-lg">
              <div className="text-xs text-muted-foreground px-3 py-2 border-b border-border whitespace-nowrap">Pick your reaction</div>
              <div className="flex items-stretch">
                {REACTIONS.map(({ type, emoji }, index) => (
                  <button
                    key={type}
                    onClick={() => {
                      onReaction(comment.id, type)
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
            </div>
          )}
        </div>
      </div>

      {/* Content with Markdown */}
      <div className="p-3 prose prose-sm dark:prose-invert max-w-none comment-content prose-headings:mt-0 prose-headings:mb-2 prose-p:my-1 prose-p:leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              const inline = !match && !className

              if (inline) {
                return (
                  <code className="px-1.5 py-0.5 bg-muted text-sm font-mono" {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <div className="my-3 overflow-hidden border border-border">
                  <SyntaxHighlighter
                    style={resolvedTheme === "dark" ? atomDark : prism}
                    language={match ? match[1] : "text"}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      fontSize: "0.875rem",
                      background: resolvedTheme === "dark" ? "#1e1e1e" : "#f6f8fa",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              )
            },
            a({ href, children }) {
              const text = String(children)
              if (text.startsWith("@")) {
                return (
                  <a
                    href={`https://github.com/${text.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {children}
                  </a>
                )
              }
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {children}
                </a>
              )
            },
            p({ children }) {
              return <p className="mb-3 last:mb-0">{children}</p>
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-muted-foreground/30 pl-4 my-3 text-muted-foreground italic">
                  {children}
                </blockquote>
              )
            },
          }}
        >
          {comment.content}
        </ReactMarkdown>
      </div>

      {/* Footer - Reactions and Delete */}
      {(activeReactions.length > 0 || isOwner) && (
        <div className="flex items-stretch border-t border-border">
          {/* Reactions */}
          {activeReactions.map(({ type, emoji }, index) => {
            const count = comment.reactions[type] || 0
            const hasReacted = comment.userReactions.includes(type)

            return (
              <button
                key={type}
                onClick={() => onReaction(comment.id, type)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm transition-colors border-r border-border ${
                  hasReacted
                    ? "bg-muted text-foreground"
                    : "hover:bg-muted/30"
                }`}
              >
                <span>{emoji}</span>
                <span className="text-xs font-medium">{count}</span>
              </button>
            )
          })}
          {/* Spacer */}
          <div className="flex-1" />
          {/* Delete button */}
          {isOwner && (
            <button
              onClick={() => onDelete(comment.id)}
              className="px-4 py-2 text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors border-l border-border"
              title="Delete comment"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  )
}
