"use client"

import format from "date-fns/format"
import { ChevronLeft, ExternalLink, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { renderMathToString, MATH_CLASSES } from "@/lib/math"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Enhanced SocialPost interface with context and conversation
interface SocialPost {
  id: string
  title: string
  content?: string
  date: string
  source: {
    type: string
    url: string
  }
  author: string
  context?: {
    type: string
    author: string
    content: string
  }
  conversation?: Array<{
    author: string
    content: string
    date: string
  }>
}

interface SocialPostDetailProps {
  post: SocialPost
}

// Function to process LaTeX in text using centralized math utility
const processLatex = (text: string) => {
  if (!text) return [];

  // Find all LaTeX expressions between $$ and $$
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$\n]+\$)/g)

  return parts.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      // Display mode (centered equation)
      const latex = part.slice(2, -2)
      const html = renderMathToString(latex, { displayMode: true })
      return <div key={index} className={`text-center my-4 ${MATH_CLASSES.display}`} dangerouslySetInnerHTML={{ __html: html }} />
    } else if (part.startsWith("$") && part.endsWith("$")) {
      // Inline mode
      const latex = part.slice(1, -1)
      const html = renderMathToString(latex, { displayMode: false })
      return <span key={index} className={MATH_CLASSES.inline} dangerouslySetInnerHTML={{ __html: html }} />
    }
    return <span key={index}>{part}</span>
  })
}

// User avatar component
function UserAvatar({ username }: { username: string }) {
  // Get initials from username (first two characters)
  const initials = username.substring(0, 2).toUpperCase();
  
  // Determine background color based on username hash (simple hash function)
  const colors = [
    "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", 
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
  ];
  
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hash % colors.length;
  const bgColor = colors[colorIndex];
  
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className={`${bgColor} text-white text-xs`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

// Format content with line breaks and math
function FormattedContent({ content }: { content: string }) {
  // Process LaTeX first
  const processedContent = processLatex(content);
  
  return (
    <div className="whitespace-pre-wrap prose prose-sm max-w-none">
      {processedContent}
    </div>
  );
}

export function SocialPostDetail({ post }: SocialPostDetailProps) {
  const router = useRouter()
  const typeSlug = post.source.type.toLowerCase().replace(/\s+/g, "-")
  const hasContext = post.context !== undefined
  const hasConversation = post.conversation !== undefined && post.conversation.length > 0
  
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 flex items-center space-x-1 text-sm text-muted-foreground">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/social")}
          className="hover:text-foreground"
        >
          Social
        </Button>
        <span>/</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push(`/social/${typeSlug}`)}
          className="hover:text-foreground"
        >
          {post.source.type}
        </Button>
        <span>/</span>
        <span className="truncate max-w-[200px]">{post.title}</span>
      </nav>

      <Button
        variant="ghost"
        className="mb-6 pl-0 flex items-center text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="border border-muted bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-medium mb-2">{post.title}</h1>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <time>{format(new Date(post.date), "MMMM d, yyyy")}</time>
            <span>•</span>
            <Badge variant="secondary" className="text-xs font-normal">
              {post.source.type}
            </Badge>
          </div>
          
          {/* Context (if it exists) */}
          {hasContext && (
            <div className="mb-8 p-4 bg-muted/30 border border-muted">
              <div className="flex items-center gap-2 mb-2">
                <UserAvatar username={post.context!.author} />
                <div>
                  <span className="text-sm font-medium">@{post.context!.author}</span>
                  <Badge variant="outline" className="ml-2 text-xs">{post.context!.type}</Badge>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <FormattedContent content={post.context!.content} />
              </div>
            </div>
          )}
          
          {/* Conversation thread (if it exists) */}
          {hasConversation && !post.content && (
            <div className="mb-8 space-y-4">
              {post.conversation!.map((message, index) => (
                <div 
                  key={index} 
                  className={`border border-muted/70 p-4 ${
                    message.author === post.author 
                      ? 'border-l-4 border-l-primary bg-muted/20' 
                      : 'bg-background'
                  }`}
                >
                  <div className="flex gap-4">
                    <UserAvatar username={message.author} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${message.author === post.author ? 'text-primary' : ''}`}>
                          @{message.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.date), "MMM d, yyyy")}
                        </span>
                      </div>
                      <FormattedContent content={message.content} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Main content (if not conversation) */}
          {post.content && (
            <div className="border border-muted/70 p-4 border-l-4 border-l-primary bg-muted/20">
              <div className="flex gap-4">
                <UserAvatar username={post.author} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-primary">@{post.author}</span>
                  </div>
                  <FormattedContent content={post.content} />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 pt-4 border-t border-muted flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>ID: {post.id}</span>
              {hasConversation && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    <span>{post.conversation!.length} messages</span>
                  </div>
                </>
              )}
            </div>
            
            <a
              href={post.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View Original Source <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </main>
  )
} 