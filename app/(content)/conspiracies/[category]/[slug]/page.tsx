export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import conspiraciesData from "@/data/conspiracies/conspiracies.json";
import ConspiraciesPageClient from "./ConspiraciesPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { ConspiracyMeta } from "@/types/conspiracies";

type Status =
  | "Abandoned"
  | "Notes"
  | "Draft"
  | "In Progress"
  | "Finished";

type Confidence =
  | "impossible"
  | "remote"
  | "highly unlikely"
  | "unlikely"
  | "possible"
  | "likely"
  | "highly likely"
  | "certain";

interface ConspiracyData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview?: string;
  subtitle?: string;
  cover_image?: string;
}

interface ConspiracyPageProps {
  params: { category: string; slug: string };
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  return conspiraciesData.map(conspiracy => ({
    category: slugifyCategory(conspiracy.category),
    slug: conspiracy.slug,
  }));
}

export async function generateMetadata({ params }: ConspiracyPageProps): Promise<Metadata> {
  const conspiracy = conspiraciesData.find(n =>
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!conspiracy) {
    return { title: "Conspiracy Not Found" };
  }

  return {
    title: `${conspiracy.title} | ${conspiracy.category} | Kris Yotam`,
    description: `Conspiracy: ${conspiracy.title} in ${conspiracy.category} category`,
  };
}

export default async function ConspiracyPage({ params }: ConspiracyPageProps) {
  const conspiracyData = conspiraciesData.find(n =>
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!conspiracyData) {
    notFound();
  }

  const conspiracy: ConspiracyMeta = {
    ...conspiracyData,
    status: conspiracyData.status as Status,
    confidence: conspiracyData.confidence as Confidence,
  };

  const conspiracies: ConspiracyMeta[] = conspiraciesData.map((c: ConspiracyData) => ({
    ...c,
    status: c.status as Status,
    confidence: c.confidence as Confidence,
  }));
  // Extract headings from the conspiracy MDX content
  const headings = await extractHeadingsFromMDX('conspiracies', params.slug, params.category);

  const Conspiracy = (await import(`@/app/(content)/conspiracies/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <ConspiraciesPageClient conspiracy={conspiracy} allConspiracies={conspiracies} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="conspiracy-content">
            <Conspiracy />
          </div>
          <ConspiraciesPageClient conspiracy={conspiracy} allConspiracies={conspiracies} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
