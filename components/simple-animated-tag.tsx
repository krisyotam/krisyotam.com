"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SimpleAnimatedTagProps {
  text: string
  href?: string
  className?: string
}

export function SimpleAnimatedTag({ text, href, className }: SimpleAnimatedTagProps) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/"

  const handleMouseEnter = () => {
    let iterations = 0

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return text[index]
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join(""),
      )

      if (iterations >= text.length) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
      }

      iterations += 1 / 3
    }, 30)
  }

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setDisplayText(text)
  }

  const TagComponent = href ? Link : "span"
  const tagProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <TagComponent
      {...tagProps}
      className={cn(
        "inline-block px-3 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </TagComponent>
  )
}

