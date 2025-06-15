export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import conspiraciesData from "@/data/conspiracies/conspiracies.json";
import ConspiraciesPageClient from "./ConspiraciesPageClient";
import type { ConspiracyMeta } from "@/types/conspiracies";

type Status = "Draft" | "Published" | "Archived" | "Active" | "Speculative";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "ambiguous" | "uncertain" | "developing" | "moderate";

interface ConspiracyData {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview?: string;
}

interface ConspiracyPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return conspiraciesData.map(conspiracy => ({
    category: slugifyCategory(conspiracy.category),
    slug: conspiracy.slug
  }));
}

export async function generateMetadata({ params }: ConspiracyPageProps): Promise<Metadata> {
  const conspiracy = conspiraciesData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!conspiracy) {
    return {
      title: "Conspiracy Not Found",
    };
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
    confidence: conspiracyData.confidence as Confidence
  };

  const conspiracies: ConspiracyMeta[] = conspiraciesData.map((conspiracy: ConspiracyData) => ({
    ...conspiracy,
    status: conspiracy.status as Status,
    confidence: conspiracy.confidence as Confidence  }));
  // Dynamically import the MDX file based on category and slug
  const Conspiracy = (await import(`@/app/conspiracies/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <ConspiraciesPageClient conspiracy={conspiracy} allConspiracies={conspiracies}>
      <div className="conspiracy-content">
        {/* MDX is now a real React component */}
        <Conspiracy />
      </div>
    </ConspiraciesPageClient>
  );
}