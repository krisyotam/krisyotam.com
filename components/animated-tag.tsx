"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

interface AnimatedTagProps {
  text: string
  href?: string
  className?: string
}

export function AnimatedTag({ text, href, className = "" }: AnimatedTagProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const tagRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const frameRef = useRef(0)
  const totalFrames = 10 // Total animation frames
  const [tagWidth, setTagWidth] = useState<number | null>(null)

  // Pre-calculate the width to prevent layout shifts
  useEffect(() => {
    if (tagRef.current) {
      // Create a hidden element to measure the final text width
      const measurer = document.createElement("span")
      measurer.style.visibility = "hidden"
      measurer.style.position = "absolute"
      measurer.style.whiteSpace = "nowrap"
      measurer.style.fontFamily = window.getComputedStyle(tagRef.current).fontFamily
      measurer.style.fontSize = window.getComputedStyle(tagRef.current).fontSize
      measurer.style.fontWeight = window.getComputedStyle(tagRef.current).fontWeight
      measurer.innerText = text
      document.body.appendChild(measurer)

      // Store the width plus padding
      const width = measurer.offsetWidth + 24 // 24px for padding (12px on each side)
      setTagWidth(width)

      // Clean up
      document.body.removeChild(measurer)
    }
  }, [text])

  const handleMouseEnter = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
    setIsAnimating(true)
    frameRef.current = 0
    animateDecryption()
  }

  const handleMouseLeave = () => {
    // Allow the animation to complete even when mouse leaves
    // It will return to the original text at the end
  }

  const animateDecryption = () => {
    if (frameRef.current <= totalFrames) {
      // Calculate how many characters should be scrambled vs. real
      const scrambledCount = Math.floor(((totalFrames - frameRef.current) / totalFrames) * text.length)

      // Create an array of characters from the original text
      const chars = text.split("")

      // Scramble the appropriate number of characters
      for (let i = 0; i < scrambledCount; i++) {
        const randomIndex = Math.floor(Math.random() * text.length)
        chars[randomIndex] = String.fromCharCode(Math.floor(Math.random() * 26) + 97)
      }

      // Update the display text
      setDisplayText(chars.join(""))

      // Increment the frame counter
      frameRef.current++

      // Schedule the next frame
      animationRef.current = setTimeout(animateDecryption, 50) // 50ms per frame
    } else {
      // Animation complete, reset to original text
      setDisplayText(text)
      setIsAnimating(false)
    }
  }

  // Clean up any ongoing animations when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  const TagComponent = (
    <motion.div
      ref={tagRef}
      className={`inline-flex items-center justify-center px-3 py-1 rounded-md bg-secondary dark:bg-secondary text-foreground dark:text-foreground text-sm font-medium transition-colors hover:bg-secondary/80 dark:hover:bg-secondary/80 ${className}`}
      style={{
        width: tagWidth ? `${tagWidth}px` : "auto",
        minWidth: tagWidth ? `${tagWidth}px` : "auto",
        maxWidth: tagWidth ? `${tagWidth}px` : "auto",
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum"',
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </motion.div>
  )

  if (href) {
    return href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="no-underline">
        {TagComponent}
      </a>
    ) : (
      <Link href={href} className="no-underline">
        {TagComponent}
      </Link>
    )
  }

  return TagComponent
}

