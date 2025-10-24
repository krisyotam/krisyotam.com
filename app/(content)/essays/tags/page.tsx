import EssaysTagsClientPage from "./EssaysTagsClientPage";
import tagsData from "@/data/essays/tags.json";
import essaysData from "@/data/essays/essays.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essays Tags",
  description: "Browse all essay tags and their descriptions",
};

// Helper function to convert tag title to slug
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

export default function EssaysTagsPage() {
  // Gather all unique tags from essays
  const allTagsSet = new Set<string>();
  
  essaysData.essays.forEach(essay => {
    if (essay.tags && Array.isArray(essay.tags)) {
      essay.tags.forEach(tag => allTagsSet.add(tag));
    }
  });
  
  const allTags = Array.from(allTagsSet);
  
  // Create tag objects with metadata from tags.json or defaults
  // ONLY for tags that actually exist in the essays
  const tags = allTags.map(tagTitle => {
    const slug = titleToSlug(tagTitle);
    
    // Check if this tag has custom metadata in tags.json
    const customTag = tagsData.tags.find(t => t.slug === slug);
    
    if (customTag) {
      return {
        slug: customTag.slug,
        title: customTag.title,
        preview: customTag.preview,
        date: customTag.date,
        status: customTag.status,
        confidence: customTag.confidence,
        importance: customTag.importance,
      };
    } else {
      // Use default metadata for tags not in tags.json
      return {
        slug,
        title: tagTitle,
        preview: `Essays and content related to ${tagTitle.toLowerCase()}.`,
        date: new Date().toISOString(),
        status: "Active",
        confidence: "certain",
        importance: 5,
      };
    }
  });

  // Sort tags by importance (highest first)
  const sortedTags = [...tags].sort((a, b) => b.importance - a.importance);

  return (
    <div className="essays-container">
      <EssaysTagsClientPage tags={sortedTags} />
    </div>
  );
}