import BlogTaggedPage from "./BlogTaggedPage";
import blogData from "@/data/blog/feed.json";
import tagsData from "@/data/blog/tags.json";
import type { Metadata } from "next";
import type { BlogMeta } from "@/types/blog";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

// Helper function to convert tag title to slug
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

export async function generateStaticParams() {
  // Get all unique tags from blog data
  const allTagsSet = new Set<string>();
  
  blogData.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => allTagsSet.add(tag));
    }
  });
  
  const allTags = Array.from(allTagsSet);
  
  console.log('Available blog tags:', allTags);
  console.log('Slugified blog tags:', allTags.map(tag => titleToSlug(tag)));
  
  return allTags.map(tag => ({
    slug: titleToSlug(tag)
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to tag name
  const tagSlug = params.slug;
  
  // Find the original tag name
  let originalTag: string | undefined;
  for (const post of blogData) {
    if (post.tags && Array.isArray(post.tags)) {
      originalTag = post.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (originalTag) break;
    }
  }

  if (!originalTag) {
    return {
      title: "Tag Not Found | Blog",
    };
  }

  // Check if this tag has custom metadata in tags.json
  const customTag = tagsData.tags.find(t => t.slug === tagSlug);
  const tagTitle = customTag ? customTag.title : originalTag;

  return {
    title: `${tagTitle} Blog Posts | Kris Yotam`,
    description: `Blog posts tagged with ${tagTitle}`,
  };
}

export default function BlogTagPage({ params }: PageProps) {
  const tagSlug = params.slug;
  
  // Find the original tag name and filter posts by tag
  let originalTag: string | undefined;
  const postsWithTag = blogData.filter(post => {
    if (post.tags && Array.isArray(post.tags)) {
      const foundTag = post.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (foundTag && !originalTag) {
        originalTag = foundTag;
      }
      return !!foundTag;
    }
    return false;
  });

  if (!originalTag || postsWithTag.length === 0) {
    notFound();
  }

  // Check if this tag has custom metadata in tags.json
  const customTag = tagsData.tags.find(t => t.slug === tagSlug);
  
  // Create header data for this tag
  const tagHeaderData = customTag ? {
    title: customTag.title,
    subtitle: "",
    date: customTag.date,
    preview: customTag.preview,
    status: customTag.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
    confidence: customTag.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
    importance: customTag.importance,
    backText: "Tags",
    backHref: "/blog/tags"
  } : {
    title: originalTag,
    subtitle: "",
    date: new Date().toISOString(),
    preview: `Blog posts tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/blog/tags"
  };

  // Sort posts by date (newest first) and ensure proper typing
  const posts: BlogMeta[] = [...postsWithTag].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(post => ({
    ...post,
    status: post.status as BlogMeta['status'],
    confidence: post.confidence as BlogMeta['confidence']
  }));

  return (
    <div className="blog-container">
      <BlogTaggedPage posts={posts} tagData={tagHeaderData} />
    </div>
  );
}
