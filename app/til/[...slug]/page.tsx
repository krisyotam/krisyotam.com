export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import tilData from "@/data/til/til.json";
import TilPageClient from "./TilPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { TilMeta } from "@/types/til";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
type State = "active" | "hidden";

interface TilData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  state: string;
  preview?: string;
  cover_image?: string;
}

interface TilPageProps {
  params: { slug?: string[] };
}

export async function generateStaticParams() {
  // Generate all slug combinations from the til data
  return tilData.til.map(entry => ({
    slug: [entry.slug]
  }));
}

export async function generateMetadata({ params }: TilPageProps): Promise<Metadata> {
  if (!params.slug || params.slug.length === 0) {
    return {
      title: "TIL Not Found",
    };
  }
  
  const slug = params.slug[0];
  const til = tilData.til.find(t => t.slug === slug);

  if (!til) {
    return {
      title: "TIL Not Found",
    };
  }

  return {
    title: `${til.title} | TIL | Kris Yotam`,
    description: til.preview || `Today I Learned: ${til.title}`,
  };
}

export default async function TilPage({ params }: TilPageProps) {
  if (!params.slug || params.slug.length === 0) {
    notFound();
  }
  
  const slug = params.slug[0];
  const tilEntry = tilData.til.find(t => t.slug === slug);

  if (!tilEntry) {
    notFound();
  }

  const til: TilMeta = {
    ...tilEntry,
    start_date: (tilEntry as any).start_date || tilEntry.date || new Date().toISOString().split('T')[0],
    status: tilEntry.status as Status,
    confidence: tilEntry.confidence as Confidence,
    state: tilEntry.state as State
  };

  const allTils: TilMeta[] = tilData.til.map((entry: any) => ({
    ...entry,
    start_date: entry.start_date || entry.date || new Date().toISOString().split('T')[0],
    status: entry.status as Status,
    confidence: entry.confidence as Confidence,
    state: entry.state as State
  }));

  // Extract headings from the TIL MDX content
  const headings = await extractHeadingsFromMDX('til', slug);

  // Dynamically import the MDX file based on slug
  const TilEntry = (await import(`@/app/til/content/${slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <TilPageClient til={til} allTils={allTils} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="til-content">
            <TilEntry />
          </div>
          <TilPageClient til={til} allTils={allTils} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
