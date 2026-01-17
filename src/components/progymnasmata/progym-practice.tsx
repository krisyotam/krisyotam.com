"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  BookOpen,
  MessageSquare,
  Scale,
  CheckSquare,
  FileText,
  Award,
  BookMarked,
  User,
  ScrollText,
  Quote,
  FileSpreadsheet,
  XSquare,
  HelpCircle,
  ThumbsDown,
} from "lucide-react"
import Link from "next/link"

// Define types for the progymnasmata statistics
interface ProgymStats {
  [key: string]: number
}

interface ProgymItem {
  category: string
}

export default function ProgymPractice() {
  const [stats, setStats] = useState<ProgymStats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/progymnasmata')
        const data: ProgymItem[] = await res.json()

        // Count exercises per category
        const categoryStats: ProgymStats = {}
        for (const item of data) {
          const cat = item.category.toLowerCase()
          categoryStats[cat] = (categoryStats[cat] || 0) + 1
        }
        setStats(categoryStats)
      } catch (error) {
        console.error('Failed to fetch progymnasmata stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

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

    return href ? (
      <motion.div variants={variants}>
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {cardContent}
        </Link>
      </motion.div>
    ) : (
      <motion.div variants={variants}>{cardContent}</motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <StatCard title="Chreia" count={stats.chreia || 0} icon={<Quote className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/chreia" />
      <StatCard title="Commonplace" count={stats.commonplace || 0} icon={<MessageSquare className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/commonplace" />
      <StatCard title="Comparison" count={stats.comparison || 0} icon={<Scale className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/comparison" />
      <StatCard title="Confirmation" count={stats.confirmation || 0} icon={<CheckSquare className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/confirmation" />
      <StatCard title="Description" count={stats.description || 0} icon={<FileText className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/description" />
      <StatCard title="Encomium" count={stats.encomium || 0} icon={<Award className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/encomium" />
      <StatCard title="Fable" count={stats.fable || 0} icon={<BookMarked className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/fable" />
      <StatCard title="Impersonation" count={stats.impersonation || 0} icon={<User className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/impersonation" />
      <StatCard title="Law Introduction" count={stats["introduction-of-a-law"] || 0} icon={<ScrollText className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/introduction-of-a-law" />
      <StatCard title="Maxim" count={stats.maxim || 0} icon={<BookOpen className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/maxim" />
      <StatCard title="Narrative" count={stats.narrative || 0} icon={<FileSpreadsheet className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/narrative" />
      <StatCard title="Refutation" count={stats.refutation || 0} icon={<XSquare className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/refutation" />
      <StatCard title="Thesis" count={stats.thesis || 0} icon={<HelpCircle className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/thesis" />
      <StatCard title="Vituperation" count={stats.vituperation || 0} icon={<ThumbsDown className="h-6 w-6 text-primary" />} variants={item} href="/progymnasmata/vituperation" />
    </motion.div>
  )
}
