"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PasswordDialog } from "@/components/password-dialog";
import { Download, ExternalLink, ArrowLeft, XCircle } from "lucide-react";
import { Footer } from "@/app/blog/(post)/components/footer";
import Essay from "@/components/posts/typography/essay";
import { Badge } from "@/components/ui/badge";
import { DocsHeader } from "@/components/docs/docs-header";

interface DocItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  tags: string[]
  date: string
  pdfUrl: string
  sourceUrl: string
  aiModel: string
  version: string
}

export function DocDetail({ doc }: { doc: DocItem }) {
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

  const isPdfAvailable = doc.pdfUrl && doc.pdfUrl.trim() !== "";
  const formattedDate = new Date(doc.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-6">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        {/* Use the DocsHeader component with tags and category */}
        <DocsHeader
          title={doc.title}
          subtitle={`Generated with ${doc.aiModel} ${doc.version}`}
          date={doc.date}
          preview={doc.description}
          tags={doc.tags}
          category={doc.category}
        />

        {/* Document content - Essay component when PDF is available */}
        <div className="space-y-6 mt-0">
          {isPdfAvailable ? (
            <Essay 
              title={doc.title}
              date={formattedDate}
              author="Kris Yotam"
              pdfUrl={doc.pdfUrl}
            />
          ) : (
            <div className="p-6 border border-border bg-muted/50 text-muted-foreground text-center">
              <p>PDF preview is not available for this document.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 border-t border-border">
            {isPdfAvailable ? (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleDownloadClick(doc.pdfUrl)}
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
              onClick={() => window.open(doc.sourceUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View Source
            </Button>
          </div>

          <div className="text-center pt-6">
            <Link href="/docs">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all documents
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground flex justify-between pt-6 border-t border-border">
            <div>
              <span className="font-medium">AI Model:</span> {doc.aiModel}
            </div>
            <div className="text-right">
              <span className="font-medium">Version:</span> {doc.version}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>

      {/* Password Dialog for protected downloads */}
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={handlePasswordSuccess}
        researchId={doc.id}
        title={doc.title}
        status="active"
      />
    </div>
  );
} 