export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import fictionDataRaw from "@/data/fiction/fiction.json";
import NotePageClient from "./FictionPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/lib/mdx";
import type { NoteMeta } from "@/types/content";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface StoryData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  state: "active" | "hidden";
}

// Type assertion to ensure the imported data matches our Story interface
const fictionData = fictionDataRaw as StoryData[];

interface StoryPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return fictionData.map(story => ({
    category: slugifyCategory(story.category),
    slug: story.slug
  }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const story = fictionData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!story) {
    return {
      title: "Story Not Found",
    };
  }

  return {
    title: `${story.title} | ${story.category} | Kris Yotam`,
    description: `Story: ${story.title} in ${story.category} category`,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const storyData = fictionData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!storyData) {
    notFound();
  }

  const story: NoteMeta = {
    ...storyData,
    status: storyData.status as Status,
    confidence: storyData.confidence as Confidence
  };

  const stories: NoteMeta[] = fictionData.map((story: StoryData) => ({
    ...story,
    status: story.status as Status,
    confidence: story.confidence as Confidence
  }));
  // Extract headings from the fiction MDX content
  const headings = await extractHeadingsFromMDX('fiction', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const Story = (await import(`@/app/(content)/fiction/content/${params.category}/${params.slug}.mdx`)).default;
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <NotePageClient note={story} allNotes={stories} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="note-content">
            <Story />
          </div>
          <NotePageClient note={story} allNotes={stories} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}