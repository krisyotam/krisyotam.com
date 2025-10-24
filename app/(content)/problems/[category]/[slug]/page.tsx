export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import problemsData from "@/data/problems/problems.json";
import NotePageClient from "./ProblemPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { NoteMeta } from "@/types/note";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface ProblemData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  framework?: string;
  author?: string;
  license?: string;
  preview?: string;
}

interface ProblemPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return problemsData.problems.map(problem => ({
    category: slugifyCategory(problem.category),
    slug: problem.slug
  }));
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const problem = problemsData.problems.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!problem) {
    return {
      title: "Problem Not Found",
    };
  }

  return {
    title: `${problem.title} | ${problem.category} | Kris Yotam`,
    description: `Problem: ${problem.title} in ${problem.category} category`,
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const problemData = problemsData.problems.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!problemData) {
    notFound();
  }

  const problem: NoteMeta = {
    ...problemData,
    status: problemData.status as Status,
    confidence: problemData.confidence as Confidence
  };

  const problems: NoteMeta[] = problemsData.problems.map((problem: ProblemData) => ({
    ...problem,
    status: problem.status as Status,
    confidence: problem.confidence as Confidence
  }));

  // Extract headings from the problem MDX content
  const headings = await extractHeadingsFromMDX('problems', params.slug, params.category);

  // Import the MDX file directly
  let ProblemEntry;
  try {
    // Dynamically import the MDX file based on slug
  ProblemEntry = (await import(`@/app/(content)/problems/content/${params.category}/${params.slug}.mdx`)).default;
    console.log('Imported problem MDX file successfully:', params.slug);
  } catch (error) {
    console.error('Error importing problem MDX file:', params.slug, error);
    // Create a placeholder component for error state
    ProblemEntry = () => (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded">
        <h1>Error Loading Content</h1>
        <p>Could not load content for {params.slug}.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <NotePageClient note={problem} allNotes={problems} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}          
          <div className="problem-content">
            <ProblemEntry />
          </div>
          <NotePageClient note={problem} allNotes={problems} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
