import LecturesTagsClientPage from "./LecturesTagsClientPage";
import tagsData from "@/data/lectures/tags.json";
import lecturesData from "@/data/lectures/lectures.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lectures Tags",
  description: "Browse all lecture tags and their descriptions",
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

export default function LecturesTagsPage() {
  // Gather all unique tags from lectures (only active lectures)
  const allTagsSet = new Set<string>();
  
  const activeLectures = lecturesData.filter(lecture => lecture.state === "active");
  
  activeLectures.forEach(lecture => {
    if (lecture.tags && Array.isArray(lecture.tags)) {
      lecture.tags.forEach(tag => allTagsSet.add(tag));
    }
  });
  
  const allTags = Array.from(allTagsSet);
  
  // Create tag objects with metadata from tags.json or defaults
  // ONLY for tags that actually exist in the lectures
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
        preview: `Lectures and content related to ${tagTitle.toLowerCase()}.`,
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
    <div className="lectures-container">
      <LecturesTagsClientPage tags={sortedTags} />
    </div>
  );
}
