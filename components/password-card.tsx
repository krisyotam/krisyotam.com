"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, ExternalLink } from "lucide-react"
import { PasswordDialog } from "@/components/password-dialog";

export interface ResearchCardProps {
  id: string
  img: string
  title: string
  abstract: string
  importance: string
  authors: string[]
  subject: string
  keywords: string[]
  postedBy: string
  postedOn: string
  bibliography: string[]
  pdfLink: string
  sourceLink: string
}

export const ResearchCard: React.FC<ResearchCardProps> = ({
  id,
  img,
  title,
  abstract,
  importance,
  authors,
  subject,
  keywords,
  postedBy,
  postedOn,
  bibliography,
  pdfLink,
  sourceLink,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string>("")

  const handleDownloadClick = (link: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedLink(link)
    setShowPasswordDialog(true)
  }

  const handlePasswordSuccess = () => {
    window.open(selectedLink, "_blank")
  }

  return (
    <>
      <Card
        className="overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 h-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <img src={img || "/placeholder.svg"} alt={title} className="w-full aspect-[7/4] object-cover" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-all duration-300" />
        </div>
        <CardContent className="p-4 flex-1">
          <h3 className="font-semibold text-base mb-2">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{abstract}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {keywords.slice(0, 3).map((keyword) => (
              <span key={keyword} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                {keyword}
              </span>
            ))}
            {keywords.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{keywords.length - 3} more</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => handleDownloadClick(pdfLink, e)}
            >
              <Download className="mr-2 h-4 w-4" />
              <span>PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => handleDownloadClick(sourceLink, e)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Source</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t bg-muted/50">
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>
              {authors[0]}
              {authors.length > 1 ? " et al." : ""}
            </span>
            <span>{new Date(postedOn).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-2">Abstract</h4>
              <p className="text-sm text-muted-foreground">{abstract}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Importance</h4>
              <p className="text-sm text-muted-foreground">{importance}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Authors</h4>
              <p className="text-sm text-muted-foreground">{authors.join(", ")}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Subject</h4>
              <p className="text-sm text-muted-foreground">{subject}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span key={keyword} className="text-xs bg-muted px-2 py-1 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Bibliography</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                {bibliography.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Posted by {postedBy}</span>
              <span>Posted on {new Date(postedOn).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-4 mt-6">
              <Button className="flex-1" onClick={(e) => handleDownloadClick(pdfLink, e)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1" onClick={(e) => handleDownloadClick(sourceLink, e)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Source
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PasswordDialog
              isOpen={showPasswordDialog}
              onClose={() => setShowPasswordDialog(false)}
              onSuccess={handlePasswordSuccess}
              researchId={id}
              title={title} status={""}      />
    </>
  )
}
