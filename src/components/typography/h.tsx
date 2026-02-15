"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

function createHeading(
  Tag: "h1" | "h2" | "h3" | "h4",
  baseClass: string,
  displayName: string
) {
  const Component = ({ children, className, id, ...props }: HeadingProps) => {
    const handleClick = () => {
      if (id && typeof window !== "undefined") {
        const url = `${window.location.origin}${window.location.pathname}#${id}`
        navigator.clipboard.writeText(url)
      }
    }

    return (
      <Tag
        id={id}
        className={cn(
          baseClass,
          id && "cursor-pointer hover:opacity-70 transition-opacity",
          className
        )}
        onClick={id ? handleClick : undefined}
        title={id ? "Click to copy link" : undefined}
        {...props}
      >
        {children}
      </Tag>
    )
  }

  Component.displayName = displayName
  return Component
}

export const H1 = createHeading(
  "h1",
  "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-8",
  "H1"
)

export const H2 = createHeading(
  "h2",
  "scroll-m-20 text-3xl font-semibold tracking-tight mt-8",
  "H2"
)

export const H3 = createHeading(
  "h3",
  "scroll-m-20 text-2xl font-semibold tracking-tight mt-8",
  "H3"
)

export const H4 = createHeading(
  "h4",
  "scroll-m-20 text-xl font-semibold tracking-tight mt-8",
  "H4"
)
