import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SocialPostDetail } from "@/components/social/social-post-detail"
import redditDataRaw from "@/data/social/reddit.json"
import twitterDataRaw from "@/data/social/twitter.json"
import instagramDataRaw from "@/data/social/instagram.json" 
import mastodonDataRaw from "@/data/social/mastodon.json"
import lesswrongDataRaw from "@/data/social/lesswrong.json"

// Cast imported data to the correct type
interface SocialPostsCollection {
  posts: SocialPost[]
}

const redditData = redditDataRaw as SocialPostsCollection;
const twitterData = twitterDataRaw as SocialPostsCollection;
const instagramData = instagramDataRaw as SocialPostsCollection;
const mastodonData = mastodonDataRaw as SocialPostsCollection;
const lesswrongData = lesswrongDataRaw as SocialPostsCollection;

interface PageProps {
  params: { type: string; id: string }
}

// Define the social post interface for type safety
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

// Helper function to get the post by ID and type
function getSocialPost(type: string, id: string): SocialPost | null {
  const decodedType = decodeURIComponent(type)
  const decodedId = decodeURIComponent(id)
  
  // Get the appropriate data source based on the type
  let dataSource: SocialPost[] = [];
  
  switch(decodedType) {
    case "reddit":
      dataSource = redditData.posts || [];
      break;
    case "twitter":
      dataSource = twitterData.posts || [];
      break;
    case "instagram":
      dataSource = instagramData.posts || [];
      break;
    case "mastodon":
      dataSource = mastodonData.posts || [];
      break;
    case "lesswrong":
      dataSource = lesswrongData.posts || [];
      break;
    default:
      // If type doesn't match exactly, try to find it across all platforms
      dataSource = [
        ...(redditData.posts || []),
        ...(twitterData.posts || []),
        ...(instagramData.posts || []),
        ...(mastodonData.posts || []),
        ...(lesswrongData.posts || [])
      ];
      break;
  }
  
  // Find the post with the matching ID
  const post = dataSource.find(post => post.id === decodedId)
  
  return post || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getSocialPost(params.type, params.id)
  
  if (!post) {
    return { title: "Post Not Found | Social Posts" }
  }
  
  // Get description from content, context, or fallback
  let description = `Social post by ${post.author}`;
  
  if (post.content) {
    description = post.content.substring(0, 160);
  } else if (post.context && post.context.content) {
    description = post.context.content.substring(0, 160);
  }
  
  return {
    title: `${post.title} | Social Posts | Kris Yotam`,
    description
  }
}

export default function SocialPostPage({ params }: PageProps) {
  const { type, id } = params
  const post = getSocialPost(type, id)
  
  if (!post) notFound()
  
  return <SocialPostDetail post={post} />
} 