"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PasswordDialog } from "@/components/password-dialog";
import { Download, ExternalLink, ArrowLeft, XCircle } from "lucide-react";
import { Footer } from "@/app/essays/components/footer";
import Essay from "@/components/posts/typography/essay";
import { Badge } from "@/components/ui/badge";
import { DocsHeader } from "@/components/docs/docs-header";
import { Citation } from "@/components/citation";

interface DocItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  type: string
  tags: string[]
  date: string
  pdfUrl: string
  sourceUrl: string
  aiModel: string
  version: string
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 md:p-8 lg:p-12">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/docs">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Docs
            </Button>
          </Link>
        </div>

        {/* Document header */}
        <DocsHeader
          title={doc.title}
          date={formattedDate}
          preview={doc.description}
          status="Finished"
          confidence="certain"
          importance={8}
        />

        {/* Document metadata */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{doc.type}</Badge>
            <Badge variant="outline">{doc.category}</Badge>
            <Badge variant="outline">{doc.aiModel}</Badge>
            <Badge variant="outline">v{doc.version}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {doc.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          {isPdfAvailable && (
            <Button 
              onClick={() => handleDownloadClick(doc.pdfUrl)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          )}
          
          {doc.sourceUrl && doc.sourceUrl.trim() !== "" && (
            <Button 
              variant="outline"
              onClick={() => window.open(doc.sourceUrl, "_blank")}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Source
            </Button>
          )}
        </div>

        {/* Document content */}
        <Essay>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground italic mb-6">
              This is a placeholder for the document content. In a real implementation, 
              you would fetch and display the actual document content here.
            </p>
          </div>
        </Essay>

        {/* Citation */}
        <div className="mt-12 mb-8">
          <Citation
            title={doc.title}
            author="Kris Yotam"
            url={`https://krisyotam.com/docs/${slugify(doc.type)}/${slugify(doc.category)}/${doc.slug}`}
            date={doc.date}
          />
        </div>

        {/* Footer */}
        <Footer />

        {/* Password dialog */}
        <PasswordDialog
          isOpen={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
          onSuccess={handlePasswordSuccess}
          title="Access Document"
          description="Enter the password to access this document."
        />
      </div>
    </div>
  );
}
