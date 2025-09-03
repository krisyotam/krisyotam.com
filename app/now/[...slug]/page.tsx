export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import nowData from "@/data/now/now.json";
import NowPageClient from "./NowPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import "../now.css";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";
type State = "active" | "hidden";

interface NowMeta {
  title: string;
  start_date: string;
  end_date?: string;
  date?: string; // backward compatibility
  slug: string;
  tags: string[];
  category: string;
  status: Status;
  confidence: Confidence;
  importance: number;
  state: State;
  preview?: string;
  cover_image?: string;
  subtitle?: string;
}

interface NowData {
  title: string;
  date: string;
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

interface NowPageProps {
  params: { slug?: string[] };
}

export async function generateStaticParams() {
  // Generate all slug combinations from the now data
  return nowData.now.map(entry => ({
    slug: [entry.slug]
  }));
}

export async function generateMetadata({ params }: NowPageProps): Promise<Metadata> {
  if (!params.slug || params.slug.length === 0) {
    return {
      title: "Now Not Found",
    };
  }
  
  const slug = params.slug[0];
  const now = nowData.now.find(n => n.slug === slug);

  if (!now) {
    return {
      title: "Now Not Found",
    };
  }

  return {
    title: `${now.title} | Now | Kris Yotam`,
    description: now.preview || `Now: ${now.title}`,
  };
}

export default async function NowPage({ params }: NowPageProps) {
  if (!params.slug || params.slug.length === 0) {
    notFound();
  }
  
  const slug = params.slug[0];
  const nowEntry = nowData.now.find(n => n.slug === slug);

  if (!nowEntry) {
    notFound();
  }

  const now: NowMeta = {
    ...nowEntry,
    start_date: nowEntry.date,
    end_date: undefined,
    status: nowEntry.status as Status,
    confidence: nowEntry.confidence as Confidence,
    state: nowEntry.state as State
  };

  const allNows: NowMeta[] = nowData.now.map((entry: NowData) => ({
    ...entry,
    start_date: entry.date,
    end_date: undefined,
    status: entry.status as Status,
    confidence: entry.confidence as Confidence,
    state: entry.state as State
  }));

  // Extract headings from the Now MDX content
  const headings = await extractHeadingsFromMDX('now', slug);

  // Dynamically import the MDX file based on slug
  const NowEntry = (await import(`@/app/now/content/${slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <NowPageClient now={now} allNows={allNows} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="now-content">
            <NowEntry />
          </div>
          <NowPageClient now={now} allNows={allNows} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
