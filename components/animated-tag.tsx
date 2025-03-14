"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAnimation } from "@/contexts/animation-context"

interface AnimatedTagProps {
  text: string
  href?: string
  className?: string
}

export function AnimatedTag({ text, href, className }: AnimatedTagProps) {
  const [displayText, setDisplayText] = useState(text)
  const { isAnyAnimating, setIsAnimating } = useAnimation()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [width, setWidth] = useState<number | null>(null)
  const tagRef = useRef<HTMLSpanElement | null>(null)

  // Store the original width of the tag to prevent layout shifts
  useEffect(() => {
    if (tagRef.current) {
      setWidth(tagRef.current.offsetWidth)
    }
  }, [text])

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/"

  const handleMouseEnter = () => {
    // Only start animation if no other animation is running
    if (isAnyAnimating) return

    setIsAnimating(true)

    let iterations = 0
    intervalRef.current = setInterval(() => {
      setDisplayText((prevText) =>
        prevText
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
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        setIsAnimating(false)
      }
    }
  }, [setIsAnimating])

  const TagComponent = href ? Link : "span"
  const tagProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {}

  const style = width ? { minWidth: `${width}px` } : {}

  return (
    <TagComponent
      {...tagProps}
      className={cn(
        "inline-block px-3 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <span ref={tagRef}>{displayText}</span>
    </TagComponent>
  )
}

