"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  FileText,
  BookMarked,
  Users,
  PenTool,
  School,
  HandCoins,
  Newspaper,
  Rss,
  BookOpen,
  Pen,
  Award,
} from "lucide-react"
import Link from "next/link"

// Define types for the statistics
interface ExperienceStats {
  blog: number
  offsite: number
  notes: number
  papers: number
  essays: number
  fiction: number
  verse: number
  ocs: number
  certifications: number
  lectureNotes: number
  news: number
}

export default function Experience() {
  const [stats, setStats] = useState<ExperienceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/content-stats')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set fallback stats in case of error
        setStats({
          blog: 0,
          offsite: 0,
          notes: 0,
          papers: 0,
          essays: 0,
          fiction: 0,
          verse: 0,
          ocs: 0,
          certifications: 0,
          lectureNotes: 0,
          news: 0,
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

  // Update the StatCardProps interface to include an href property
  interface StatCardProps {
    title: string
    count: number
    icon: React.ReactNode
    variants: {
      hidden: { y: number; opacity: number }
      show: { y: number; opacity: number }
    }
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
            {loading ? "-" : count}
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
      <StatCard title="Blog Posts" count={stats?.blog || 0} icon={<Rss className="h-6 w-6 text-primary" />} variants={item} href="/" />
      <StatCard title="Off Site" count={stats?.offsite || 0} icon={<HandCoins className="h-6 w-6 text-primary" />} variants={item} href="/offsite" />
      <StatCard title="Notes" count={stats?.notes || 0} icon={<BookOpen className="h-6 w-6 text-primary" />} variants={item} href="/notes" />
      <StatCard title="Papers" count={stats?.papers || 0} icon={<FileText className="h-6 w-6 text-primary" />} variants={item} href="/papers" />
      <StatCard title="Essays" count={stats?.essays || 0} icon={<PenTool className="h-6 w-6 text-primary" />} variants={item} href="/essays" />
      <StatCard title="Fiction" count={stats?.fiction || 0} icon={<BookMarked className="h-6 w-6 text-primary" />} variants={item} href="/fiction" />
      <StatCard title="Verse" count={stats?.verse || 0} icon={<Pen className="h-6 w-6 text-primary" />} variants={item} href="/verse" />
      <StatCard title="Characters" count={stats?.ocs || 0} icon={<Users className="h-6 w-6 text-primary" />} variants={item} href="/characters" />
      <StatCard title="Certifications" count={stats?.certifications || 0} icon={<Award className="h-6 w-6 text-primary" />} variants={item} href="/certifications" />
      <StatCard title="Lecture Notes" count={stats?.lectureNotes || 0} icon={<School className="h-6 w-6 text-primary" />} variants={item} href="/lecture-notes" />
      <StatCard title="Articles" count={stats?.news || 0} icon={<Newspaper className="h-6 w-6 text-primary" />} variants={item} href="/articles" />
    </motion.div>
  )
}
