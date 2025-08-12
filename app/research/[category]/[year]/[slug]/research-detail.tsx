"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PasswordDialog } from "@/components/password-dialog";
import { Download, ExternalLink, ArrowLeft, XCircle } from "lucide-react";
import { ResearchHeader } from "@/components/research-header";
import { Footer } from "@/app/(content)/essays/components/footer";
import Essay from "@/components/posts/typography/essay";
import { Citation } from "@/components/citation";

interface Research {
  id: string;
  title: string;
  abstract: string;
  importance: string | number;
  authors: string[];
  subject: string;
  keywords: string[];
  postedBy: string;
  postedOn: string;
  dateStarted: string;
  status: string;
  bibliography: string[];
  pdfLink: string;
  sourceLink: string;
  category: string;
  tags: string[];
}

// Function to slugify titles for URL construction
function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function ResearchDetail({ research }: { research: Research }) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string>("");

  const handleDownloadClick = (link: string) => {
    if (!link || link.trim() === "") return;
    setSelectedLink(link);
    setShowPasswordDialog(true);
  };

  const handlePasswordSuccess = () => {
    window.open(selectedLink, "_blank");
  };

  const yearCreated = new Date(research.dateStarted).getFullYear();
  const isPdfAvailable = research.pdfLink && research.pdfLink.trim() !== "";
  const formattedDate = new Date(research.dateStarted).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        {/* Use the ResearchHeader component */}
        <ResearchHeader          title={research.title}
          dateStarted={research.dateStarted}
          tags={research.tags.slice(0, 3)}
          category={research.category}
          status={research.status === "active" ? "active" : 
                 research.status === "completed" ? "completed" : 
                 research.status === "pending" ? "pending" : 
                 "abandoned"}
          importance={typeof research.importance === "number" ? research.importance : 5}
        />

        {/* Research content - Essay component when PDF is available */}
        <div className="space-y-8 my-8">
          {isPdfAvailable ? (
            <Essay 
              title={research.title}
              date={formattedDate}
              author={research.authors.join(", ")}
              pdfUrl={research.pdfLink}
            />
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-4">Authors</h2>
                <div className="space-y-2">
                  {research.authors.map((author, index) => (
                    <div key={index} className="flex items-center">
                      <span>{author}</span>
                    </div>
                  ))}
                </div>
              </section>

              {research.bibliography.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Bibliography</h2>
                  <ul className="space-y-2 list-disc pl-5">
                    {research.bibliography.map((entry, index) => (
                      <li key={index}>{entry}</li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="p-6 border border-border bg-muted/50 text-muted-foreground text-center">
                <p>PDF preview is not available for this research paper.</p>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-8 border-t border-border">
            {isPdfAvailable ? (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleDownloadClick(research.pdfLink)}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2 opacity-70 cursor-not-allowed"
                disabled
              >
                <XCircle className="h-4 w-4" />
                PDF Unavailable
              </Button>
            )}
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(research.sourceLink, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View Source
            </Button>
          </div>
        </div>
        
        {/* Citation component for this research */}
        <div className="my-8">          <Citation 
            title={research.title}
            slug={`research/${research.category}/${yearCreated}/${slugify(research.title)}`}
            date={research.dateStarted}
            url={`https://krisyotam.com/research/${research.category}/${yearCreated}/${slugify(research.title)}`}
          />
        </div>
        
        <Footer />
      </div>

      {/* Password Dialog for protected downloads */}
      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
}