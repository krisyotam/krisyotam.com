"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PasswordDialog } from "@/components/password-dialog";
import { Download, ExternalLink, ArrowLeft, XCircle } from "lucide-react";
import { ResearchHeader } from "@/components/research-header";
import { Footer } from "@/app/blog/(post)/components/footer";
import Essay from "@/components/posts/typography/essay";

interface LectureNote {
  id: string;
  title: string;
  abstract: string;
  importance: string | number;
  confidence?: string;
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

export function LectureNoteDetail({ lectureNote }: { lectureNote: LectureNote }) {
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

  const yearCreated = new Date(lectureNote.dateStarted).getFullYear();
  const isPdfAvailable = lectureNote.pdfLink && lectureNote.pdfLink.trim() !== "";
  const formattedDate = new Date(lectureNote.dateStarted).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        {/* Use the ResearchHeader component for lecture notes too */}
        <ResearchHeader
          title={lectureNote.title}
          dateStarted={lectureNote.dateStarted}
          tags={lectureNote.tags}
          category={lectureNote.category}
          status={lectureNote.status === "active" ? "active" : 
                 lectureNote.status === "completed" ? "completed" : 
                 lectureNote.status === "pending" ? "pending" : 
                 "abandoned"}
          importance={typeof lectureNote.importance === "number" ? lectureNote.importance : 5}
          confidence={lectureNote.confidence || "possible"}
          backText="Lecture Notes"
          backHref="/lecture-notes"
        />

        {/* Lecture note content - Essay component when PDF is available */}
        <div className="space-y-8 my-8">
          {isPdfAvailable ? (
            <Essay 
              title={lectureNote.title}
              date={formattedDate}
              author={lectureNote.authors.join(", ")}
              pdfUrl={lectureNote.pdfLink}
            />
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold mb-4">Authors</h2>
                <div className="space-y-2">
                  {lectureNote.authors.map((author, index) => (
                    <div key={index} className="flex items-center">
                      <span>{author}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 border border-border bg-muted/50 text-muted-foreground text-center">
                <p>PDF preview is not available for this lecture note.</p>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-8 border-t border-border">
            {isPdfAvailable ? (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleDownloadClick(lectureNote.pdfLink)}
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
              onClick={() => window.open(lectureNote.sourceLink, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View Source
            </Button>
          </div>

          <div className="text-center pt-8">
            <Link href="/lecture-notes">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all lecture notes
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground flex justify-between pt-8 border-t border-border">
            <div>
              Posted by: {lectureNote.postedBy}<br />
              Posted on: {new Date(lectureNote.postedOn).toLocaleDateString()}
            </div>
            <div className="text-right">
              Notes taken:<br />
              {new Date(lectureNote.dateStarted).toLocaleDateString()}
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
        title={lectureNote.title}
        status={lectureNote.status}
      />
    </div>
  );
} 