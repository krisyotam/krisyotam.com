import { notFound } from "next/navigation"
import philanthropyData from "@/data/philanthropy.json"
import type { PhilanthropyCause } from "@/utils/philanthropy"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Calendar, Target, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const causes = philanthropyData as PhilanthropyCause[]
  const cause = causes.find(c => c.slug === params.slug)
  
  if (!cause) {
    return {
      title: "Cause Not Found",
    }
  }

  return {
    title: `${cause.title} | Philanthropy | Kris Yotam`,
    description: cause.description,
    openGraph: {
      title: `${cause.title} | Philanthropy`,
      description: cause.description,
    },
  }
}

export async function generateStaticParams() {
  const causes = philanthropyData as PhilanthropyCause[]
  return causes.map((cause) => ({
    slug: cause.slug,
  }))
}

export default function PhilanthropySlugPage({ params }: PageProps) {
  const causes = philanthropyData as PhilanthropyCause[]
  const cause = causes.find(c => c.slug === params.slug)

  if (!cause) {
    notFound()
  }


  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'High':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/philanthropy" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Philanthropy
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{cause.title}</h1>
              <p className="text-lg text-muted-foreground">{cause.description}</p>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <Badge className={getStatusColor(cause.status)}>
                {cause.status}
              </Badge>
              <Badge className={getImpactColor(cause.impact)}>
                {cause.impact} Impact
              </Badge>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {cause.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Website Link */}
          <Link 
            href={cause.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Visit Website
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Started</p>
                  <p className="text-sm font-medium">{new Date(cause.dateStarted).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{cause.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground">{cause.importance}</span>
                <div>
                  <p className="text-xs text-muted-foreground">Importance</p>
                  <p className="text-xs text-muted-foreground">Rating (1-10)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                About This Cause
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {cause.longDescription}
              </p>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Goals & Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cause.goals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground">{goal}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Key Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cause.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-sm text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between items-center">
            <Link 
              href="/philanthropy" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Causes
            </Link>
            
            <Link 
              href={cause.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              Support This Cause
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
