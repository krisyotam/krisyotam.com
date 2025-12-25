"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import iconsJson from "@/data/icons/icons.json"

interface IconEntry {
  slug: string
  url: string
}

interface PageDescriptionProps {
  title: string
  description: string
  className?: string
  icons?: IconEntry[]
}

export function PageDescription({ title, description, className, icons }: PageDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 rounded-none shadow-md hover:shadow-lg transition-shadow duration-200 z-40"
        onClick={() => setIsOpen(true)}
        aria-label="Page description"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-50 flex items-center justify-center"
              >
                <div
                  className={cn(
                    "border border-border rounded-none shadow-lg bg-card text-card-foreground",
                    "w-[90%] md:w-[720px] max-h-[90vh] overflow-auto",
                    className
                  )}
                >
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <h3 className="text-lg font-serif tracking-tight leading-none">
                      {title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => setIsExpanded(false)}
                        aria-label="Collapse"
                      >
                        <ArrowUpRight className="h-4 w-4 rotate-45" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => { setIsOpen(false); setIsExpanded(false) }}
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>

                    {Array.isArray(icons) && icons.length > 0 && (
                      <div className="mt-4">
                        <div className="border-t border-border pt-3 flex items-center justify-center">
                          {icons.map((ic: IconEntry, idx: number) => {
                            const found = (iconsJson as any)?.icons?.find((x: any) => x.slug === ic.slug)
                            const src = found ? `/icons/${found.svg}` : `/icons/${ic.slug}.svg`
                            const extra = idx > 0 ? 'pl-4 border-l border-border ml-4' : ''
                            return (
                              <a key={ic.slug} href={ic.url} target="_blank" rel="noopener noreferrer" className={`inline-block p-1 hover:opacity-80 ${extra}`}>
                                <img src={src} alt={ic.slug} className="h-6 w-6 object-contain" />
                              </a>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "fixed bottom-4 left-4 z-50",
                  "w-80 md:w-96 border border-border rounded-none shadow-lg bg-card text-card-foreground",
                  className
                )}
              >
                <div className="flex items-center justify-between border-b border-border p-4">
                  <h3 className="text-lg font-serif tracking-tight leading-none">
                    {title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => setIsExpanded(true)}
                      aria-label="Expand"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => { setIsOpen(false); setIsExpanded(false) }}
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>

                  {Array.isArray(icons) && icons.length > 0 && (
                    <div className="mt-4">
                      <div className="border-t border-border pt-3 flex items-center justify-center">
                        {icons.map((ic: IconEntry, idx: number) => {
                          const found = (iconsJson as any)?.icons?.find((x: any) => x.slug === ic.slug)
                          const src = found ? `/icons/${found.svg}` : `/icons/${ic.slug}.svg`
                          const extra = idx > 0 ? 'pl-4 border-l border-border ml-4' : ''
                          return (
                            <a key={ic.slug} href={ic.url} target="_blank" rel="noopener noreferrer" className={`inline-block p-1 hover:opacity-80 ${extra}`}>
                              <img src={src} alt={ic.slug} className="h-6 w-6 object-contain" />
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default PageDescription
