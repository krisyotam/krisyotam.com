import EssaysTaggedPage from "./EssaysTaggedPage";
import essaysData from "@/data/essays/essays.json";
import tagsData from "@/data/essays/tags.json";
import type { Metadata } from "next";
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
  // Get all unique tags from active essays data only
  const activeEssays = essaysData.essays.filter(essay => essay.state === "active");
  const allTagsSet = new Set<string>();
  
  activeEssays.forEach(essay => {
    if (essay.tags && Array.isArray(essay.tags)) {
      essay.tags.forEach(tag => allTagsSet.add(tag));
    }
  });
  
  const allTags = Array.from(allTagsSet);
  
  console.log('Available tags:', allTags);
  console.log('Slugified tags:', allTags.map(tag => titleToSlug(tag)));
  
  return allTags.map(tag => ({
    slug: titleToSlug(tag)
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to tag name
  const tagSlug = params.slug;
  const activeEssays = essaysData.essays.filter(essay => essay.state === "active");
  
  // Find the original tag name
  let originalTag: string | undefined;
  for (const essay of activeEssays) {
    if (essay.tags && Array.isArray(essay.tags)) {
      originalTag = essay.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (originalTag) break;
    }
  }

  if (!originalTag) {
    return {
      title: "Tag Not Found | Essays",
    };
  }

  // Check if this tag has custom metadata in tags.json
  const customTag = tagsData.tags.find(t => t.slug === tagSlug);
  const tagTitle = customTag ? customTag.title : originalTag;

  return {
    title: `${tagTitle} Essays | Kris Yotam`,
    description: `Essays tagged with ${tagTitle}`,
  };
}

export default function EssaysTagPage({ params }: PageProps) {
  const tagSlug = params.slug;
  
  // Filter essays to only show active ones first
  const activeEssays = essaysData.essays.filter(essay => essay.state === "active");
  
  // Find the original tag name and filter essays by tag
  let originalTag: string | undefined;
  const essaysWithTag = activeEssays.filter(essay => {
    if (essay.tags && Array.isArray(essay.tags)) {
      const foundTag = essay.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (foundTag && !originalTag) {
        originalTag = foundTag;
      }
      return !!foundTag;
    }
    return false;
  });

  if (!originalTag || essaysWithTag.length === 0) {
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
    backHref: "/essays/tags"
  } : {
    title: originalTag,
    subtitle: "",
    date: new Date().toISOString(),
    preview: `Essays tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/essays/tags"
  };

  // Sort essays by date (newest first) and transform to match Essay interface
  const essays = [...essaysWithTag].sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  }).map(essay => ({
      id: essay.slug,
      title: essay.title,
      abstract: essay.preview,
      importance: essay.importance,
      confidence: essay.confidence,
      authors: [], // Default value since not in original data
      subject: essay.category,
      keywords: essay.tags,
      postedBy: "admin", // Default value
      postedOn: essay.end_date || essay.start_date,
      dateStarted: essay.start_date,
      tags: essay.tags,
      img: essay.cover_image,
      status: essay.status,
      pdfLink: undefined,
      sourceLink: undefined,
      category: essay.category,
      customPath: undefined
    }));

  return (
    <div className="essays-container">
      <EssaysTaggedPage essays={essays} tagData={tagHeaderData} />
    </div>
  );
}