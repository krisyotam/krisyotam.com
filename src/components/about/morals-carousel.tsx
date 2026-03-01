"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileText, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface ProgressBarData {
  label: string
  value: number
  max: number
}

interface KeyValueData {
  label: string
  value: string
}

interface MoralAssessment {
  key: string
  label: string
  fullName: string
  definition: string
  link: string
  progressBars?: ProgressBarData[]
  keyValues?: KeyValueData[]
  quadrantLabel?: string
}

interface MoralsCarouselProps {
  data: MoralAssessment[]
  description?: string
}

export default function MoralsCarousel({ data, description }: MoralsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1))
  }

  const current = data[currentIndex]

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {data.map((assessment, index) => (
              <Button
                key={assessment.key}
                variant={index === currentIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentIndex(index)}
              >
                {assessment.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{current.fullName}</h3>
                  <Badge variant="outline" className="text-xs">Demo</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{current.definition}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={current.link} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </a>
              </Button>
            </div>

            {current.quadrantLabel && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Classification:</span>
                <Badge variant="secondary">{current.quadrantLabel}</Badge>
              </div>
            )}

            {current.progressBars && current.progressBars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {current.progressBars.length <= 4 ? (
                  <Card className="md:col-span-2">
                    <CardContent className="p-4 space-y-3">
                      {current.progressBars.map((bar) => (
                        <div key={bar.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{bar.label}</span>
                            <span>{bar.value} / {bar.max}</span>
                          </div>
                          <Progress value={(bar.value / bar.max) * 100} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        {current.progressBars.slice(0, Math.ceil(current.progressBars.length / 2)).map((bar) => (
                          <div key={bar.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium">{bar.label}</span>
                              <span>{bar.value} / {bar.max}</span>
                            </div>
                            <Progress value={(bar.value / bar.max) * 100} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        {current.progressBars.slice(Math.ceil(current.progressBars.length / 2)).map((bar) => (
                          <div key={bar.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium">{bar.label}</span>
                              <span>{bar.value} / {bar.max}</span>
                            </div>
                            <Progress value={(bar.value / bar.max) * 100} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {current.keyValues && current.keyValues.length > 0 && (
              <Card>
                <CardContent className="p-4 space-y-2">
                  {current.keyValues.map((kv) => (
                    <div key={kv.label} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{kv.label}</span>
                      <span className="text-muted-foreground">{kv.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
