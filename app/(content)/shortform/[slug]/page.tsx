export const dynamic = 'force-static';
export const revalidate = false;
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import shortformData from "@/data/shortform/shortform.json";
import ShortformPageClient from "./ShortformPageClient";
import { TableOfContents } from "@/components/typography/table-of-contents";
import { extractHeadingsFromMDX } from "@/utils/extract-mdx-headings";

type Status = "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished";
type Confidence = "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain";

interface ShortformData {
  title: string;
  preview: string;
  start_date: string;
  end_date?: string;
  slug: string;
  status: string;
  confidence: string;
  importance: number;
  state?: string;
}

interface ShortformPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Generate all slug paths for shortform posts
  return shortformData.shortform.map(post => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: ShortformPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const post = shortformData.shortform.find(p => p.slug === params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const coverUrl = `https://picsum.photos/1200/630?text=${encodeURIComponent(post.title)}`;
  const url = `https://krisyotam.com/shortform/${params.slug}`;

  return {
    title: `${post.title} | Kris Yotam`,
    description: post.preview || `Shortform post: ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.preview || `Shortform post: ${post.title}`,
      url,
      type: "article",
      images: [{
        url: coverUrl,
        width: 1200,
        height: 630,
        alt: post.title
      }],
      siteName: "Kris Yotam",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.preview || `Shortform post: ${post.title}`,
      images: [coverUrl],
      creator: "@krisyotam"
    }
  };
}

export default async function ShortformPostPage({ params }: ShortformPageProps) {
  const postData = shortformData.shortform.find(p => p.slug === params.slug);

  if (!postData) {
    notFound();
  }

  const post = {
    ...postData,
    status: postData.status as Status,
    confidence: postData.confidence as Confidence
  };

  const posts = shortformData.shortform.map((p: ShortformData) => ({
    ...p,
    status: p.status as Status,
    confidence: p.confidence as Confidence
  }));

  // Extract headings from the shortform MDX content
  const headings = await extractHeadingsFromMDX('shortform', params.slug);

  // Dynamically import the MDX file based on slug
  const ShortformPost = (await import(`@/app/(content)/shortform/content/${params.slug}.mdx`)).default;

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header section - full width */}
        <div className="mb-8">
          <ShortformPageClient post={post} allPosts={posts} headerOnly={true} />
        </div>
        
        {/* Main content */}
        <main className="container max-w-[672px] mx-auto px-4">
          {/* Table of Contents - at the top of content */}
          {headings.length > 0 && (
            <TableOfContents headings={headings} />
          )}
          
          <div className="shortform-content">
            <ShortformPost />
          </div>
          <ShortformPageClient post={post} allPosts={posts} contentOnly={true} />
        </main>
      </div>
    </div>
  );
}
