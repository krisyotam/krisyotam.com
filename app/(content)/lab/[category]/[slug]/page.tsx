export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import LabPageClient from "./LabPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { LabMeta } from "@/types/lab";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface LabData {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
}

interface LabPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Fetch lab data with fallback
  let labData;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lab/labs`);
    labData = await response.json();
  } catch (error) {
    const { default: fallbackData } = await import("@/data/lab/labs.json");
    labData = fallbackData;
  }
  
  // Generate all category/slug combinations
  return labData.map((lab: LabData) => ({
    category: slugifyCategory(lab.category),
    slug: lab.slug
  }));
}

export async function generateMetadata({ params }: LabPageProps): Promise<Metadata> {
  // Fetch lab data with fallback
  let labData;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lab/labs`);
    labData = await response.json();
  } catch (error) {
    const { default: fallbackData } = await import("@/data/lab/labs.json");
    labData = fallbackData;
  }
  
  const lab = labData.find((p: LabData) => 
    slugifyCategory(p.category) === params.category && p.slug === params.slug
  );

  if (!lab) {
    return {
      title: "Lab Entry Not Found",
    };
  }

  return {
    title: `${lab.title} | ${lab.category} | Lab | Kris Yotam`,
    description: `Lab Entry: ${lab.title} in ${lab.category} category`,
  };
}

export default async function LabPage({ params }: LabPageProps) {
  // Fetch lab data with fallback
  let labData;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lab/labs`);
    labData = await response.json();
  } catch (error) {
    const { default: fallbackData } = await import("@/data/lab/labs.json");
    labData = fallbackData;
  }
  
  const labDataEntry = labData.find((p: LabData) => 
    slugifyCategory(p.category) === params.category && p.slug === params.slug
  );

  if (!labDataEntry) {
    notFound();
  }

  const lab: LabMeta = {
    ...labDataEntry,
    status: labDataEntry.status as Status,
    confidence: labDataEntry.confidence as Confidence
  };

  const labs: LabMeta[] = labData.map((lab: LabData) => ({
    ...lab,
    status: lab.status as Status,
    confidence: lab.confidence as Confidence
  }));

  // Extract headings from the lab MDX content
  const headings = await extractHeadingsFromMDX('lab', params.slug, params.category);

  // Dynamically import the MDX file - try nested structure first, then fallback to flat
  let Post;
  try {
  Post = (await import(`@/app/(content)/lab/content/${params.category}/${params.slug}.mdx`)).default;
  } catch (error) {
    // Fallback to flat structure for legacy entries
    try {
  Post = (await import(`@/app/(content)/lab/content/${params.slug}.mdx`)).default;
    } catch (fallbackError) {
      console.error(`Could not find MDX file for ${params.category}/${params.slug}`);
      notFound();
    }
  }
  
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <LabPageClient lab={lab} allLabs={labs} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="lab-content">
            <Post />
          </div>
          <LabPageClient lab={lab} allLabs={labs} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
