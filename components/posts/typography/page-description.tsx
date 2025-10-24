"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PageDescriptionProps {
  title: string
  description: string
  className?: string
}

export function PageDescription({ title, description, className }: PageDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 rounded-none shadow-md hover:shadow-lg transition-shadow duration-200 z-40"
        onClick={() => setIsOpen(true)}
        aria-label="Page description"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      
      {/* Bento-style Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "fixed bottom-4 left-4 z-50 w-80 md:w-96",
                "border border-border rounded-none shadow-lg",
                "bg-card text-card-foreground",
                className
              )}
            >
              {/* Modal Header with Title */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="text-lg font-serif tracking-tight leading-none">
                  {title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Modal Body with Description */}
              <div className="p-4">
                <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default PageDescription
