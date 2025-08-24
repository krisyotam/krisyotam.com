import { ResearchHeader } from "@/components/research-header";

// This is an example file to demonstrate the ResearchHeader component
export function ResearchHeaderExample() {
  const exampleResearch = {
    title: "The Impact of Artificial Intelligence on Modern Healthcare Systems",
    subject: "An exploration of how AI technologies are transforming medical diagnostics and patient care",
    dateStarted: "2024-03-15",
    authors: ["Dr. Jane Smith", "Prof. John Doe", "Dr. Alex Johnson"],
    tags: ["AI", "Healthcare", "Machine Learning", "Ethics", "Medical Diagnostics"],
    category: "Technology",
    abstract: "This comprehensive study examines the growing role of artificial intelligence in healthcare settings, focusing on diagnostic accuracy, treatment recommendations, and ethical considerations. Through analysis of case studies across various medical specialties, we identify key patterns of AI implementation and propose a framework for responsible integration of these technologies into clinical practice while addressing concerns related to privacy, bias, and human oversight.",
    status: "active",
    importance: 8,
    confidence: "highly likely"
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ResearchHeader
        title={exampleResearch.title}
        subject={exampleResearch.subject}
        dateStarted={exampleResearch.dateStarted}
        authors={exampleResearch.authors}
        tags={exampleResearch.tags}
        category={exampleResearch.category}
        abstract={exampleResearch.abstract}
        status="active"
        importance={exampleResearch.importance}
        confidence="highly likely"
      />

      <div className="p-4 border border-dashed border-muted-foreground mt-8">
        <p className="text-center text-muted-foreground">
          Below this would be the main content of the research paper
        </p>
      </div>
    </div>
  );
} 