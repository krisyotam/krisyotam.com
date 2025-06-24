import reportsData from "@/data/reports/reports.json";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { ReportsDetail } from "./reports-detail";
import type { Report } from "@/types/report"

interface ReportData {
  id: string;
  title: string;
  abstract?: string;
  importance: number | string;
  confidence?: string;
  authors: string[];
  subject?: string;
  keywords?: string[];
  postedBy: string;
  postedOn: string;
  dateStarted: string;
  tags: string[];
  img?: string;
  status: string;
  pdfLink?: string;
  sourceLink?: string;
  category: string;
}

function slugifyTitle(title: string) {
  return (title || "").toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export async function generateStaticParams() {
  const reports = reportsData as ReportData[];
  return reports
    .filter(item => {
      const titleSlug = slugifyTitle(item.title);
      // Ensure all parts of the slug are non-empty and date is valid
      return titleSlug && item.dateStarted && !isNaN(new Date(item.dateStarted).getFullYear());
    })
    .map((item) => ({
      year: new Date(item.dateStarted).getFullYear().toString(),
      slug: slugifyTitle(item.title),
    }));
}

// Generate metadata for each report page
export async function generateMetadata(
  { params }: { params: { year: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the report item by year and slug
  const y = parseInt(params.year, 10);
  const reports = reportsData as ReportData[];
  const item = reports.find((r) => {
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return itemYear === y && titleSlug === params.slug;
  });

  // If report item not found, return default metadata
  if (!item) {
    return {
      title: "Report Not Found",
    };
  }
  // Get base URL from parent metadata for absolute URLs
  const previousImages = (await parent).openGraph?.images || [];

  // Construct metadata with OpenGraph properties
  return {
    title: `${item.title} | ${item.category} | Kris Yotam`,
    description: item.abstract || `Report on ${item.title} by ${item.authors.join(', ')}`,
    openGraph: {
      title: item.title,
      description: item.abstract || `Report on ${item.title} by ${item.authors.join(', ')}`,
      type: "article",
      publishedTime: item.postedOn,
      authors: item.authors,
      tags: item.keywords || [],
      images: [
        {
          url: "https://i.postimg.cc/jSDMT1Sn/research.png",
          alt: `${item.title} | Report`,
          width: 1200,
          height: 630
        }
      ],
    },    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.abstract || `Report on ${item.title} by ${item.authors.join(', ')}`,
      images: ["https://i.postimg.cc/jSDMT1Sn/research.png"],
    },
  };
}

export default function ReportPage({
  params,
}: {
  params: { year: string; slug: string };
}) {
  const y = parseInt(params.year, 10);
  if (isNaN(y)) notFound();
  
  // Find the report item
  const reports = reportsData as ReportData[];
  const item = reports.find((r) => {
    const itemYear = new Date(r.dateStarted).getFullYear();
    const titleSlug = slugifyTitle(r.title);
    return itemYear === y && titleSlug === params.slug;
  });

  if (!item) notFound();
  const report: Report = {
    ...item,
    img: item.img || "",
    abstract: item.abstract || "",
    confidence: item.confidence || "likely",
    keywords: item.keywords || item.tags || []
  };

  return <ReportsDetail report={report} />;
}