"use client"

import { useState, useEffect, useRef } from "react"
import rulesData from "@/data/rules-of-the-internet.json"
import { Input } from "@/components/ui/input"
import { useInView } from "react-intersection-observer"
import { Info } from "lucide-react"

type RuleItem = {
  rule: number | string
  text: string
  explanation: string
}

export function RulesOfTheInternetClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRules, setFilteredRules] = useState<RuleItem[]>(rulesData)
  const [displayCount, setDisplayCount] = useState(50)
  const [openTooltip, setOpenTooltip] = useState<string | null>(null)
  const tooltipRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  })

  // Handle clicking outside to close tooltip
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openTooltip) {
        const tooltipElement = tooltipRefs.current[openTooltip]
        if (tooltipElement && !tooltipElement.contains(event.target as Node)) {
          setOpenTooltip(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openTooltip])

  // Filter rules based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRules(rulesData)
      setDisplayCount(50) // Reset display count when search query changes
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = rulesData.filter((item) => {
      return (
        item.text.toLowerCase().includes(query) ||
        item.explanation.toLowerCase().includes(query) ||
        item.rule.toString().includes(query)
      )
    })

    setFilteredRules(filtered)
    setDisplayCount(50) // Reset display count when search query changes
  }, [searchQuery])

  // Infinite scroll - load more items when the user scrolls to the bottom
  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => {
        const newCount = prevCount + 50
        return Math.min(newCount, filteredRules.length)
      })
    }
  }, [inView, filteredRules.length])
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
  }

  function toggleTooltip(ruleKey: string) {
    setOpenTooltip(openTooltip === ruleKey ? null : ruleKey)
  }

  // Display only the specified number of items
  const itemsToDisplay = filteredRules.slice(0, displayCount)
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by rule number, text, or explanation..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-md w-full"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {displayCount < filteredRules.length ? displayCount : filteredRules.length} of {filteredRules.length} rules
        </div>
      </div>

      <div className="border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 px-3 text-left font-medium w-20">Rule #</th>
              <th className="py-2 px-3 text-left font-medium">Rule</th>
              <th className="py-2 px-3 text-center font-medium w-16">Info</th>
            </tr>
          </thead>
          <tbody>
            {itemsToDisplay.map((item, index) => {
              const ruleKey = `${item.rule}-${index}`
              const isTooltipOpen = openTooltip === ruleKey
              
              return (
                <tr 
                  key={ruleKey} 
                  className={`border-b border-border hover:bg-secondary/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
                >
                  <td className="py-3 px-3 align-top font-medium text-primary">
                    {item.rule}
                  </td>
                  <td className="py-3 px-3 align-top leading-relaxed">
                    {item.text}
                  </td>
                  <td className="py-3 px-3 align-top text-center relative">
                    {item.explanation ? (
                      <div 
                        ref={(el) => { tooltipRefs.current[ruleKey] = el }}
                        className="relative inline-block"
                      >
                        <button 
                          onClick={() => toggleTooltip(ruleKey)}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          <Info className="w-3.5 h-3.5 text-primary" />
                        </button>
                        
                        {isTooltipOpen && (
                          <div className="absolute right-0 top-8 z-50 w-80 p-3 text-sm leading-relaxed bg-popover border border-border shadow-lg rounded-md">
                            <div className="space-y-1">
                              <div className="font-medium text-foreground">Rule {item.rule}</div>
                              <div className="text-muted-foreground">{item.explanation}</div>
                            </div>
                            {/* Arrow pointer */}
                            <div className="absolute -top-1 right-2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {filteredRules.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-muted-foreground">
                  No rules found for your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Intersection observer target - when this is visible, load more rows */}
      {filteredRules.length > displayCount && (
        <div ref={ref} className="h-10 flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  )
}
