import PapersTaggedPage from "./PapersTaggedPage";
import papersData from "@/data/papers/papers.json";
import tagsData from "@/data/papers/tags.json";
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
  // Get all unique tags from active papers data only
  const activePapers = papersData.papers.filter(paper => paper.state === "active");
  const allTagsSet = new Set<string>();
  
  activePapers.forEach(paper => {
    if (paper.tags && Array.isArray(paper.tags)) {
      paper.tags.forEach(tag => allTagsSet.add(tag));
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
  const activePapers = papersData.papers.filter(paper => paper.state === "active");
  
  // Find the original tag name
  let originalTag: string | undefined;
  for (const paper of activePapers) {
    if (paper.tags && Array.isArray(paper.tags)) {
      originalTag = paper.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (originalTag) break;
    }
  }

  if (!originalTag) {
    return {
      title: "Tag Not Found | Papers",
    };
  }

  // Check if this tag has custom metadata in tags.json
  const customTag = tagsData.tags.find(t => t.slug === tagSlug);
  const tagTitle = customTag ? customTag.title : originalTag;

  return {
    title: `${tagTitle} Papers | Kris Yotam`,
    description: `Papers tagged with ${tagTitle}`,
  };
}

export default function PapersTagPage({ params }: PageProps) {
  const tagSlug = params.slug;
  
  // Filter papers to only show active ones first
  const activePapers = papersData.papers.filter(paper => paper.state === "active");
  
  // Find the original tag name and filter papers by tag
  let originalTag: string | undefined;
  const papersWithTag = activePapers.filter(paper => {
    if (paper.tags && Array.isArray(paper.tags)) {
      const foundTag = paper.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (foundTag && !originalTag) {
        originalTag = foundTag;
      }
      return !!foundTag;
    }
    return false;
  });

  if (!originalTag || papersWithTag.length === 0) {
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
    backHref: "/papers/tags"
  } : {
    title: originalTag,
    subtitle: "",
    date: new Date().toISOString(),
    preview: `Papers tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/papers/tags"
  };

  // Sort papers by date (newest first)
  const papers = [...papersWithTag].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="papers-container">
      <PapersTaggedPage papers={papers} tagData={tagHeaderData} />
    </div>
  );
}
