import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type React from "react"

interface KeynoteCardProps {
  img: string
  title: string
  subtitle: string
  keynoteLink: string
  pptLink: string
  date?: string
  author?: string
}

export const KeynoteCard: React.FC<KeynoteCardProps> = ({
  img,
  title,
  subtitle,
  keynoteLink,
  pptLink,
  date,
  author,
}) => {
  return (
    <Card className="overflow-hidden group transition-shadow">
      <div className="relative">
        <img src={img || "/placeholder.svg"} alt={title} className="w-full aspect-[7/4] object-cover" />
        <div className="absolute inset-0 bg-black/60 opacity-100 group-hover:opacity-0 transition-opacity flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="opacity-100 group-hover:opacity-0 transition-opacity"
          >
            <a href={keynoteLink} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Keynote
            </a>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="opacity-100 group-hover:opacity-0 transition-opacity"
          >
            <a href={pptLink} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              PPT
            </a>
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
      {(date || author) && (
        <CardFooter className="px-4 py-3 border-t bg-muted/50">
          <div className="flex justify-between w-full text-sm text-muted-foreground">
            {date && <span>{new Date(date).toLocaleDateString()}</span>}
            {author && <span>{author}</span>}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

