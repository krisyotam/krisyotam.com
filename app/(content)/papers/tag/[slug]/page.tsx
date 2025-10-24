import PapersTaggedPage from "./PapersTaggedPage";
import papersData from "@/data/papers/papers.json";
import tagsData from "@/data/papers/tags.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PaperMeta } from "@/types/papers";

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
    start_date: customTag.date || "2025-01-01",
    end_date: new Date().toISOString().split('T')[0],
    preview: customTag.preview,
    status: customTag.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
    confidence: customTag.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
    importance: customTag.importance,
    backText: "Tags",
    backHref: "/papers/tags"
  } : {
    title: originalTag,
    subtitle: "",
    start_date: new Date().toISOString(),
    end_date: "",
    preview: `Papers tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/papers/tags"
  };

  // Sort papers by date (newest first) and transform to PaperMeta
  const papers = [...papersWithTag].sort((a, b) => {
    const aDate = a.end_date || a.start_date;
    const bDate = b.end_date || b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  }).map(paper => ({
      title: paper.title,
      subtitle: paper.preview,
      preview: paper.preview,
      start_date: paper.start_date,
      end_date: paper.end_date,
      slug: paper.slug,
      tags: paper.tags,
      category: paper.category,
      status: paper.status as PaperMeta['status'],
      confidence: paper.confidence as PaperMeta['confidence'],
      importance: paper.importance,
      state: paper.state,
      cover_image: paper.cover_image
    }));

  return (
    <div className="papers-container">
      <PapersTaggedPage papers={papers} tagData={tagHeaderData} />
    </div>
  );
}
