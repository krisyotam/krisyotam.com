"use client"

import { useEffect, useState, useRef } from "react"
import { PageHeader } from "@/components/page-header"
import supportersData from "@/data/supporters.json"
import { cn } from "@/lib/utils"

export default function SupportersPage() {
  const [supporters, setSupporters] = useState(supportersData.supporters)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollMode, setScrollMode] = useState<'auto' | 'manual'>('auto')
  const containerRef = useRef<HTMLDivElement>(null)
  const creditsRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)
  const currentDate = new Date().toISOString()
  
  // Set up auto-scrolling
  useEffect(() => {
    // Duplicate the supporters to create a seamless loop
    setSupporters([...supportersData.supporters, ...supportersData.supporters])
    
    const scrollSpeed = 30 // pixels per second
    
    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp
      }
      
      const elapsed = timestamp - lastTimestampRef.current
      const pixelsToScroll = (scrollSpeed * elapsed) / 1000
      
      setScrollPosition(prevPosition => {
        const newPosition = prevPosition + pixelsToScroll
        
        // Reset position when we've scrolled through the first set of supporters
        if (creditsRef.current && containerRef.current) {
          const halfHeight = creditsRef.current.scrollHeight / 2
          if (newPosition >= halfHeight) {
            return 0
          }
        }
        
        return newPosition
      })
      
      lastTimestampRef.current = timestamp
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Only auto-scroll when in auto mode
    if (scrollMode === 'auto') {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      // Cancel any existing animation when in manual mode
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        lastTimestampRef.current = null
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [scrollMode]) // Re-run when scrollMode changes
  
  // Handle manual scrolling
  const handleManualScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (scrollMode === 'manual' && containerRef.current) {
      setScrollPosition(containerRef.current.scrollTop)
    }
  }
  
  // Toggle between auto and manual scrolling
  const toggleScrollMode = (mode: 'auto' | 'manual') => {
    setScrollMode(mode)
    
    if (mode === 'manual' && containerRef.current && creditsRef.current) {
      // Reset position when switching to manual
      containerRef.current.scrollTop = scrollPosition
    }
  }
  
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <PageHeader 
          title="Supporters" 
          subtitle="With gratitude to those who've contributed to this work" 
          date={currentDate}
          preview="This project wouldn't be possible without the contributions, both large and small, from the following individuals."
          status="Finished"
          confidence="certain"
          importance={9}
        />
        
        {/* Scrolling controls */}
        <div className="flex justify-center space-x-2 mb-4 mt-12">
          <button
            onClick={() => toggleScrollMode('auto')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md border transition-colors",
              scrollMode === 'auto'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
            )}
          >
            Auto Scroll
          </button>
          <button
            onClick={() => toggleScrollMode('manual')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md border transition-colors",
              scrollMode === 'manual'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
            )}
          >
            Manual Scroll
          </button>
        </div>
        
        <div 
          ref={containerRef} 
          className={cn(
            "mt-4 h-[600px] border border-border rounded-md bg-card shadow-sm",
            scrollMode === 'auto' ? "overflow-hidden" : "overflow-y-auto"
          )}
          onScroll={handleManualScroll}
        >
          <div 
            ref={creditsRef}
            className="pt-10"
            style={{ 
              transform: scrollMode === 'auto' ? `translateY(calc(-${scrollPosition}px))` : 'none'
            }}
          >
            <div className="text-center px-4 pb-10">
              <h2 className="text-xl font-bold mb-2">Contributors</h2>
              <p className="text-sm text-muted-foreground">Listed in no particular order</p>
            </div>
            
            {supporters.map((supporter, index) => (
              <div 
                key={index} 
                className="py-4 text-center border-t border-border first:border-t-0"
              >
                <h3 className="text-lg font-medium">{supporter.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {supporter.contribution}
                </p>
              </div>
            ))}
            
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground">
                And to all the unnamed contributors, thank you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 