export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import problemsData from "@/data/problems/problems.json";
import NotePageClient from "./ProblemPageClient";
import MdxRenderer from "./MdxRenderer";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { NoteMeta } from "@/types/note";
import { readFile } from "fs/promises";
import { join } from "path";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface ProblemData {
  title: string;
  date: string;
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
  }));  // Extract headings from the problem MDX content
  const headings = await extractHeadingsFromMDX('problems', `${params.category}/${params.slug}`, params.category);
    // Read the MDX file as raw content
  const filePath = join(process.cwd(), 'app', 'problems', 'content', params.category, `${params.slug}.mdx`);
  let mdxContent: string;
  
  try {
    mdxContent = await readFile(filePath, 'utf8');
    console.log('Read problems file successfully:', filePath);
  } catch (error) {
    console.error('Error reading problems file:', filePath, error);
    mdxContent = `# Error\n\nCould not load content for ${params.slug}.\n\nFile path: ${filePath}`;
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
            <MdxRenderer content={mdxContent} />
          </div>
          <NotePageClient note={problem} allNotes={problems} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
