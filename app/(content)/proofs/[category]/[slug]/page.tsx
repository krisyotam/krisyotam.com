export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import proofsData from "@/data/proofs/proofs.json";
import NotePageClient from "./ProofPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import type { NoteMeta } from "@/types/note";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface ProofData {
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

interface ProofPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return proofsData.proofs.map(proof => ({
    category: slugifyCategory(proof.category),
    slug: proof.slug
  }));
}

export async function generateMetadata({ params }: ProofPageProps): Promise<Metadata> {
  const proof = proofsData.proofs.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!proof) {
    return {
      title: "Proof Not Found",
    };
  }

  return {
    title: `${proof.title} | ${proof.category} | Kris Yotam`,
    description: `Proof: ${proof.title} in ${proof.category} category`,
  };
}

export default async function ProofPage({ params }: ProofPageProps) {
  const proofData = proofsData.proofs.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!proofData) {
    notFound();
  }

  const proof: NoteMeta = {
    ...proofData,
    status: proofData.status as Status,
    confidence: proofData.confidence as Confidence
  };  const proofs: NoteMeta[] = proofsData.proofs.map((proof: ProofData) => ({
    ...proof,
    status: proof.status as Status,
    confidence: proof.confidence as Confidence
  }));

  // Extract headings from the proof MDX content
  const headings = await extractHeadingsFromMDX('proofs', params.slug, params.category);

  // Import the MDX file directly
  let ProofEntry;
  try {
    // Dynamically import the MDX file based on slug
  ProofEntry = (await import(`@/app/(content)/proofs/content/${params.category}/${params.slug}.mdx`)).default;
    console.log('Imported proof MDX file successfully:', params.slug);
  } catch (error) {
    console.error('Error importing proof MDX file:', params.slug, error);
    // Create a placeholder component for error state
    ProofEntry = () => (
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
          <NotePageClient note={proof} allNotes={proofs} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}          
          <div className="proof-content">
            <ProofEntry />
          </div>
          <NotePageClient note={proof} allNotes={proofs} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
