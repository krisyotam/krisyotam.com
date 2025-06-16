export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import conspiraciesData from "@/data/conspiracies/conspiracies.json";
import ConspiraciesPageClient from "./ConspiraciesPageClient";
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
  date: string;
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

  const Conspiracy = (await import(`@/app/conspiracies/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <ConspiraciesPageClient conspiracy={conspiracy} allConspiracies={conspiracies}>
      <div className="conspiracy-content">
        <Conspiracy />
      </div>
    </ConspiraciesPageClient>
  );
}
