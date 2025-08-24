"use client"

import { useState, useRef, useEffect } from "react"
import { ReferenceTag } from "./reference-tag"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

interface Reference {
  name: string
  url: string
}

interface ConceptsBentoProps {
  references: Reference[]
}

export function ConceptsBento({ references }: ConceptsBentoProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current
        setShowScrollIndicator(scrollHeight > clientHeight)
      }
    }

    checkScroll()
    window.addEventListener("resize", checkScroll)

    return () => {
      window.removeEventListener("resize", checkScroll)
    }
  }, [references])

  return (
    <Card className="bg-muted/20 border-border mb-8">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-medium text-foreground">Key Concepts</h2>
          <div className="ml-2 flex items-center text-xs text-muted-foreground">
            <Info className="h-3 w-3 mr-1" />
            <span>Click any concept to explore its Wikipedia page</span>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="max-h-[180px] overflow-y-auto pr-2 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex flex-wrap gap-2">
            {references.map((reference, index) => (
              <ReferenceTag key={index} name={reference.name} url={reference.url} />
            ))}
          </div>
        </div>

        {showScrollIndicator && (
          <div className="flex justify-center mt-2">
            <div className="w-10 h-1 bg-muted-foreground/20 rounded-full"></div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

