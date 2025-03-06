import type React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export interface KeynoteCardProps {
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
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1">
      <div className="relative">
        <img src={img || "/placeholder.svg"} alt={title} className="w-full aspect-[7/4] object-cover" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-all duration-300" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <a
              href={keynoteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Keynote</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <a href={pptLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <Download className="mr-2 h-4 w-4" />
              <span>PPT</span>
            </a>
          </Button>
        </div>
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

