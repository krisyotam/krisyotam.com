export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import linksData from "@/data/links/links.json";
import LinkPageClient from "./LinkPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "speculative";

interface LinkData {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  url: string;
}

interface LinkPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return linksData.map(link => ({
    category: slugifyCategory(link.category),
    slug: link.slug
  }));
}

export async function generateMetadata({ params }: LinkPageProps): Promise<Metadata> {
  const link = linksData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!link) {
    return {
      title: "Link Not Found",
    };
  }

  return {
    title: `${link.title} | ${link.category} | Kris Yotam`,
    description: `Link: ${link.title} in ${link.category} category`,
  };
}

export default async function LinkPage({ params }: LinkPageProps) {
  const linkData = linksData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!linkData) {
    notFound();
  }

  const link = {
    ...linkData,
    start_date: linkData.date,
    end_date: undefined,
    status: linkData.status as Status,
    confidence: linkData.confidence as Confidence
  };

  const links = linksData.map((link: LinkData) => ({
    ...link,
    start_date: link.date,
    end_date: undefined,
    status: link.status as Status,
    confidence: link.confidence as Confidence
  }));

  // Extract headings from the link MDX content
  const headings = await extractHeadingsFromMDX('links', params.slug, params.category);

  // Dynamically import the MDX file based on category and slug
  const Link = (await import(`@/app/(content)/links/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <LinkPageClient link={link} allLinks={links} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="link-content">
            <Link />
          </div>
          <LinkPageClient link={link} allLinks={links} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
