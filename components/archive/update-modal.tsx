"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface UpdateModalProps {
  isOpen: boolean
  onClose: () => void
  version: string
  date: string
  description: string
}

export function UpdateModal({ isOpen, onClose, version, date, description }: UpdateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update {version} <span className="text-sm font-normal text-muted-foreground ml-2">({date})</span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-foreground whitespace-pre-wrap">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

