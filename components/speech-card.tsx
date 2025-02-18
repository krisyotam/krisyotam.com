"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SpeechModal } from "@/components/speech-modal"

interface SpeechCardProps {
  img: string
  title: string
  subtitle: string
  description: string
  pdfLink: string
  docxLink: string
  date?: string
  author?: string
}

export const SpeechCard: React.FC<SpeechCardProps> = ({
  img,
  title,
  subtitle,
  description,
  pdfLink,
  docxLink,
  date,
  author,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="overflow-hidden transition-shadow cursor-pointer group" onClick={() => setIsModalOpen(true)}>
        <div className="relative aspect-[16/11] bg-muted">
          <img
            src={img || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors flex items-center justify-center">
            <p className="text-white text-center px-4 opacity-100 group-hover:opacity-0 transition-opacity">
              Click to view details
            </p>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{subtitle}</p>
        </CardContent>
        {(date || author) && (
          <CardFooter className="px-4 py-3 border-t bg-muted/50">
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              {date && <span>{new Date(date).toLocaleDateString()}</span>}
              {author && <span className="truncate">{author}</span>}
            </div>
          </CardFooter>
        )}
      </Card>

      <SpeechModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        subtitle={subtitle}
        description={description}
        pdfLink={pdfLink}
        docxLink={docxLink}
        date={date}
        author={author}
        img={img}
      />
    </>
  )
}

