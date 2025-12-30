"use client"

import redditData from "@/data/social/reddit.json"
import twitterData from "@/data/social/twitter.json"
import instagramData from "@/data/social/instagram.json" 
import mastodonData from "@/data/social/mastodon.json"
import lesswrongData from "@/data/social/lesswrong.json"
import { PageHeader } from "@/components/core"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Combine all posts from different platforms
function getAllPosts() {
  return [
    ...(redditData.posts || []),
    ...(twitterData.posts || []),
    ...(instagramData.posts || []),
    ...(mastodonData.posts || []),
    ...(lesswrongData.posts || [])
  ]
}

// Define Social Post type
export interface SocialPost {
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

function slugifyType(type: string) {
  return type.toLowerCase().replace(/\s+/g, "-")
}

function unslugifyType(slug: string, allTypes: string[]) {
  return allTypes.find(t => slugifyType(t) === slug) || "All"
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
    <Avatar className="h-6 w-6">
      <AvatarFallback className={`${bgColor} text-white text-xs`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export function SocialClient() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const posts = getAllPosts() as SocialPost[]
  const postTypes = Array.from(new Set(posts.map(post => post.source.type))).sort()
  const router = useRouter()
  const pathname = usePathname()

  // Determine current type from URL
  let currentTypeSlug = null
  const match = pathname ? pathname.match(/^\/social\/?([^\/]*)/) : null
  if (match && match[1] && match[1] !== "") {
    currentTypeSlug = match[1]
  }
  const currentType = currentTypeSlug ? unslugifyType(currentTypeSlug, postTypes) : "All"

  // Sort posts by date descending
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // Filter posts by search query and type
  const filteredPosts = sortedPosts.filter(post => {
    const matchesSearch = 
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.context && post.context.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.conversation && post.conversation.some(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.author.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    const matchesType = currentType === "All" || post.source.type === currentType
    
    return matchesSearch && matchesType
  })

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [pathname])

  // Helper to build the correct route for a post
  function getPostUrl(post: SocialPost) {
    const typeSlug = slugifyType(post.source.type)
    return `/social/${encodeURIComponent(typeSlug)}/${encodeURIComponent(post.id)}`
  }

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedType = e.target.value
    if (selectedType === "All") {
      router.push("/social")
    } else {
      router.push(`/social/${slugifyType(selectedType)}`)
    }
  }

  // Get all unique authors
  const allAuthors = Array.from(new Set(posts.flatMap(post => {
    const authors = [post.author];
    if (post.context) authors.push(post.context.author);
    if (post.conversation) {
      post.conversation.forEach(msg => {
        if (!authors.includes(msg.author)) authors.push(msg.author);
      });
    }
    return authors;
  }))).sort();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <PageHeader
        title="Social"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="a archive of my social posts from across the web"
        status="In Progress"
        confidence="likely"
        importance={6}
      />

      <div className="mt-8">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="type-filter" className="text-sm text-muted-foreground">Filter by source:</label>
            <select
              id="type-filter"
              className="border border-muted px-2 py-1 text-sm bg-background"
              value={currentType}
              onChange={handleTypeChange}
            >
              <option value="All">All</option>
              {postTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="text"
              placeholder="Search posts by title or content..."
              className="pl-10 text-sm rounded-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        ) : (
          <>
            <table className="w-full text-sm border border-muted/40">
              <thead>
                <tr className="text-muted-foreground border-b border-muted/40 bg-muted/10">
                  <th className="py-2 text-left font-normal px-3">Title</th>
                  <th className="py-2 text-left font-normal px-3">Author</th>
                  <th className="py-2 text-left font-normal px-3">Source</th>
                  <th className="py-2 text-left font-normal px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => {
                  const hasConversation = post.conversation && post.conversation.length > 0;
                  const hasContext = post.context !== undefined;
                  
                  return (
                    <tr
                      key={post.id}
                      className="border-b border-muted/30 hover:bg-muted/20 cursor-pointer"
                      onClick={() => router.push(getPostUrl(post))}
                    >
                      <td className="py-2 pr-4 px-3 font-medium">
                        <div className="flex items-center">
                          <span>{post.title}</span>
                          {(hasConversation || hasContext) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="ml-2 h-5 px-1">
                                    <MessageCircle className="h-3 w-3 text-muted-foreground" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">
                                  {hasContext ? 'Question & answers' : 'Conversation thread'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-4 px-3">
                        <div className="flex items-center gap-2">
                          <UserAvatar username={post.author} />
                          <span>@{post.author}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-4 px-3">{post.source.type}</td>
                      <td className="py-2 pr-4 px-3">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredPosts.length === 0 && !loading && (
              <div className="text-muted-foreground text-sm mt-6">No posts found matching your criteria.</div>
            )}
          </>
        )}
      </div>
    </main>
  )
} 