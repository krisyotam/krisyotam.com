"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PasswordDialog } from "@/components/password-dialog";
import { Download, ExternalLink, ArrowLeft, XCircle } from "lucide-react";
import { PostHeader } from "@/components/post-header";
import { Footer } from "@/app/essays/components/footer";
import { Citation } from "@/components/citation";

interface Report {
  id: string;
  title: string;
  abstract?: string;
  importance: string | number;
  confidence?: string;
  authors: string[];
  postedBy: string;
  postedOn: string;
  dateStarted: string;
  status: string;
  pdfLink?: string;
  sourceLink?: string;
  category: string;
  tags: string[];
  keywords?: string[];
  subject?: string;
}

// Function to slugify titles for URL construction
function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function ReportsDetail({ report }: { report: Report }) {
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

  const yearCreated = new Date(report.dateStarted).getFullYear();
  const isPdfAvailable = report.pdfLink && report.pdfLink.trim() !== "";
  const formattedDate = new Date(report.dateStarted).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Limit tags to a maximum of 3
  const limitedTags = report.tags.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">        {/* Use the PostHeader component */}
        <PostHeader
          title={report.title}
          date={report.dateStarted}
          tags={limitedTags}
          category={report.category}
          preview={report.abstract}
          status={report.status === "Finished" ? "Finished" :
                 report.status === "In Progress" ? "In Progress" :
                 report.status === "Draft" ? "Draft" :
                 report.status === "Notes" ? "Notes" :
                 "Abandoned"}
          confidence={report.confidence as any || "likely"}
          importance={typeof report.importance === "number" ? report.importance : 5}
          backText="Reports"
          backHref="/reports"
        />{/* Report content - Custom PDF viewer when PDF is available */}
        <div className="space-y-8 my-8">
          {isPdfAvailable ? (
            <div className="w-full my-8 overflow-hidden rounded-none border border-border bg-muted/50 dark:bg-[hsl(var(--popover))]">              {/* Header bezel with title and date */}
              <div className="p-3 flex justify-between items-center text-sm font-medium border-b border-border bg-muted/70 dark:bg-[hsl(var(--popover))]">
                <span className="font-semibold">{report.title}</span>
                <span className="text-muted-foreground">{formattedDate}</span>
              </div>
              
              {/* PDF Viewer */}
              <div className="w-full h-[90vh] bg-white dark:bg-[#333]">
                <iframe 
                  src={`${report.pdfLink}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full"
                  title={report.title}
                  frameBorder="0"
                />
              </div>
              
              {/* Footer bezel with author */}
              <div className="p-3 flex justify-end items-center text-sm italic border-t border-border bg-muted/70 dark:bg-[hsl(var(--popover))]">
                <span className="text-muted-foreground">by {report.authors.join(", ")}</span>
              </div>
            </div>
          ) : (
            <>              <section>
                <h2 className="text-xl font-semibold mb-4">Authors</h2>
                <div className="space-y-2">
                  {report.authors.map((author: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <span>{author}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 border border-border bg-muted/50 text-muted-foreground text-center">
                <p>PDF preview is not available for this report.</p>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-8 border-t border-border">            {isPdfAvailable ? (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleDownloadClick(report.pdfLink!)} // Asserting pdfLink is non-null
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
              onClick={() => window.open(report.sourceLink, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />              View Source
            </Button>
          </div>
        </div>
          {/* Citation component for this report */}
        <div className="my-8">          <Citation 
            title={report.title}
            slug={`reports/${report.category}/${yearCreated}/${slugify(report.title)}`}
            date={report.dateStarted}
            url={`https://krisyotam.com/reports/${report.category}/${yearCreated}/${slugify(report.title)}`}
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