import type React from "react"
import { Book, FileText, ShoppingBag } from "lucide-react"
import { A } from "@/components/mdx/a"

interface LinkProps {
  href: string
  children: React.ReactNode
  title?: string
}

interface AProps {
  href: string
  title?: string
  children: React.ReactNode
}

export function BookLink({ href, children, title }: LinkProps) {
  return (
    <span className="inline-flex items-center">
      <Book className="inline-block mr-1 h-4 w-4 text-primary" />
      <A href={href} title={title}>
        {children}
      </A>
    </span>
  )
}

export function ArticleLink({ href, children, title }: LinkProps) {
  return (
    <span className="inline-flex items-center">
      <FileText className="inline-block mr-1 h-4 w-4 text-primary" />
      <A href={href} title={title}>
        {children}
      </A>
    </span>
  )
}

export function ItemLink({ href, children, title }: LinkProps) {
  return (
    <span className="inline-flex items-center">
      <ShoppingBag className="inline-block mr-1 h-4 w-4 text-primary" />
      <A href={href} title={title}>
        {children}
      </A>
    </span>
  )
}

export function ExternalLink({ href, title, children }: AProps) {
  return (
    <A href={href} title={title}>
      {children}
    </A>
  )
}

export function InternalLink({ href, title, children }: AProps) {
  return (
    <A href={href} title={title}>
      {children}
    </A>
  )
}

export function AnchorLink({ href, title, children }: AProps) {
  return (
    <A href={href} title={title}>
      {children}
    </A>
  )
}

