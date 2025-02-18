"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface SpeechModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle: string
  description: string
  pdfLink: string
  docxLink: string
  date?: string
  author?: string
  img: string
}

export function SpeechModal({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  pdfLink,
  docxLink,
  date,
  author,
  img,
}: SpeechModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">{subtitle}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <div className="relative overflow-hidden rounded-lg bg-muted" style={{ width: "200px", height: "280px" }}>
              <img src={img || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
            </div>
          </div>

          <p className="text-sm text-foreground">{description}</p>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="border-black hover:bg-gray-100 transition-colors duration-200 rounded-none px-4 py-2"
              asChild
            >
              <a href={pdfLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-black hover:bg-gray-100 transition-colors duration-200 rounded-none px-4 py-2"
              asChild
            >
              <a href={docxLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                DOCX
              </a>
            </Button>
          </div>

          {(date || author) && (
            <div className="flex justify-between text-xs text-muted-foreground mt-4">
              {date && <span>Published: {new Date(date).toLocaleDateString()}</span>}
              {author && <span>By: {author}</span>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

