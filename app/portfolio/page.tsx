import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import Hero from "@/components/portfolio/hero";
import { ThreeDMarqueeDemo } from "@/components/portfolio/dev";
import { FeaturesSectionDemo } from "@/components/portfolio/hosting";

const portfolioPageData = {
  title: "Portfolio",
  subtitle: "A showcase of selected works, projects, and creative endeavors.",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "Explore a curated collection of my professional, technical, and artistic projects.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
  description: "This portfolio highlights a range of work across disciplines—design, development, writing, and more. Each project reflects my skills, interests, and creative process."
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <PageHeader
          title={portfolioPageData.title}
          subtitle={portfolioPageData.subtitle}
          start_date={portfolioPageData.start_date}
          end_date={portfolioPageData.end_date}
          preview={portfolioPageData.preview}
          status={portfolioPageData.status}
          confidence={portfolioPageData.confidence}
          importance={portfolioPageData.importance}
        />
        <Hero />
        <div className="my-2">
          <div className="rounded-none overflow-hidden">
            <ThreeDMarqueeDemo />
          </div>
        </div>
        <div className="my-2">
          <div className="rounded-none overflow-hidden">
            <FeaturesSectionDemo />
          </div>
        </div>
        <PageDescription
          title={portfolioPageData.title}
          description={portfolioPageData.description}
        />
      </main>
    </div>
  );
}
