"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  FileText,
  Mic,
  BookMarked,
  Quote,
  Users,
  GraduationCap,
  PenTool,
  Presentation,
  School,
  HandCoins,
  Newspaper,
  Rss,
} from "lucide-react"
import Link from "next/link"

// Define types for the statistics
interface ExperienceStats {
  posts: number
  newsletters: number
  nuggets: number
  notes: number
  research: number
  speeches: number
  books: number
  keynotes: number
  quotes: number
  poems: number
  characters: number
  certifications: number
}

export default function Experience() {
  const [stats, setStats] = useState<ExperienceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch stats from our API endpoint
        const response = await fetch("/api/content-stats")

        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set fallback stats in case of error
        setStats({
          posts: 0,
          newsletters: 0,
          nuggets: 0,
          notes: 0,
          research: 0,
          speeches: 0,
          books: 0,
          keynotes: 0,
          quotes: 0,
          poems: 0,
          characters: 0,
          certifications: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Animation variants for the stat items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-md"></div>
        ))}
      </div>
    )
  }

  // Update the StatCardProps interface to include an href property
  interface StatCardProps {
    title: string
    count: number
    icon: React.ReactNode
    variants: any
    href?: string
  }

  // Modify the StatCard component with a new hover style
  function StatCard({ title, count, icon, variants, href }: StatCardProps) {
    const cardContent = (
      <Card
        className={`overflow-hidden bg-muted/50 border-border transition-all duration-300 ease-in-out
          ${href ? "cursor-pointer hover:scale-[1.0005] hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:border-primary/20 group" : ""}`}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <div className="mb-2 transition-colors duration-300 ease-in-out group-hover:text-primary">{icon}</div>
          <div className="text-3xl font-bold text-foreground mb-1 transition-colors duration-300 ease-in-out group-hover:text-primary/90">
            {count}
          </div>
          <div className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground">
            {title}
          </div>
        </CardContent>
      </Card>
    )

    // Wrap with Link if href is provided, and open in a new tab
    if (href) {
      return (
        <motion.div variants={variants}>
          <Link href={href} target="_blank" rel="noopener noreferrer">
            {cardContent}
          </Link>
        </motion.div>
      )
    }

    // Return without Link if no href
    return <motion.div variants={variants}>{cardContent}</motion.div>
  }

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={container} initial="hidden" animate="show">
      <StatCard
        title="Blog Posts"
        count={stats?.posts || 0}
        icon={<Rss className="h-6 w-6 text-primary" />}
        variants={item}
        href="/"
      />
      <StatCard
        title="Newsletters"
        count={stats?.newsletters || 0}
        icon={<Newspaper className="h-6 w-6 text-primary" />}
        variants={item}
        href="/newsletter"
      />
      <StatCard
        title="Nuggets"
        count={stats?.nuggets || 0}
        icon={<HandCoins className="h-6 w-6 text-primary" />}
        variants={item}
        href="/nuggets"
      />
      <StatCard
        title="Notes"
        count={stats?.notes || 0}
        icon={<FileText className="h-6 w-6 text-primary" />}
        variants={item}
        href="/notes"
      />
      <StatCard
        title="Research"
        count={stats?.research || 0}
        icon={<School className="h-6 w-6 text-primary" />}
        variants={item}
        href="/research"
      />
      <StatCard
        title="Speeches"
        count={stats?.speeches || 0}
        icon={<Mic className="h-6 w-6 text-primary" />}
        variants={item}
        href="/speeches"
      />
      <StatCard
        title="Books"
        count={stats?.books || 0}
        icon={<BookMarked className="h-6 w-6 text-primary" />}
        variants={item}
        href="/mybooks"
      />
      <StatCard
        title="Keynotes"
        count={stats?.keynotes || 0}
        icon={<Presentation className="h-6 w-6 text-primary" />}
        variants={item}
        href="/keynotes"
      />
      <StatCard
        title="Quotes"
        count={stats?.quotes || 0}
        icon={<Quote className="h-6 w-6 text-primary" />}
        variants={item}
        href="/quotes"
      />
      <StatCard
        title="Poems"
        count={stats?.poems || 0}
        icon={<PenTool className="h-6 w-6 text-primary" />}
        variants={item}
        href="/poetry"
      />
      <StatCard
        title="Characters"
        count={stats?.characters || 0}
        icon={<Users className="h-6 w-6 text-primary" />}
        variants={item}
        href="/ocs"
      />
      <StatCard
        title="Certifications"
        count={stats?.certifications || 0}
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
        variants={item}
        href="/about"
      />
    </motion.div>
  )
}

