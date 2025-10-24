"use client"

import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Hard-coded birthdate: August 5, 2004 at 6:31 PM
const BIRTHDATE = new Date(2004, 7, 5, 18, 31) // Note: Month is 0-indexed (7 = August)

export interface AgeProps {
  format?: "years" | "full" | "mm/dd/yyyy" | "mm/dd/yy" | "age"
  className?: string
}

export function Age({ format = "age", className = "" }: AgeProps) {
  const [age, setAge] = useState<string>("")

  useEffect(() => {
    // Function to calculate and format the age
    const calculateAge = () => {
      const now = new Date()
      
      // Calculate difference in milliseconds
      const diffMs = now.getTime() - BIRTHDATE.getTime()
      
      // Calculate years
      const ageDate = new Date(diffMs)
      const years = Math.abs(ageDate.getUTCFullYear() - 1970)
      
      // Calculate months, days, hours, minutes
      const months = now.getMonth() - BIRTHDATE.getMonth() + (now.getFullYear() - BIRTHDATE.getFullYear()) * 12
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24
      const minutes = Math.floor(diffMs / (1000 * 60)) % 60
      
      // Format the age based on the specified format
      switch (format) {
        case "years":
          return `${years} years`
        case "full":
          return `${years} years, ${months % 12} months, ${days % 30} days`
        case "mm/dd/yyyy":
          return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`
        case "mm/dd/yy":
          return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear().toString().slice(2)}`
        case "age":
        default:
          return `${years}`
      }
    }

    // Calculate initial age
    setAge(calculateAge())
    
    // Update age every minute
    const intervalId = setInterval(() => {
      setAge(calculateAge())
    }, 60000) // Update every minute
    
    return () => clearInterval(intervalId)
  }, [format])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={`underline dotted-underline cursor-help ${className}`}>
          {age}
        </TooltipTrigger>
        <TooltipContent className="bg-popover text-popover-foreground">
          <p>Live calculated age based on birthdate</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}