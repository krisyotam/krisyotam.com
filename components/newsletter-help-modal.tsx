"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface NewsletterHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterHelpModal({ isOpen, onClose }: NewsletterHelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle>About Newsletter Archive</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            This page contains an archive of all newsletters.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium">Search</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Use the search bar to find newsletters by title, content, or tags.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Year Filter</h3>
            <p className="text-gray-500 dark:text-gray-400">Filter newsletters by publication year.</p>
          </div>
          <div>
            <h3 className="font-medium">View Options</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Switch between grid view (with images) and list view (text only).
            </p>
          </div>
          <div>
            <h3 className="font-medium">Reading Options</h3>
            <p className="text-gray-500 dark:text-gray-400">Read newsletters directly on this site or on Substack.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

