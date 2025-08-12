"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface IQAssessmentsData {
  realIQ: RealIQData
  wais: WAISData
  stanfordBinet: StanfordBinetData
  ravenProgressive: RavenProgressiveData
  cattellCultureFair: CattellData
  workingMemory: WorkingMemoryData
  processingSpeed: ProcessingSpeedData
}

interface RealIQData {
  name: string
  fullScaleIQ: number
  breakdown: Record<string, string>
  percentile: number
  description: string
  date: string
  testLocation: string
  measurementStatus: string
  testNotes?: string
  pdfs: Record<string, string>
}

interface WAISData {
  name: string
  fullScaleIQ: number
  breakdown: Record<string, number>
  percentile: number
  description: string
  date: string
  testLocation: string
  measurementStatus: string
  conversionNotes?: string
  pdfs: Record<string, string>
}

interface StanfordBinetData {
  name: string
  fullScaleIQ: number
  breakdown: Record<string, number>
  percentile: number
  description: string
  date: string
  testLocation: string
  measurementStatus: string
  conversionNotes?: string
  pdfs: Record<string, string>
}

interface RavenProgressiveData {
  name: string
  score: number
  maxPossibleScore: number
  percentile: number
  description: string
  date: string
  testLocation: string
  measurementStatus: string
  conversionNotes?: string
  pdfs: Record<string, string>
}

interface CattellData {
  name: string
  iqScore: number
  percentile: number
  description: string
  date: string
  testLocation: string
  measurementStatus: string
  conversionNotes?: string
  pdfs: Record<string, string>
}

interface WorkingMemoryData {
  name: string
  score: string
  percentile: number
  description: string
  date: string
  testLocation: string
  measurementStatus: string
  conversionNotes?: string
  pdfs: Record<string, string>
}

interface ProcessingSpeedData {
  name: string
  score: number
  percentile: number
  description: string
  date: string
  testLocation: string
  measurementStatus: string
  conversionNotes?: string
  pdfs: Record<string, string>
}

interface IntelligenceCarouselProps {
  data: IQAssessmentsData
}

export default function IntelligenceCarousel({ data }: IntelligenceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const assessments = [
    { key: "realIQ", label: "RealIQ (Measured)" },
    { key: "wais", label: "WAIS-IV" },
    { key: "stanfordBinet", label: "Stanford-Binet" },
    { key: "ravenProgressive", label: "Raven's Progressive Matrices" },
    { key: "cattellCultureFair", label: "Cattell Culture Fair" },
    { key: "workingMemory", label: "Working Memory" },
    { key: "processingSpeed", label: "Processing Speed" },
  ]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? assessments.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === assessments.length - 1 ? 0 : prev + 1))
  }

  const renderWAIS = () => {
    const wais = data.wais
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Full Scale IQ: {wais.fullScaleIQ}</h3>
            <p className="text-muted-foreground">Percentile: {wais.percentile}%</p>
            <div className="flex items-center mt-1">
              <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                Estimated
              </span>
              <div className="relative ml-2 group">
                <span className="cursor-help underline decoration-dotted underline-offset-2">
                  ⓘ
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {wais.conversionNotes || "This score is estimated based on statistical conversion from measured test results."}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{wais.description}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(wais.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-1">Test date: {new Date(wais.date).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Location: {wais.testLocation}</p>
          
          <h4 className="text-base font-medium mb-3">Score Breakdown</h4>
          {Object.entries(wais.breakdown).map(([key, value]) => (
            <div key={key} className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
              <Progress value={Math.min(100, (value / 160) * 100)} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderStanfordBinet = () => {
    const sb = data.stanfordBinet
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Full Scale IQ: {sb.fullScaleIQ}</h3>
            <p className="text-muted-foreground">Percentile: {sb.percentile}%</p>
            <div className="flex items-center mt-1">
              <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                Estimated
              </span>
              <div className="relative ml-2 group">
                <span className="cursor-help underline decoration-dotted underline-offset-2">
                  ⓘ
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {sb.conversionNotes || "This score is estimated based on statistical conversion from measured test results."}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{sb.description}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(sb.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-1">Test date: {new Date(sb.date).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Location: {sb.testLocation}</p>
          
          <h4 className="text-base font-medium mb-3">Score Breakdown</h4>
          {Object.entries(sb.breakdown).map(([key, value]) => (
            <div key={key} className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
              <Progress value={Math.min(100, (value / 160) * 100)} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderRavenProgressive = () => {
    const raven = data.ravenProgressive
    
    // Calculate score as percentage
    const scorePercentage = (raven.score / raven.maxPossibleScore) * 100
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Score: {raven.score}/{raven.maxPossibleScore}</h3>
            <p className="text-muted-foreground">Percentile: {raven.percentile}%</p>
            <div className="flex items-center mt-1">
              <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                Estimated
              </span>
              <div className="relative ml-2 group">
                <span className="cursor-help underline decoration-dotted underline-offset-2">
                  ⓘ
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {raven.conversionNotes || "This score is estimated based on statistical conversion from measured test results."}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{raven.description}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(raven.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-1">Test date: {new Date(raven.date).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Location: {raven.testLocation}</p>
          
          <h4 className="text-base font-medium mb-3">Test Performance</h4>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Score</span>
              <span className="text-sm font-medium">{raven.score}/{raven.maxPossibleScore}</span>
            </div>
            <div className="w-full overflow-hidden rounded-full bg-secondary h-6">
              <div 
                className="h-full bg-primary transition-all flex items-center justify-center"
                style={{ width: `${scorePercentage}%` }}
              >
                <span className="text-xs text-primary-foreground font-medium">{raven.score}/{raven.maxPossibleScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCattell = () => {
    const cattell = data.cattellCultureFair
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">IQ Score: {cattell.iqScore}</h3>
            <p className="text-muted-foreground">Percentile: {cattell.percentile}%</p>
            <div className="flex items-center mt-1">
              <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                Estimated
              </span>
              <div className="relative ml-2 group">
                <span className="cursor-help underline decoration-dotted underline-offset-2">
                  ⓘ
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {cattell.conversionNotes || "This score is estimated based on statistical conversion from measured test results."}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{cattell.description}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(cattell.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-1">Test date: {new Date(cattell.date).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Location: {cattell.testLocation}</p>
          
          <h4 className="text-base font-medium mb-3">IQ Distribution</h4>
          <div className="relative h-24 bg-secondary rounded-md overflow-hidden mb-2">
            {/* Bell curve visualization (simplified) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-20 bg-gradient-to-t from-transparent to-muted rounded-[100%_100%_0_0]"></div>
            </div>
            
            {/* Marker for the score */}
            <div 
              className="absolute bottom-0 w-1 h-full bg-primary"
              style={{ left: `${Math.min(95, Math.max(5, ((cattell.iqScore - 70) / 80) * 100))}%` }}
            >
              <div className="absolute -top-1 -left-2 w-5 h-5 bg-primary rounded-full"></div>
              <div className="absolute -top-8 -left-8 bg-primary px-2 py-1 rounded text-xs text-primary-foreground">
                {cattell.iqScore}
              </div>
            </div>
            
            {/* Score markers */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 text-xs text-muted-foreground">
              <span>70</span>
              <span>85</span>
              <span>100</span>
              <span>115</span>
              <span>130</span>
              <span>145</span>
              <span>160</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderWorkingMemory = () => {
    const wm = data.workingMemory
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Score: {wm.score}</h3>
            <p className="text-muted-foreground">Percentile: {wm.percentile}%</p>
            <div className="flex items-center mt-1">
              <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                Estimated
              </span>
              <div className="relative ml-2 group">
                <span className="cursor-help underline decoration-dotted underline-offset-2">
                  ⓘ
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {wm.conversionNotes || "This score is estimated based on statistical conversion from measured test results."}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{wm.description}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(wm.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-1">Test date: {new Date(wm.date).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Location: {wm.testLocation}</p>
          
          <h4 className="text-base font-medium mb-3">Performance</h4>
          <div className="mb-3">
            <div className="w-full bg-secondary rounded-md p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">2-back</Badge>
                  <div className="w-full overflow-hidden rounded-full bg-secondary h-2">
                    <div className="h-full bg-primary" style={{ width: "100%" }}/>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">3-back</Badge>
                  <div className="w-full overflow-hidden rounded-full bg-secondary h-2">
                    <div className="h-full bg-primary" style={{ width: "100%" }}/>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">4-back</Badge>
                  <div className="w-full overflow-hidden rounded-full bg-secondary h-2">
                    <div className="h-full bg-primary" style={{ width: "92%" }}/>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">5-back</Badge>
                  <div className="w-full overflow-hidden rounded-full bg-secondary h-2">
                    <div className="h-full bg-primary" style={{ width: "53%" }}/>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">6-back</Badge>
                  <div className="w-full overflow-hidden rounded-full bg-secondary h-2">
                    <div className="h-full bg-primary" style={{ width: "21%" }}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderProcessingSpeed = () => {
    const ps = data.processingSpeed
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Processing Speed Index: {ps.score}</h3>
            <p className="text-muted-foreground">Percentile: {ps.percentile}%</p>
            <div className="flex items-center mt-1">
              <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                Estimated
              </span>
              <div className="relative ml-2 group">
                <span className="cursor-help underline decoration-dotted underline-offset-2">
                  ⓘ
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {ps.conversionNotes || "This score is estimated based on statistical conversion from measured test results."}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{ps.description}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(ps.pdfs).map(([key, url]) => (
              <Button key={key} size="sm" variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  {key.replace("pdf-", "")}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-1">Test date: {new Date(ps.date).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Location: {ps.testLocation}</p>
          
          <h4 className="text-base font-medium mb-3">Performance Metrics</h4>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Processing Speed Index</span>
              <span className="text-sm font-medium">{ps.score}</span>
            </div>
            <Progress value={Math.min(100, (ps.score / 160) * 100)} className="h-2" />
          </div>
        </div>
      </div>
    )
  }

  const renderRealIQ = () => {
    const realIQ = data.realIQ
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Full Scale IQ: {realIQ.fullScaleIQ}</h3>
            <p className="text-muted-foreground">Percentile: {realIQ.percentile}%</p>
            <div className="flex items-center mt-1">
              <span className="px-1.5 py-0.5 text-xs rounded bg-primary text-primary-foreground">
                Tested
              </span>
              <div className="relative ml-2 group">
                <span className="cursor-help underline decoration-dotted underline-offset-2">
                  ⓘ
                </span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  This test was taken directly by the user in optimal conditions. Results are accurate representations of cognitive performance.
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{realIQ.description}</p>
            {realIQ.testNotes && (
              <p className="text-xs text-muted-foreground mt-2 italic">{realIQ.testNotes}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-1">Test date: {new Date(realIQ.date).toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Location: {realIQ.testLocation}</p>
          
          <h4 className="text-base font-medium mb-3">Cognitive Areas</h4>
          {Object.entries(realIQ.breakdown).map(([key, value]) => (
            <div key={key} className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
              <div className="w-full overflow-hidden rounded-full bg-secondary h-2">
                <div 
                  className={`h-full bg-primary transition-all ${
                    value === 'Very High' 
                      ? 'w-[95%]' 
                      : value === 'High' 
                        ? 'w-[80%]'
                        : value === 'Above Average'
                          ? 'w-[65%]'
                          : 'w-[50%]'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCurrentAssessment = () => {
    const currentAssessment = assessments[currentIndex]
    
    switch (currentAssessment.key) {
      case "realIQ":
        return renderRealIQ()
      case "wais":
        return renderWAIS()
      case "stanfordBinet":
        return renderStanfordBinet()
      case "ravenProgressive":
        return renderRavenProgressive()
      case "cattellCultureFair":
        return renderCattell()
      case "workingMemory":
        return renderWorkingMemory()
      case "processingSpeed":
        return renderProcessingSpeed()
      default:
        return null
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-center space-x-2 mb-4">
        {assessments.map((assessment, index) => (
          <Button
            key={assessment.key}
            variant={currentIndex === index ? "default" : "outline"}
            onClick={() => setCurrentIndex(index)}
            className="text-sm"
          >
            {assessment.label}
          </Button>
        ))}
      </div>
      
      <Card className="border border-border">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">{data[assessments[currentIndex].key as keyof IQAssessmentsData].name}</h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {renderCurrentAssessment()}
        </CardContent>
      </Card>
    </div>
  )
}
