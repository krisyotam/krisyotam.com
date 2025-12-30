"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { ResearchHeader } from "@/components/research-header";
import { Footer } from "@/app/(content)/essays/components/footer";
import { Citation } from "@/components/citation";
import type { Research } from '@/types/research'

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export function ResearchDetail({ research }: { research: Research }) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const yearCreated = new Date(research.start_date).getFullYear();
  const formattedDate = new Date(research.start_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <ResearchHeader
          title={research.name}
          dateStarted={research.start_date}
          tags={[]}
          category={research.status}
          status={research.status as any}
          importance={5}
        />

        <div className="space-y-8 my-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <p className="text-sm text-muted-foreground">{research.description}</p>
          </section>

          {research.imgs && research.imgs.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Images</h2>
              <div className="grid grid-cols-2 gap-2">
                {research.imgs.map((img, i) => (
                  <img key={i} src={img.img_url} alt={img.title} className="w-full h-48 object-cover border border-border" />
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-8 border-t border-border">
            {research.are_na_link ? (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.open(research.are_na_link, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                View on Are.na
              </Button>
            ) : null}
          </div>
        </div>

        <div className="my-8">
          <Citation
            title={research.name}
            slug={`research/${research.status}/${yearCreated}/${slugify(research.name)}`}
            date={research.start_date}
            url={`https://krisyotam.com/research/${research.status}/${yearCreated}/${slugify(research.name)}`}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}