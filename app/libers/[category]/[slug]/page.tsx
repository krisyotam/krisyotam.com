export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import libersData from "@/data/libers/libers.json";
import LiberPageClient from "./LiberPageClient";
import type { LiberMeta } from "@/types/liber";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface LiberData {
  title: string;
  date: string;
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
  
  // Dynamically import the MDX file based on category and slug  
  const Liber = (await import(`@/app/libers/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <LiberPageClient liber={liber} allLibers={libers}>
      <div className="liber-content">
        {/* MDX is now a real React component */}
        <Liber />
      </div>
    </LiberPageClient>
  );
}
