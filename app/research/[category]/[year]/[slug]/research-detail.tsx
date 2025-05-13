"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PasswordDialog } from "@/components/password-dialog";
import { Download, ExternalLink, ArrowLeft } from "lucide-react";
import { ResearchHeader } from "@/components/research-header";

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
  img: string;
  pdfLink: string;
  sourceLink: string;
  category: string;
  tags: string[];
}

export function ResearchDetail({ research }: { research: Research }) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string>("");

  const handleDownloadClick = (link: string) => {
    setSelectedLink(link);
    setShowPasswordDialog(true);
  };

  const handlePasswordSuccess = () => {
    window.open(selectedLink, "_blank");
  };

  const yearCreated = new Date(research.dateStarted).getFullYear();

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {/* Use the new ResearchHeader component */}
        <ResearchHeader
          title={research.title}
          subject={research.subject}
          dateStarted={research.dateStarted}
          authors={research.authors}
          tags={research.tags}
          category={research.category}
          abstract={research.abstract}
          status={research.status === "active" ? "active" : 
                 research.status === "completed" ? "completed" : 
                 research.status === "pending" ? "pending" : 
                 "abandoned"}
          importance={typeof research.importance === "number" ? research.importance : 5}
        />

        {/* Research image if available */}
        {research.img && (
          <div className="my-8 overflow-hidden rounded-md border border-border">
            <Image
              src={research.img}
              alt={research.title}
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Research content */}
        <div className="space-y-8 my-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Abstract</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{research.abstract}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Importance</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{research.importance}</p>
            </div>
          </section>

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

          <section>
            <h2 className="text-xl font-semibold mb-4">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {research.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline">
                  {keyword}
                </Badge>
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

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-8 border-t border-border">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleDownloadClick(research.pdfLink)}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(research.sourceLink, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View Source
            </Button>
          </div>

          <div className="text-center pt-8">
            <Link href="/research">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all research
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground flex justify-between pt-8 border-t border-border">
            <div>
              Posted by: {research.postedBy}<br />
              Posted on: {new Date(research.postedOn).toLocaleDateString()}
            </div>
            <div className="text-right">
              Research started:<br />
              {new Date(research.dateStarted).toLocaleDateString()}
            </div>
          </div>
        </div>
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