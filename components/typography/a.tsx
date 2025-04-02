import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface AProps {
  href: string
  children: ReactNode
  className?: string
  isInternal?: boolean
}

export function A({ href, children, className = "", isInternal = false }: AProps) {
  // Check if the link is external
  const isExternal = href.startsWith("http") || href.startsWith("//")
  
  // Determine if we should treat it as an internal navigation link
  const shouldUseInternalStyle = isInternal || (!isExternal && href.startsWith("/"))

  // External links: open in new tab
  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(
          "border-b border-dotted border-gray-500 hover:border-gray-900 dark:border-gray-500 dark:hover:border-white transition-colors inline-flex items-center wiki-external-link",
          className
        )}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()} // Prevent handler from intercepting
      >
        {children}
        <ExternalLink className="ml-0.5 h-3 w-3 text-gray-400 inline-flex" />
      </a>
    )
  }

  // Internal navigation links: regular navigation
  if (shouldUseInternalStyle) {
    return (
      <a
        href={href}
        className={cn(
          "text-primary/80 hover:text-primary transition-colors",
          "border-b border-primary/30 hover:border-primary/60 wiki-internal-link",
          className
        )}
        onClick={(e) => e.stopPropagation()} // Prevent handler from intercepting
      >
        {children}
      </a>
    )
  }

  // Other links: allow modal behavior from handler
  return (
    <a
      href={href}
      className={cn(
        "border-b border-dotted border-gray-500 hover:border-gray-900 dark:border-gray-500 dark:hover:border-white transition-colors wiki-modal-link",
        className
      )}
    >
      {children}
    </a>
  )
}