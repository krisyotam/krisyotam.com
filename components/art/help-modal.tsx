"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export default function HelpModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 rounded-full w-10 h-10 z-50 bg-background/80 backdrop-blur-sm border shadow-md"
        onClick={() => setIsOpen(true)}
        aria-label="Help information"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>About This Page</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4 text-sm">
            <p>
              This page houses my original traditional & AI art creations. I am infatuated with art and love to
              reimagine things from various time periods, experimenting in the styles of various artists.
            </p>
            <p>You can browse my work by category:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Portfolio</strong> - View my curated collection of artwork
              </li>
              <li>
                <strong>Timeline</strong> - See my artistic journey chronologically
              </li>
              <li>
                <strong>Text</strong> - Read my thoughts and updates about art
              </li>
            </ul>
            <p>
              Each category can be filtered by <strong>Traditional</strong> or <strong>AI</strong> art to help you
              explore specific mediums.
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

