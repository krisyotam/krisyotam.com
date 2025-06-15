export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import ConspiraciesPageClient from "./ConspiraciesPageClient";
import type { ConspiracyMeta, ConspiracyStatus, ConspiracyConfidence } from "@/types/conspiracies";

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

// Function to fetch conspiracies data
async function getConspiraciesData(): Promise<ConspiracyData[]> {
  try {
    // During build time, we can access the file system directly for better performance
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), "data", "conspiracies", "conspiracies.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error fetching conspiracies data:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const conspiraciesData = await getConspiraciesData();
  // Generate all category/slug combinations
  return conspiraciesData.map(conspiracy => ({
    category: slugifyCategory(conspiracy.category),
    slug: conspiracy.slug
  }));
}

export async function generateMetadata({ params }: ConspiracyPageProps): Promise<Metadata> {
  const conspiraciesData = await getConspiraciesData();
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
  const conspiraciesData = await getConspiraciesData();
  const conspiracyData = conspiraciesData.find(n => 
    slugifyCategory(n.category) === params.category && n.slug === params.slug
  );

  if (!conspiracyData) {
    notFound();
  }
  const conspiracy: ConspiracyMeta = {
    ...conspiracyData,
    status: conspiracyData.status as ConspiracyStatus,
    confidence: conspiracyData.confidence as ConspiracyConfidence
  };

  const conspiracies: ConspiracyMeta[] = conspiraciesData.map((conspiracy: ConspiracyData) => ({
    ...conspiracy,
    status: conspiracy.status as ConspiracyStatus,
    confidence: conspiracy.confidence as ConspiracyConfidence}));
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