"use client";

import { Citation } from "@/components/citation";
import { Footer } from "@/app/(content)/essays/components/footer";
import SiteFooter from "@/components/typography/expanded-footer-block";
import { PageHeader } from "@/components/page-header";

interface ProgymnasmataClientProps {
  post: any;
  headerOnly?: boolean;
  contentOnly?: boolean;
}

export default function ProgymnasmataPageClient({ post, headerOnly, contentOnly }: ProgymnasmataClientProps) {
  const lastUpdated = (post.end_date && post.end_date.trim()) || new Date().toISOString().split('T')[0];

  if (headerOnly) {
    return (
      <div className="container max-w-[672px] mx-auto px-4">
        <PageHeader
          title={post.title}
          start_date={post.start_date && post.start_date.trim() ? post.start_date : "Unknown"}
          end_date={post.end_date && post.end_date.trim() ? post.end_date : new Date().toISOString().split('T')[0]}
          preview={post.preview && post.preview.trim() ? post.preview : "No preview available."}
          status={(post.status ? post.status : "Notes") as ("Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Published" | "Planned" | "Active")}
          confidence={(post.confidence ? post.confidence : "possible") as ("impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain" | "speculative")}
          importance={typeof post.importance === "number" ? post.importance : 5}
          tags={Array.isArray(post.tags) ? post.tags : []}
          backText="Progymnasmata"
          backHref="/progymnasmata"
        />
      </div>
    );
  }

  if (contentOnly) {
    return (
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={""} />
        <Citation
          title={post.title}
          slug={post.slug}
          start_date={post.start_date}
          end_date={post.end_date}
          url={`https://krisyotam.com/progymnasmata/${post.category.toLowerCase()}/${post.slug}`}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="container max-w-[672px] mx-auto px-4 pb-8">
      {/* MDX content is rendered in the server component */}
      <div className="mt-8">
        <SiteFooter lastUpdated={lastUpdated} rawMarkdown={""} />
        <Citation
          title={post.title}
          slug={post.slug}
          start_date={post.start_date}
          end_date={post.end_date}
          url={`https://krisyotam.com/progymnasmata/${post.category.toLowerCase()}/${post.slug}`}
        />
      </div>
      <Footer />
    </div>
  );
}
