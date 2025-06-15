export const dynamic = 'force-static';
export const revalidate = false;

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import dossiersData from "@/data/dossiers/dossiers.json";
import DossiersPageClient from "./DossiersPageClient";
import type { DossierMeta, DossierStatus, DossierConfidence } from "@/types/dossiers";

interface DossierData {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  category: string;
  status: string;
  confidence: string;
  importance: number;
  preview: string;
  subtitle?: string;
}

interface DossierPageProps {
  params: { category: string; slug: string };
}

// Helper function to slugify category
function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  // Generate all category/slug combinations
  return dossiersData.map(dossierItem => ({
    category: slugifyCategory(dossierItem.category),
    slug: dossierItem.slug
  }));
}

export async function generateMetadata({ params }: DossierPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const dossierItem = dossiersData.find(d => 
    slugifyCategory(d.category) === params.category && d.slug === params.slug
  );

  if (!dossierItem) {
    return {
      title: "Dossier Not Found",
    };
  }

  // Get the default OpenGraph image from parent
  const previousImages = (await parent).openGraph?.images || [];
  // Use Kris Yotam's logo for dossier articles
  const images = [
    {
      url: 'https://i.postimg.cc/ryWkqZxQ/krisyotam-personal-crest.png',
      width: 1200,
      height: 2100,
      alt: dossierItem.title
    }
  ];

  const url = `https://krisyotam.com/dossiers/${params.category}/${params.slug}`;

  return {
    title: `${dossierItem.title} | ${dossierItem.category} Dossiers | Kris Yotam`,
    description: dossierItem.preview || `Dossier investigation: ${dossierItem.title}`,
    openGraph: {
      title: dossierItem.title,
      description: dossierItem.preview || `Dossier investigation: ${dossierItem.title}`,
      url,
      type: "article",
      images,
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: dossierItem.title,
      description: dossierItem.preview || `Dossier investigation: ${dossierItem.title}`,
      images: images.map(img => img.url),
      creator: "@krisyotam"
    }
  };
}

export default async function DossierPage({ params }: DossierPageProps) {
  const dossierItem = dossiersData.find(d => 
    slugifyCategory(d.category) === params.category && d.slug === params.slug
  );

  if (!dossierItem) {
    notFound();
  }

  const dossierData: DossierMeta = {
    ...dossierItem,
    status: dossierItem.status as DossierStatus,
    confidence: dossierItem.confidence as DossierConfidence
  };

  const dossiers: DossierMeta[] = (dossiersData as DossierData[]).map(dossierItem => ({
    ...dossierItem,
    status: dossierItem.status as DossierStatus,
    confidence: dossierItem.confidence as DossierConfidence
  }));  // Dynamically import the MDX file based on category and slug
  const DossierArticle = (await import(`@/app/dossiers/content/${params.category}/${params.slug}.mdx`)).default;
  
  return (
    <DossiersPageClient dossierData={dossierData} allDossiers={dossiers}>
      <div className="dossiers-content">
        <DossierArticle />
      </div>
    </DossiersPageClient>
  );
}