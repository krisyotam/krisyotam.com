"use client"

import { useState } from "react"
import Link from "next/link"
import { Marquee } from "@/components/ui/marquee"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface WikiPage {
  title: string
  description: string
  status: "active" | "hidden"
  slug: string
  tags: string[]
}

interface WikiPagesProps {
  pages: WikiPage[]
}

export function WikiPages({ pages }: WikiPagesProps) {
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handlePageClick = (page: WikiPage) => {
    setSelectedPage(page)
    setIsOpen(true)
  }

  // Split pages into two columns for better visual balance
  const halfLength = Math.ceil(pages.length / 2)
  const firstColumn = pages.slice(0, halfLength)
  const secondColumn = pages.slice(halfLength)

  return (
    <div className="w-full mb-8">
      <div className="p-4 bg-muted rounded-lg">
        <div className="relative h-[300px] overflow-hidden rounded-md border">
          <div className="flex gap-4 h-full">
            <Marquee vertical pauseOnHover className="flex-1 [--duration:30s]">
              {firstColumn.map((page, index) => (
                <div
                  key={index}
                  onClick={() => handlePageClick(page)}
                  className="p-3 m-2 bg-card hover:bg-accent rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  <h3 className="font-medium text-center">{page.title}</h3>
                </div>
              ))}
            </Marquee>

            <Marquee vertical pauseOnHover reverse className="flex-1 [--duration:30s]">
              {secondColumn.map((page, index) => (
                <div
                  key={index}
                  onClick={() => handlePageClick(page)}
                  className="p-3 m-2 bg-card hover:bg-accent rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  <h3 className="font-medium text-center">{page.title}</h3>
                </div>
              ))}
            </Marquee>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background/80"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80"></div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedPage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPage.title}</DialogTitle>
                <DialogDescription>{selectedPage.description}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-1 my-2">
                {selectedPage.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm mb-4">
                  {selectedPage.status === "active"
                    ? "This page is available and regularly updated."
                    : "This page is not currently available. It may return at a later date."}
                </p>
                {selectedPage.status === "active" ? (
                  <Link href={`/${selectedPage.slug}`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full">
                      Visit Page
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Page Unavailable
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

