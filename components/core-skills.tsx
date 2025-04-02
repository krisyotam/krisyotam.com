"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LayoutGrid, ListFilter } from "lucide-react"
import defaultSkillsData from "@/data/core-skills.json"
import type { CoreSkillsProps, SkillItem, ViewType } from "@/utils/skills"

export default function CoreSkills({ data = defaultSkillsData, className }: CoreSkillsProps) {
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

  // Memoize the shuffled skills to prevent reshuffling on re-renders
  const shuffledSkills = useMemo(() => {
    return [...allSkills].sort(() => Math.random() - 0.5)
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
    <div className={cn("container mx-auto px-4 py-0", className)}>
      <Card className="overflow-hidden border shadow-md">
        <CardHeader className="border-b bg-muted/30 flex flex-row items-center justify-end">
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
                className="flex flex-wrap gap-3 justify-center"
              >
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
                      className={cn("rounded-lg border p-4", category.color.border, category.color.bg)}
                    >
                      <h3 className={cn("font-medium mb-3", category.color.text)}>{category.name}</h3>
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
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-popover shadow-md text-xs whitespace-nowrap z-10"
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

