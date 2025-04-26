"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Footnote {
  id: string;
  content: string;
  index: number;
  title?: string;
  sourceName?: string;
  sourceLink?: string;
}

interface FootnotesProps {
  notes: Footnote[];
  className?: string;
}

export default function Footnotes({ notes = [], className }: FootnotesProps) {
  const [selectedNote, setSelectedNote] = useState<Footnote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    console.log("📑 FOOTNOTES COMPONENT: Received notes:", notes);
  }, [notes]);

  const totalPages = Math.ceil(notes.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = notes.slice(startIndex, startIndex + entriesPerPage);

  const openNote = (note: Footnote) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className={cn(className, "space-y-2")}>      
      <Card
        className={cn(
          "p-4 bg-card text-card-foreground border-border",
          "rounded-none",
          "[_h3]:mt-0 [&_h3]:mb-3"
        )}
      >
        <h3 className="text-sm font-medium">Footnotes</h3>
        <div className="space-y-2">
          {currentEntries.map((note) => (
            <button
              key={note.id}
              className="w-full text-left py-1.5 px-2 hover:bg-secondary transition-colors flex items-start gap-2 text-xs"
              onClick={() => openNote(note)}
            >
              <span className="flex-shrink-0 text-muted-foreground font-medium">
                {note.index}.
              </span>
              <div className="overflow-hidden">
                <span>
                  {note.content.length > 100
                    ? note.content.substring(0, 100) + '...'
                    : note.content}
                </span>
              </div>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[900px] bg-background text-foreground border-border p-0 rounded-none">
          <DialogHeader className="p-4 border-b border-border">
            <DialogTitle className="text-sm font-medium">
              <div>
                {selectedNote?.title ?? `Note ${selectedNote?.index}`}
                {selectedNote?.sourceName && (
                  <span className="text-muted-foreground ml-2 text-xs">
                    {selectedNote.sourceName}
                  </span>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 prose prose-sm max-h-[70vh] overflow-auto">
            <p>{selectedNote?.content}</p>
            {selectedNote?.sourceLink && (
              <p className="mt-2">
                <a
                  href={selectedNote.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  {selectedNote.sourceName}
                </a>
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
