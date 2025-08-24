"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, ExternalLink } from "lucide-react"
import { PasswordDialog } from "../password-dialog"
import { Badge } from "@/components/ui/badge"

export interface DocsCardProps {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
  pdfUrl: string
  sourceUrl: string
  aiModel: string
  version: string
}

export const DocsCard: React.FC<DocsCardProps> = ({
  id,
  title,
  description,
  category,
  tags,
  date,
  pdfUrl,
  sourceUrl,
  aiModel,
  version,
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
        <div className="relative bg-muted/50 p-6 flex flex-col items-center justify-center">
          <Badge className="mb-2">{aiModel}</Badge>
          <h3 className="font-medium text-lg text-center mb-1">{title}</h3>
          <p className="text-xs text-center text-muted-foreground">Version: {version}</p>
        </div>
        <CardContent className="p-4 flex-1">
          <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{description}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{tags.length - 3} more</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => handleDownloadClick(pdfUrl, e)}
            >
              <Download className="mr-2 h-4 w-4" />
              <span>PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => handleDownloadClick(sourceUrl, e)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Source</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t bg-muted/50">
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <span>{category}</span>
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              {title}
              <Badge className="ml-2">{aiModel} v{version}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Category</h4>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">AI Model Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-medium">Model</h5>
                  <p className="text-sm">{aiModel}</p>
                </div>
                <div>
                  <h5 className="text-xs font-medium">Version</h5>
                  <p className="text-sm">{version}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <div>
                <p>Generated with {aiModel} {version}</p>
              </div>
              <div className="text-right">
                <p>Generated on</p>
                <p>{new Date(date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button className="flex-1" onClick={(e) => handleDownloadClick(pdfUrl, e)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1" onClick={(e) => handleDownloadClick(sourceUrl, e)}>
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
        title={title}
        status="active"
      />
    </>
  )
} 