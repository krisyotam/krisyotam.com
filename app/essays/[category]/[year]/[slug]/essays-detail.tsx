"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PasswordDialog } from "@/components/password-dialog";
import { Download, ExternalLink, ArrowLeft, XCircle } from "lucide-react";
import { ResearchHeader } from "@/components/research-header";
import { Footer } from "@/app/blog/(post)/components/footer";
import Essay from "@/components/posts/typography/essay";

interface Essay {
  id: string;
  title: string;
  importance: string | number;
  authors: string[];
  postedBy: string;
  postedOn: string;
  dateStarted: string;
  status: string;
  pdfLink: string;
  sourceLink: string;
  category: string;
  tags: string[];
}

export function EssaysDetail({ essay }: { essay: Essay }) {
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

  const yearCreated = new Date(essay.dateStarted).getFullYear();
  const isPdfAvailable = essay.pdfLink && essay.pdfLink.trim() !== "";
  const formattedDate = new Date(essay.dateStarted).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Limit tags to a maximum of 3
  const limitedTags = essay.tags.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        {/* Use the ResearchHeader component */}
        <ResearchHeader
          title={essay.title}
          dateStarted={essay.dateStarted}
          tags={limitedTags}
          category={essay.category}
          status={essay.status === "active" ? "active" : 
                 essay.status === "completed" ? "completed" : 
                 essay.status === "pending" ? "pending" : 
                 "abandoned"}
          importance={typeof essay.importance === "number" ? essay.importance : 5}
          backText="Essays"
          backHref="/essays"
        />

        {/* Essay content - Essay component when PDF is available */}
        <div className="space-y-8 my-8">
          {isPdfAvailable ? (
            <Essay 
              title={essay.title}
              date={formattedDate}
              author={essay.authors.join(", ")}
              pdfUrl={essay.pdfLink}
            />
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-4">Authors</h2>
                <div className="space-y-2">
                  {essay.authors.map((author, index) => (
                    <div key={index} className="flex items-center">
                      <span>{author}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 border border-border bg-muted/50 text-muted-foreground text-center">
                <p>PDF preview is not available for this essay.</p>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-8 border-t border-border">
            {isPdfAvailable ? (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleDownloadClick(essay.pdfLink)}
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
              onClick={() => window.open(essay.sourceLink, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View Source
            </Button>
          </div>

          <div className="text-center pt-8">
            <Link href="/essays">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all essays
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground flex justify-between pt-8 border-t border-border">
            <div>
              Posted by: {essay.postedBy}<br />
              Posted on: {new Date(essay.postedOn).toLocaleDateString()}
            </div>
            <div className="text-right">
              Essay started:<br />
              {new Date(essay.dateStarted).toLocaleDateString()}
            </div>
          </div>
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