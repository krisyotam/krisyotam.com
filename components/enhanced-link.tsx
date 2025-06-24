"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"

interface EnhancedLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  prefetch?: boolean
  skipModal?: boolean
}

export function EnhancedLink({ href, children, className = "", prefetch, skipModal = false }: EnhancedLinkProps) {
  const [isExternal, setIsExternal] = useState(false)

  useEffect(() => {
    // Check if the link is external
    setIsExternal(href.startsWith("http://") || href.startsWith("https://"))
  }, [href])

  // For internal links, use Next.js Link component
  if (!isExternal) {
    return (
      <Link href={href} className={className} prefetch={prefetch}>
        {children}
      </Link>
    )
  }

  // For external links that should skip the modal
  if (skipModal) {
    return (
      <a
        href={href}
        className={`${className} inline-flex items-center`}
        target="_blank"
        rel="noopener noreferrer"
        data-no-modal="true"
      >
        {children}
        <ExternalLink className="ml-1 h-3 w-3" />
      </a>
    )
  }

  // For external links that should use the modal
  return (
    <a href={href} className={`${className} cursor-pointer`}>
      {children}
    </a>
  )
}

