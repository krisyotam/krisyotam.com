"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  FileText,
  Mic,
  BookMarked,
  Users,
  GraduationCap,
  PenTool,
  School,
  HandCoins,
  Newspaper,
  Rss,
  BookOpen,
  Search,
  Book,
  Award,
  Pen,
  ScrollText,
  FileSpreadsheet,
  Scale,
  CheckSquare,
  HelpCircle,
  ThumbsDown,
} from "lucide-react"
import Link from "next/link"

// Define types for the statistics
interface ExperienceStats {
  blog: number
  offsite: number
  notes: number
  newsletters: number
  papers: number
  essays: number
  fiction: number
  verse: number
  ocs: number
  certifications: number
  lectureNotes: number
  lectures: number
  articles: number
  cases: number
  dossiers: number
  libers: number
  conspiracies: number
  proofs: number
  problems: number
  shortform: number
}

export default function Experience() {
  const [stats, setStats] = useState<ExperienceStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch all required JSON files in parallel
        const sources = {
          blog: () => import("@/data/blog/blog.json"),
          offsite: () => import("@/data/doc/archive.json"),
          notes: () => import("@/data/notes/notes.json"),
          newsletters: async () => 10,
          papers: () => import("@/data/papers/papers.json"),
          essays: () => import("@/data/essays/essays.json"),
          fiction: () => import("@/data/fiction/fiction.json"),
          verse: () => import("@/data/verse/verse.json"),
          ocs: () => import("@/data/ocs/ocs.json"),
          certifications: () => import("@/data/certifications.json"),
          lectureNotes: () => import("@/data/lecture-notes/lecture-notes.json"),
          lectures: () => import("@/data/lectures/lectures.json"),
          articles: () => import("@/data/news/news.json"),
          cases: () => import("@/data/cases/cases.json"),
          dossiers: () => import("@/data/dossiers/dossiers.json"),
          libers: () => import("@/data/libers/libers.json"),
          conspiracies: () => import("@/data/conspiracies/conspiracies.json"),
          proofs: () => import("@/data/proofs/proofs.json"),
          problems: () => import("@/data/problems/problems.json"),
          shortform: () => import("@/data/shortform/shortform.json"),
        }
        const results = await Promise.all(
          Object.entries(sources).map(async ([key, loader]) => {
            try {
              const data = await loader();
              if (typeof data === "number") return [key, data];
              let arr: any[] = [];
              if (data && typeof data === "object") {
                if (Array.isArray(data)) arr = data;
                else if (Array.isArray((data as any).default)) arr = (data as any).default;
                // Only access key if it exists and is an array
                else if (key in data && Array.isArray((data as any)[key])) arr = (data as any)[key];
              }
              if (arr.length > 0) {
                if (arr.some(e => typeof e.state === 'undefined')) {
                  console.log(`Type '${key}' has entries without a 'state' property.`);
                }
                return [key, arr.filter(e => e.state === 'active').length];
              }
              return [key, 0];
            } catch {
              return [key, 0];
            }
          })
        )
        const statsObj: ExperienceStats = Object.fromEntries(results)
        setStats(statsObj)
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Set fallback stats in case of error
        setStats({
          blog: 0,
          offsite: 0,
          notes: 0,
          newsletters: 10,
          papers: 0,
          essays: 0,
          fiction: 0,
          verse: 0,
          ocs: 0,
          certifications: 0,
          lectureNotes: 0,
          lectures: 0,
          articles: 0,
          cases: 0,
          dossiers: 0,
          libers: 0,
          conspiracies: 0,
          proofs: 0,
          problems: 0,
          shortform: 0,
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
    return null
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
  <StatCard title="Blog Posts" count={stats?.blog || 0} icon={<Rss className="h-6 w-6 text-primary" />} variants={item} href="/" />
  <StatCard title="Off Site" count={stats?.offsite || 0} icon={<HandCoins className="h-6 w-6 text-primary" />} variants={item} href="/offsite" />
  <StatCard title="Notes" count={stats?.notes || 0} icon={<BookOpen className="h-6 w-6 text-primary" />} variants={item} href="/notes" />
  <StatCard title="Newsletters" count={stats?.newsletters || 0} icon={<Newspaper className="h-6 w-6 text-primary" />} variants={item} href="/newsletter" />
  <StatCard title="Papers" count={stats?.papers || 0} icon={<FileText className="h-6 w-6 text-primary" />} variants={item} href="/papers" />
  <StatCard title="Essays" count={stats?.essays || 0} icon={<PenTool className="h-6 w-6 text-primary" />} variants={item} href="/essays" />
  <StatCard title="Fiction" count={stats?.fiction || 0} icon={<BookMarked className="h-6 w-6 text-primary" />} variants={item} href="/fiction" />
  <StatCard title="Verse" count={stats?.verse || 0} icon={<Pen className="h-6 w-6 text-primary" />} variants={item} href="/verse" />
  <StatCard title="Characters" count={stats?.ocs || 0} icon={<Users className="h-6 w-6 text-primary" />} variants={item} href="/characters" />
  <StatCard title="Certifications" count={stats?.certifications || 0} icon={<Award className="h-6 w-6 text-primary" />} variants={item} href="/certifications" />
  <StatCard title="Lecture Notes" count={stats?.lectureNotes || 0} icon={<School className="h-6 w-6 text-primary" />} variants={item} href="/lecture-notes" />
  <StatCard title="Lectures" count={stats?.lectures || 0} icon={<GraduationCap className="h-6 w-6 text-primary" />} variants={item} href="/lectures" />
  <StatCard title="Articles" count={stats?.articles || 0} icon={<Newspaper className="h-6 w-6 text-primary" />} variants={item} href="/articles" />
  <StatCard title="Cases" count={stats?.cases || 0} icon={<Scale className="h-6 w-6 text-primary" />} variants={item} href="/cases" />
  <StatCard title="Dossiers" count={stats?.dossiers || 0} icon={<FileSpreadsheet className="h-6 w-6 text-primary" />} variants={item} href="/dossiers" />
  <StatCard title="Libers" count={stats?.libers || 0} icon={<Book className="h-6 w-6 text-primary" />} variants={item} href="/libers" />
  <StatCard title="Conspiracies" count={stats?.conspiracies || 0} icon={<HelpCircle className="h-6 w-6 text-primary" />} variants={item} href="/conspiracies" />
  <StatCard title="Proofs" count={stats?.proofs || 0} icon={<CheckSquare className="h-6 w-6 text-primary" />} variants={item} href="/proofs" />
  <StatCard title="Problems" count={stats?.problems || 0} icon={<ThumbsDown className="h-6 w-6 text-primary" />} variants={item} href="/problems" />
  <StatCard title="Short Form" count={stats?.shortform || 0} icon={<ScrollText className="h-6 w-6 text-primary" />} variants={item} href="/shortform" />
    </motion.div>
  )
}

