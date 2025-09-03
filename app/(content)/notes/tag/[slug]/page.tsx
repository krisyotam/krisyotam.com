import NotesTaggedPage from "./NotesTaggedPage";
import notesData from "@/data/notes/notes.json";
import tagsData from "@/data/notes/tags.json";
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
  // Get all unique tags from active notes data only
  const activeNotes = notesData.filter(note => note.state === "active");
  const allTagsSet = new Set<string>();
  
  activeNotes.forEach(note => {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach(tag => allTagsSet.add(tag));
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
  const activeNotes = notesData.filter(note => note.state === "active");
  
  // Find the original tag name
  let originalTag: string | undefined;
  for (const note of activeNotes) {
    if (note.tags && Array.isArray(note.tags)) {
      originalTag = note.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (originalTag) break;
    }
  }

  if (!originalTag) {
    return {
      title: "Tag Not Found | Notes",
    };
  }

  // Check if this tag has custom metadata in tags.json
  const customTag = tagsData.tags.find(t => t.slug === tagSlug);
  const tagTitle = customTag ? customTag.title : originalTag;

  return {
    title: `${tagTitle} Notes | Kris Yotam`,
    description: `Notes tagged with ${tagTitle}`,
  };
}

export default function NotesTagPage({ params }: PageProps) {
  const tagSlug = params.slug;
  
  // Filter notes to only show active ones first
  const activeNotes = notesData.filter(note => note.state === "active");
  
  // Find the original tag name and filter notes by tag
  let originalTag: string | undefined;
  const notesWithTag = activeNotes.filter(note => {
    if (note.tags && Array.isArray(note.tags)) {
      const foundTag = note.tags.find(tag => titleToSlug(tag) === tagSlug);
      if (foundTag && !originalTag) {
        originalTag = foundTag;
      }
      return !!foundTag;
    }
    return false;
  });

  if (!originalTag || notesWithTag.length === 0) {
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
    backHref: "/notes/tags"
  } : {
    title: originalTag,
    subtitle: "",
    start_date: "2025-01-01",
    end_date: new Date().toISOString().split('T')[0],
    preview: `Notes tagged with ${originalTag}.`,
    status: "Active" as const,
    confidence: "certain" as const,
    importance: 5,
    backText: "Tags",
    backHref: "/notes/tags"
  };

  // Sort notes by date (newest first)
  const notes = [...notesWithTag].sort((a, b) => {
    const aDate = (a.end_date?.trim()) ? a.end_date : a.start_date;
    const bDate = (b.end_date?.trim()) ? b.end_date : b.start_date;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <div className="notes-container">
      <NotesTaggedPage notes={notes} tagData={tagHeaderData} />
    </div>
  );
}
