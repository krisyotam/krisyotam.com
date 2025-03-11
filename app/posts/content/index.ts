// Import the post-specific CSS
import "./posts.css";

// Define a type for the possible keys of the postContent object
type PostSlug = "feature-testing" | "mindful-coding" | "poetry-recommendations" | "the-starry-night";

// Define a type for the post content function signature
type PostContent = () => Promise<{ default: React.ComponentType }>;

// Export a map of all available post content with proper typing using dynamic imports
export const postContent: Record<PostSlug, PostContent> = {
  "feature-testing": () => import("./feature-testing"),
  "mindful-coding": () => import("./mindful-coding"),
  "poetry-recommendations": () => import("./poetry-recommendations"),
  "the-starry-night": () => import("./the-starry-night"),
};

// Helper function to get post content by slug
export async function getPostContent(slug: PostSlug): Promise<React.ComponentType | null> {
  try {
    const module = await postContent[slug]();
    return module.default;
  } catch (error) {
    console.error(`Error loading post content for ${slug}:`, error);
    return null;
  }
}
