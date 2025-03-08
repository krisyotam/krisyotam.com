// Import the post-specific CSS
import "./posts.css"

// Import post content components
import FeatureTestingContent from "./feature-testing"
import MindfulCodingContent from "./mindful-coding"
import PoetryRecommendationsContent from "./poetry-recommendations"
import StarryNightContent from "./the-starry-night";

// Define a type for the possible keys of the postContent object
type PostSlug = "feature-testing" | "mindful-coding" | "poetry-recommendations" | "the-starry-night";

// Define a type for the post content function signature
type PostContent = () => JSX.Element;

// Export a map of all available post content with proper typing
export const postContent: Record<PostSlug, PostContent> = {
  "feature-testing": FeatureTestingContent,
  "mindful-coding": MindfulCodingContent,
  "poetry-recommendations": PoetryRecommendationsContent,
  "the-starry-night": StarryNightContent,
}

// Helper function to get post content by slug
export function getPostContent(slug: PostSlug): PostContent | null {
  return postContent[slug] || null
}
