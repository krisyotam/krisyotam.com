export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import libersData from "@/data/libers/libers.json";
import LiberPageClient from "./LiberPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { LiberMeta } from "@/types/liber";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface LiberData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
}

interface LiberPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return libersData.map(liber => ({
    category: slugifyCategory(liber.category),
    slug: liber.slug
  }));
}

export async function generateMetadata({ params }: LiberPageProps): Promise<Metadata> {
  const liber = libersData.find(l => 
    slugifyCategory(l.category) === params.category && l.slug === params.slug
  );

  if (!liber) {
    return {
      title: "Liber Not Found",
    };
  }

  return {
    title: `${liber.title} | ${liber.category} | Kris Yotam`,
    description: `Liber: ${liber.title} in ${liber.category} category`,
  };
}

export default async function LiberPage({ params }: LiberPageProps) {
  const liberData = libersData.find(l => 
    slugifyCategory(l.category) === params.category && l.slug === params.slug
  );

  if (!liberData) {
    notFound();
  }

  const liber: LiberMeta = {
    ...liberData,
    status: liberData.status as Status,
    confidence: liberData.confidence as Confidence
  };

  const libers: LiberMeta[] = libersData.map((liber: LiberData) => ({
    ...liber,
    status: liber.status as Status,
    confidence: liber.confidence as Confidence
  }));
  
  // Extract headings from the liber MDX content
  const headings = await extractHeadingsFromMDX('libers', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug  
  const Liber = (await import(`@/app/(content)/libers/content/${params.category}/${params.slug}.mdx`)).default;
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <LiberPageClient liber={liber} allLibers={libers} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="liber-content">
            <Liber />
          </div>
          <LiberPageClient liber={liber} allLibers={libers} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
