import type { LectureNote } from "@/types/lecture-note"
import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { LectureNoteDetail } from "./lecture-note-detail"
import lectureNotesData from "@/data/lecture-notes.json"

interface LectureNoteData {
  id: string;
  title: string;
  abstract: string;
  importance: number;
  confidence: string;
  authors: string[];
  subject: string;
  keywords: string[];
  postedBy: string;
  postedOn: string;
  dateStarted: string;
  tags: string[];
  bibliography?: string[];
  img?: string;
  category: string;
}

function slugifyTitle(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function slugifyCategory(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  const lectureNotes = lectureNotesData as LectureNote[];
  return lectureNotes.map((item) => ({
    category: slugifyCategory(item.category),
    year: new Date(item.dateStarted).getFullYear().toString(),
    slug: slugifyTitle(item.title),
  }));
}

// Generate metadata for each lecture note page
export async function generateMetadata(
  { params }: { params: { category: string; year: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the lecture note item by category, year, and slug
  const y = parseInt(params.year, 10);
  const lectureNotes = lectureNotesData as LectureNote[];
  const item = lectureNotes.find((r) => {
    const categorySlug = slugifyCategory(r.category);
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  // If lecture note item not found, return default metadata
  if (!item) {
    return {
      title: "Lecture Note Not Found",
    };
  }

  // Get base URL from parent metadata for absolute URLs
  const previousImages = (await parent).openGraph?.images || [];

  // Construct metadata with OpenGraph properties
  return {
    title: `${item.title} | ${item.category} | Kris Yotam`,
    description: item.abstract,
    openGraph: {
      title: item.title,
      description: item.abstract,
      type: "article",
      publishedTime: item.postedOn,
      authors: item.authors,
      tags: item.tags || [],
      images: [
        {
          url: "https://i.postimg.cc/jSDMT1Sn/research.png",
          alt: `${item.title} | Lecture Notes`,
          width: 1200,
          height: 630
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.abstract,
      images: ["https://i.postimg.cc/jSDMT1Sn/research.png"],
    },
  };
}

export default function LectureNotePage({
  params,
}: {
  params: { category: string; year: string; slug: string };
}) {
  const y = parseInt(params.year, 10);
  if (isNaN(y)) notFound();

  // Find the lecture note item
  const lectureNotes = lectureNotesData as LectureNote[];
  const item = lectureNotes.find((r) => {
    const categorySlug = slugifyCategory(r.category);
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return categorySlug === params.category && itemYear === y && titleSlug === params.slug;
  });

  if (!item) notFound();

  return <LectureNoteDetail lectureNote={item} />;
} 