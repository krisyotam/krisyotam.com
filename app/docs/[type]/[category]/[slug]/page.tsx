import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { DocDetail } from "./doc-detail";

interface DocItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  type: string
  tags: string[]
  date: string
  pdfUrl: string
  sourceUrl: string
  aiModel: string
  version: string
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

async function getDocs(): Promise<DocItem[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/docs`, {
      cache: 'force-cache'
    });
    if (!response.ok) throw new Error('Failed to fetch docs');
    const data = await response.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching docs:', error);
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: { type: string; category: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const docs = await getDocs();
  const item = docs.find((d) => {
    return slugify(d.type) === params.type && slugify(d.category) === params.category && d.slug === params.slug;
  });
  if (!item) {
    return { title: "Document Not Found | AI Documents" };
  }
  return {
    title: `${item.title} | AI Documents | Kris Yotam`,
    description: item.description,
  };
}

export default async function DocSlugPage({ params }: { params: { type: string; category: string; slug: string } }) {
  const docs = await getDocs();
  const doc = docs.find((d) => slugify(d.type) === params.type && slugify(d.category) === params.category && d.slug === params.slug);
  if (!doc) return notFound();
  return <DocDetail doc={doc} />;
}   description: item.description,
  };
}

export default function DocSlugPage({ params }: { params: { type: string; category: string; slug: string } }) {
  const docs = docsData as DocItem[];
  const doc = docs.find((d) => slugify(d.type) === params.type && slugify(d.category) === params.category && d.slug === params.slug);
  if (!doc) return notFound();
  return <DocDetail doc={doc} />;
}
