import Link from "next/link"
import type { ReactNode } from "react"

interface AProps {
  href: string
  children: ReactNode
  className?: string
}

export function A({ href, children, className = "" }: AProps) {
  const isExternal = href.startsWith("http")

  const classes = `
    border-b
    border-gray-300
    hover:border-gray-600
    dark:border-gray-500
    dark:hover:border-white
    transition-[border-color]
    ${className}
  `

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

