"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface SelfExperiment {
  title: string
  description: string
  link: string
}

interface Prediction {
  statement: string
  confidence: number
  date: string
  category: string
}

interface ProfileData {
  briefBio: string
  quote: string
  selfExperiments: SelfExperiment[]
  masksIWear: string[]
}

interface ProfileBentoProps {
  data: ProfileData
  predictions?: Prediction[]
}

// Simple function to render Markdown links as HTML
function renderMarkdownLinks(text: string): string {
  // Replace [text](url) with <a href="url" target="_blank" rel="noopener noreferrer">text</a>
  return text.replace(
    /\[([^\]]+)\]$$([^)]+)$$/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>',
  )
}

export default function ProfileBento({ data, predictions = [] }: ProfileBentoProps) {
  const [randomPrediction, setRandomPrediction] = useState<Prediction | null>(null)

  useEffect(() => {
    if (predictions && predictions.length > 0) {
      const randomIndex = Math.floor(Math.random() * predictions.length)
      setRandomPrediction(predictions[randomIndex])
    }
  }, [predictions])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Brief Bio */}
      <Card className="col-span-1 md:col-span-2 bg-muted/50 hover:bg-muted/70 transition-colors">
        <CardContent className="p-4">
          <p
            className="text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: renderMarkdownLinks(data.briefBio) }}
          />
        </CardContent>
      </Card>

      {/* Quote */}
      <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <p className="text-sm italic text-center">"{data.quote}"</p>
        </CardContent>
      </Card>

      {/* Self Experiments */}
      <Card className="col-span-1 md:col-span-2 bg-muted/50 hover:bg-muted/70 transition-colors">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-2">Self Experiments</h3>
          <div className="space-y-3">
            {data.selfExperiments.map((experiment, index) => (
              <Link
                key={index}
                href={experiment.link}
                target="_blank"
                className="block hover:bg-secondary/50 p-2 rounded-md transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium">{experiment.title}</h4>
                    <p className="text-xs text-muted-foreground">{experiment.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Random Prediction */}
      <Card className="bg-muted/50 hover:bg-muted/70 transition-colors">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm font-medium mb-2">Prediction</h3>
            {randomPrediction ? (
              <>
                <p className="text-xs mb-2">{randomPrediction.statement}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{randomPrediction.confidence}% confidence</span>
                  <span>{randomPrediction.category}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Loading prediction...</p>
            )}
          </div>
          <Button variant="outline" size="sm" className="mt-3 w-full text-xs" asChild>
            <Link href="/predictions" target="_blank" className="flex items-center justify-center">
              <span>View All Predictions</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Masks I Wear */}
      <Card className="col-span-1 md:col-span-3 bg-muted/50 hover:bg-muted/70 transition-colors">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-2">Masks I Wear</h3>
          <div className="flex flex-wrap gap-2">
            {data.masksIWear.map((mask, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {mask}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
