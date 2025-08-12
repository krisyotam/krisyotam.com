"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Global state to track if any tag is currently animating
let isGlobalAnimating = false

interface AnimatedTagV2Props {
  text: string
  href?: string
  className?: string
}

export function AnimatedTagV2({ text, href, className }: AnimatedTagV2Props) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/"

  const handleMouseEnter = () => {
    // Only start animation if no other animation is running
    if (isGlobalAnimating) return

    isGlobalAnimating = true
    setIsAnimating(true)

    let iterations = 0
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
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setDisplayText(text)
        setIsAnimating(false)
        isGlobalAnimating = false
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
    setIsAnimating(false)
    isGlobalAnimating = false
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        isGlobalAnimating = false
      }
    }
  }, [])

  const commonProps = {
    className: cn(
      "inline-block px-3 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors",
      className,
    ),
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {displayText}
      </Link>
    );
  }

  return (
    <span {...commonProps}>
      {displayText}
    </span>
  );
}

