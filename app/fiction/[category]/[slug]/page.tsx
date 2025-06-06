export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import fictionData from "@/data/fiction/fiction.json";
import NotePageClient from "./FictionPageClient";
import type { NoteMeta } from "@/types/note";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface StoryData {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
}

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

  // Dynamically import the MDX file based on slug
  const Story = (await import(`@/app/fiction/content/${params.slug}.mdx`)).default;

  return (
    <NotePageClient note={story} allNotes={stories}>
      <div className="note-content">
        <Story />
      </div>
    </NotePageClient>
  );
}