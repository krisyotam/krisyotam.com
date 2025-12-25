"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import LinkIcon from "@/components/link-icon"

interface EnhancedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
  prefetch?: boolean
  skipModal?: boolean
}

export function EnhancedLink({ href, children, className = "", prefetch, skipModal = false, ...rest }: EnhancedLinkProps) {
  const [isExternal, setIsExternal] = useState(false)

  useEffect(() => {
    // Check if the link is external
    setIsExternal(href.startsWith("http://") || href.startsWith("https://"))
  }, [href])

  // For internal links, use Next.js Link component
  if (!isExternal) {
    return (
      <Link href={href} className={className} prefetch={prefetch} {...(rest as any)}>
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
        {...rest}
      >
        {children}
        <LinkIcon href={href} className="ml-1" />
      </a>
    )
  }

  // For external links that should use the modal
  return (
    <a href={href} className={`${className} cursor-pointer`} {...rest}>
      {children}
      <LinkIcon href={href} className="ml-1" />
    </a>
  )
}

