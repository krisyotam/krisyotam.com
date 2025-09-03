"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface PersonalityAssessmentsData {
  mbti: MBTIData
  bigFive: BigFiveData
  enneagram: EnneagramData
  cliftonStrengths: CliftonStrengthsData
  hexaco: HEXACOData
}

interface MBTIData {
  type: string
  name: string
  breakdown: Record<string, number>
  strengths: string[]
  challenges: string[]
  pdfs: Record<string, string>
}

interface BigFiveData {
  name: string
  breakdown: Record<string, number>
  details: Record<string, string>
  pdfs: Record<string, string>
}

interface EnneagramData {
  type: string
  name: string
  typeScores: Record<string, number>
  wingScores: Record<string, number>
  core: {
    basicFear: string
    basicDesire: string
    keyMotivation: string
  }
  wings: Record<string, string>
  pdfs: Record<string, string>
}

interface CliftonStrengthsData {
  name: string
  topThemes: string[]
  breakdown: Record<string, number>
  domainDetails: Record<string, string>
  pdfs: Record<string, string>
}

interface HEXACOData {
  name: string
  breakdown: Record<string, number>
  facets: Record<string, string[]>
  facetScores: Record<string, Record<string, number>>
  pdfs: Record<string, string>
}

interface PersonalityCarouselProps {
  data: PersonalityAssessmentsData
}

export default function PersonalityCarousel({ data }: PersonalityCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const assessments = [
    { key: "mbti", label: "MBTI" },
    { key: "bigFive", label: "Big Five" },
    { key: "enneagram", label: "Enneagram" },
    { key: "cliftonStrengths", label: "CliftonStrengths" },
    { key: "hexaco", label: "HEXACO" },
  ]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? assessments.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === assessments.length - 1 ? 0 : prev + 1))
  }

  const renderMBTI = () => {
    const mbti = data.mbti
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{mbti.type}</h3>
            <p className="text-muted-foreground">{mbti.name}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(mbti.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-medium">Personality Dimensions</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Introversion ({mbti.breakdown.introversion}%)</span>
                    <span>Extraversion ({mbti.breakdown.extraversion}%)</span>
                  </div>
                  <Progress value={mbti.breakdown.introversion} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Intuition ({mbti.breakdown.intuition}%)</span>
                    <span>Sensing ({mbti.breakdown.sensing}%)</span>
                  </div>
                  <Progress value={mbti.breakdown.intuition} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Thinking ({mbti.breakdown.thinking}%)</span>
                    <span>Feeling ({mbti.breakdown.feeling}%)</span>
                  </div>
                  <Progress value={mbti.breakdown.thinking} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Judging ({mbti.breakdown.judging}%)</span>
                    <span>Perceiving ({mbti.breakdown.perceiving}%)</span>
                  </div>
                  <Progress value={mbti.breakdown.judging} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Assertive ({mbti.breakdown.assertive}%)</span>
                    <span>Turbulent ({mbti.breakdown.turbulent}%)</span>
                  </div>
                  <Progress value={mbti.breakdown.assertive} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-2">Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {mbti.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-2">Challenges</h4>
                <div className="flex flex-wrap gap-2">
                  {mbti.challenges.map((challenge, index) => (
                    <Badge key={index} variant="outline">
                      {challenge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderBigFive = () => {
    const bigFive = data.bigFive
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{bigFive.name}</h3>
            <p className="text-muted-foreground">Five-Factor Model of Personality</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(bigFive.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Openness</span>
                  <span>{bigFive.breakdown.openness}%</span>
                </div>
                <Progress value={bigFive.breakdown.openness} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{bigFive.details.openness}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Conscientiousness</span>
                  <span>{bigFive.breakdown.conscientiousness}%</span>
                </div>
                <Progress value={bigFive.breakdown.conscientiousness} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{bigFive.details.conscientiousness}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Extraversion</span>
                  <span>{bigFive.breakdown.extraversion}%</span>
                </div>
                <Progress value={bigFive.breakdown.extraversion} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{bigFive.details.extraversion}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Agreeableness</span>
                  <span>{bigFive.breakdown.agreeableness}%</span>
                </div>
                <Progress value={bigFive.breakdown.agreeableness} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{bigFive.details.agreeableness}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">Neuroticism</span>
                  <span>{bigFive.breakdown.neuroticism}%</span>
                </div>
                <Progress value={bigFive.breakdown.neuroticism} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{bigFive.details.neuroticism}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderEnneagram = () => {
    const enneagram = data.enneagram
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Enneagram Type {enneagram.type}</h3>
            <p className="text-muted-foreground">{enneagram.name}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(enneagram.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-medium">Type Scores</h4>
              <p className="text-xs text-muted-foreground mb-2">Raw scores from assessment (not percentages)</p>
              <div className="space-y-2">
                {Object.entries(enneagram.typeScores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, score]) => (
                    <div key={type}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Type {type.replace("type", "")}</span>
                        <span>{score}</span>
                      </div>
                      <Progress value={(score / 20) * 100} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-2">Core Motivations</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Basic Fear:</span> {enneagram.core.basicFear}
                  </div>
                  <div>
                    <span className="font-medium">Basic Desire:</span> {enneagram.core.basicDesire}
                  </div>
                  <div>
                    <span className="font-medium">Key Motivation:</span> {enneagram.core.keyMotivation}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-2">Top Wing Combinations</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(enneagram.wingScores)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([wing, score]) => (
                      <div key={wing} className="flex justify-between items-center">
                        <span>Wing {wing}</span>
                        <span className="font-medium">{score}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderCliftonStrengths = () => {
    const clifton = data.cliftonStrengths
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{clifton.name}</h3>
            <p className="text-muted-foreground">Talent Themes Assessment</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(clifton.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-3">Top 5 Themes</h4>
              <ol className="space-y-2">
                {clifton.topThemes.map((theme, index) => (
                  <li key={index} className="flex items-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-secondary text-secondary-foreground text-xs mr-2">
                      {index + 1}
                    </span>
                    <span>{theme}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-medium">Domain Distribution</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Strategic Thinking ({clifton.breakdown.strategic}%)</span>
                  </div>
                  <Progress value={clifton.breakdown.strategic} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{clifton.domainDetails.strategic}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Executing ({clifton.breakdown.executing}%)</span>
                  </div>
                  <Progress value={clifton.breakdown.executing} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{clifton.domainDetails.executing}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Relationship Building ({clifton.breakdown.relationship}%)</span>
                  </div>
                  <Progress value={clifton.breakdown.relationship} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{clifton.domainDetails.relationship}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Influencing ({clifton.breakdown.influencing}%)</span>
                  </div>
                  <Progress value={clifton.breakdown.influencing} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{clifton.domainDetails.influencing}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderHEXACO = () => {
    const hexaco = data.hexaco
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{hexaco.name}</h3>
            <p className="text-muted-foreground">Six-Factor Personality Model</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(hexaco.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(hexaco.facetScores).map(([trait, facets]) => (
            <Card key={trait}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium uppercase">{trait.replace("-", "-")}</h4>
                  <span className="text-sm font-medium">{hexaco.breakdown[trait]}</span>
                </div>
                <Progress value={(hexaco.breakdown[trait] / 7) * 100} className="h-2" />

                <div className="space-y-2 pt-2">
                  {Object.entries(facets).map(([facet, score]) => (
                    <div key={facet}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{facet}</span>
                        <span>{score}</span>
                      </div>
                      <Progress value={(score / 7) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {hexaco.breakdown["altruism"] && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium uppercase">Interstitial Altruism</h4>
                  <span className="text-sm font-medium">{hexaco.breakdown["altruism"]}</span>
                </div>
                <Progress value={(hexaco.breakdown["altruism"] / 7) * 100} className="h-2" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  const renderCurrentAssessment = () => {
    const currentKey = assessments[currentIndex].key
    switch (currentKey) {
      case "mbti":
        return renderMBTI()
      case "bigFive":
        return renderBigFive()
      case "enneagram":
        return renderEnneagram()
      case "cliftonStrengths":
        return renderCliftonStrengths()
      case "hexaco":
        return renderHEXACO()
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          {assessments.map((assessment, index) => (
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

      <div className="bg-muted/30 rounded-lg p-4">{renderCurrentAssessment()}</div>
    </div>
  )
}
