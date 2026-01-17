"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LayoutGrid, ListFilter } from "lucide-react"
import type { CoreSkillsProps, SkillItem, ViewType } from "@/types/content"

const DEFAULT_SKILLS_DATA = {
  skillCategories: [
    {
      id: "math",
      name: "Mathematics",
      color: { bg: "bg-[#E6F2FF]", border: "border-[#B3D9FF]", text: "text-[#4D94FF]", hover: "hover:bg-[#CCE6FF]" },
      skills: ["Calculus", "Linear Algebra", "Statistics", "Probability", "Discrete Math"]
    },
    {
      id: "physics",
      name: "Physics",
      color: { bg: "bg-[#F5E6FF]", border: "border-[#E6CCFF]", text: "text-[#9966CC]", hover: "hover:bg-[#EBD9FF]" },
      skills: ["Mechanics", "Electromagnetism", "Quantum Physics", "Thermodynamics"]
    },
    {
      id: "cs",
      name: "Computer Science",
      color: { bg: "bg-[#E6FFEF]", border: "border-[#B3FFD9]", text: "text-[#33CC85]", hover: "hover:bg-[#CCFFE6]" },
      skills: ["Algorithms", "Data Structures", "Machine Learning", "Software Engineering", "Web Development", "Database Systems"]
    },
    {
      id: "finance",
      name: "Finance",
      color: { bg: "bg-[#E6FFF9]", border: "border-[#B3FFED]", text: "text-[#00CCAA]", hover: "hover:bg-[#CCFFF5]" },
      skills: ["Investment Analysis", "Financial Modeling", "Risk Management", "Portfolio Theory"]
    },
    {
      id: "business",
      name: "Business",
      color: { bg: "bg-[#FFF8E6]", border: "border-[#FFEDB3]", text: "text-[#FFCC66]", hover: "hover:bg-[#FFF2CC]" },
      skills: ["Strategic Planning", "Marketing", "Operations Management", "Entrepreneurship"]
    },
    {
      id: "biology",
      name: "Biology",
      color: { bg: "bg-[#FFEBEB]", border: "border-[#FFCCCC]", text: "text-[#FF8080]", hover: "hover:bg-[#FFD9D9]" },
      skills: ["Molecular Biology", "Genetics", "Ecology", "Physiology"]
    },
    {
      id: "research",
      name: "Research Methods",
      color: { bg: "bg-[#EBE6FF]", border: "border-[#D1CCFF]", text: "text-[#8080FF]", hover: "hover:bg-[#DED9FF]" },
      skills: ["Experimental Design", "Data Analysis", "Scientific Writing", "Literature Review"]
    },
    {
      id: "global",
      name: "Global Studies",
      color: { bg: "bg-[#E6FAFF]", border: "border-[#B3F0FF]", text: "text-[#33CCFF]", hover: "hover:bg-[#CCF5FF]" },
      skills: ["International Relations", "Cultural Studies", "Global Economics", "Geopolitics"]
    },
    {
      id: "philosophy",
      name: "Philosophy",
      color: { bg: "bg-[#FFE6F0]", border: "border-[#FFB3D9]", text: "text-[#FF66A3]", hover: "hover:bg-[#FFCCE6]" },
      skills: ["Ethics", "Logic", "Epistemology", "Metaphysics", "Political Philosophy"]
    }
  ]
}

export default function CoreSkills({ data = DEFAULT_SKILLS_DATA, className }: CoreSkillsProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [viewType, setViewType] = useState<ViewType>("bento")

  // Memoize the skills data to prevent recalculation on re-renders
  const allSkills = useMemo(() => {
    return data.skillCategories.flatMap((category) => {
      return category.skills.map((skill) => ({
        skill,
        categoryId: category.id,
        categoryName: category.name,
        color: category.color,
      }))
    })
  }, [data])

  // Shuffle skills only on client to avoid hydration mismatch
  const [shuffledSkills, setShuffledSkills] = useState<SkillItem[]>([])

  useEffect(() => {
    setShuffledSkills([...allSkills].sort(() => Math.random() - 0.5))
  }, [allSkills])

  // Use useCallback for event handlers to prevent recreation on re-renders
  const handleHover = useCallback((id: string | null) => {
    setHoveredSkill(id)
  }, [])

  const handleViewChange = useCallback((value: string) => {
    setViewType(value as ViewType)
  }, [])

  // Animation constants - these control the timing
  const ANIMATION_DURATION = 0.2 // 1000ms for main animations
  const STAGGER_DELAY = 0.05 // 50ms between each item
  const HOVER_TRANSITION_DURATION = 0.5 // 500ms for hover effects
  const TOOLTIP_DURATION = 0.4 // 400ms for tooltips
  const CATEGORY_STAGGER_DELAY = 0.09 // 200ms between categories

  return (
    <div className={cn("w-full mx-auto", className)}>
      <Card className="overflow-hidden border shadow-md">
        <CardHeader className="border-b bg-muted/30 flex flex-row items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground hidden sm:block">
            View skills by:
          </h3>
          <Tabs defaultValue="bento" className="w-[200px]" onValueChange={handleViewChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bento">
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span>Bento</span>
              </TabsTrigger>
              <TabsTrigger value="category">
                <ListFilter className="h-4 w-4 mr-2" />
                <span>Category</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait" initial={false}>
            {viewType === "bento" ? (
              <motion.div
                key="bento-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: ANIMATION_DURATION }}
                className="flex flex-wrap gap-3 justify-center p-2"
              >
                <div className="w-full text-center mb-2 text-sm text-muted-foreground">
                  Hover over skills to see their category
                </div>
                {shuffledSkills.map((skillItem, index) => (
                  <SkillTag
                    key={`${skillItem.categoryId}-${skillItem.skill}-bento`}
                    skillItem={skillItem}
                    index={index}
                    isHovered={hoveredSkill === `${skillItem.categoryId}-${skillItem.skill}`}
                    onHover={handleHover}
                    animationDuration={ANIMATION_DURATION}
                    staggerDelay={STAGGER_DELAY}
                    hoverTransitionDuration={HOVER_TRANSITION_DURATION}
                    tooltipDuration={TOOLTIP_DURATION}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="category-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: ANIMATION_DURATION }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {data.skillCategories.map((category, categoryIndex) => {
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: ANIMATION_DURATION,
                        delay: categoryIndex * CATEGORY_STAGGER_DELAY,
                      }}
                      className={cn(
                        "rounded-lg border p-4 shadow-sm transition-all duration-300", 
                        "hover:shadow-md hover:translate-y-[-2px]",
                        category.color.border, 
                        category.color.bg
                      )}
                    >
                      <h3 className={cn("font-medium mb-3 text-base", category.color.text)}>
                        {category.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, skillIndex) => {
                          const skillItem = {
                            skill,
                            categoryId: category.id,
                            categoryName: category.name,
                            color: category.color,
                          }

                          return (
                            <SkillTag
                              key={`${category.id}-${skill}-category`}
                              skillItem={skillItem}
                              index={skillIndex}
                              isHovered={hoveredSkill === `${category.id}-${skill}`}
                              onHover={handleHover}
                              showTooltip={false}
                              animationDuration={ANIMATION_DURATION}
                              staggerDelay={STAGGER_DELAY}
                              hoverTransitionDuration={HOVER_TRANSITION_DURATION}
                              tooltipDuration={TOOLTIP_DURATION}
                            />
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

interface SkillTagProps {
  skillItem: SkillItem
  index: number
  isHovered: boolean
  onHover: (id: string | null) => void
  showTooltip?: boolean
  animationDuration: number
  staggerDelay: number
  hoverTransitionDuration: number
  tooltipDuration: number
}

function SkillTag({
  skillItem,
  index,
  isHovered,
  onHover,
  showTooltip = true,
  animationDuration,
  staggerDelay,
  hoverTransitionDuration,
  tooltipDuration,
}: SkillTagProps) {
  const { skill, categoryId, categoryName, color } = skillItem
  const skillId = `${categoryId}-${skill}`

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: animationDuration,
        delay: index * staggerDelay,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: hoverTransitionDuration },
      }}
    >
      <Badge
        variant="outline"
        className={cn(
          "px-3 py-2 text-sm font-medium transition-all cursor-pointer",
          "shadow-sm hover:shadow-md",
          `duration-${hoverTransitionDuration * 1000}`,
          color.text,
          isHovered ? color.bg : "hover:bg-muted",
          isHovered ? color.border : "border-transparent",
        )}
        onMouseEnter={() => onHover(skillId)}
        onMouseLeave={() => onHover(null)}
      >
        {skill}
      </Badge>

      {showTooltip && isHovered && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-popover shadow-md text-xs font-medium whitespace-nowrap z-10 border border-border"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: tooltipDuration }}
        >
          {categoryName}
        </motion.div>
      )}
    </motion.div>
  )
}

