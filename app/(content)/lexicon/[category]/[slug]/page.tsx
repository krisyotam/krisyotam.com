export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import lexiconData from "@/data/lexicon/lexicon.json";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";
import { PageHeader } from "@/components/page-header";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | "Active";

interface EntryData {
  title: string;
  start_date: string;
  end_date?: string;
  slug: string;
  tags: string[];
  category: string;
  status?: string;
  confidence?: string;
  importance?: number;
  cover_image?: string;
  preview?: string;
  state?: string;
}

interface PageProps {
  params: { category: string; slug: string };
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  return (lexiconData as any[]).map(item => ({
    category: slugifyCategory(item.category),
    slug: item.slug
  }));
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const item = (lexiconData as any[]).find(i => slugifyCategory(i.category) === params.category && i.slug === params.slug);
  if (!item) return { title: "Not found" };
  const coverUrl = item.cover_image || `https://picsum.photos/1200/630?text=${encodeURIComponent(item.title)}`;
  const url = `https://krisyotam.com/lexicon/${params.category}/${params.slug}`;
  return {
    title: `${item.title} | Kris Yotam`,
    description: item.preview || `${item.title}`,
    openGraph: {
      title: item.title,
      description: item.preview || `${item.title}`,
      url,
      type: 'article',
      images: [{ url: coverUrl, width: 1200, height: 630, alt: item.title }],
      siteName: 'Kris Yotam'
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.preview || `${item.title}`,
      images: [coverUrl],
      creator: '@krisyotam'
    }
  };
}

export default async function LexiconEntryPage({ params }: PageProps) {
  const entryData = (lexiconData as any[]).find(i => slugifyCategory(i.category) === params.category && i.slug === params.slug);
  if (!entryData) notFound();

  const headings = await extractHeadingsFromMDX('lexicon', params.slug, params.category);

  // Dynamically import the MDX file
  const Entry = (await import(`@/app/(content)/lexicon/content/${params.category}/${params.slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <PageHeader title={entryData.title} start_date={entryData.start_date} end_date={entryData.end_date} preview={entryData.preview} backText="Lexicon" backHref="/lexicon" />
        </div>

        <main className="container max-w-[672px] mx-auto px-4">
          {headings.length > 0 && <TableOfContents headings={headings} />}
          <div className="lexicon-content">
            <Entry />
          </div>
        </main>
      </div>
    </div>
  );
}
