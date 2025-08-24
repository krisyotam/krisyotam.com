"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AnimeHelpModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm dark:bg-[#121212]/80 hover:bg-muted dark:hover:bg-[#1a1a1a]"
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="h-5 w-5" />
        <span className="sr-only">Help</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md dark:bg-[#1a1a1a] dark:border-gray-800">
          <DialogHeader>
            <DialogTitle>About This Page</DialogTitle>
            <DialogDescription>
              This page showcases my anime experience and taste as a powerscaler, anime reviewer, and anime philosophy
              writer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Here you can explore my anime statistics, watching history, and favorites. The data is pulled directly
              from my MyAnimeList profile.
            </p>
            <p>
              I've curated this collection to reflect my journey through anime, highlighting series that have influenced
              my thinking and writing about anime philosophy.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

