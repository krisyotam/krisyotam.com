import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

interface InternalLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function InternalLink({ href, children, className = "" }: InternalLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center relative text-primary/90 hover:text-primary transition-colors",
        "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary/30 after:scale-x-100",
        "hover:after:bg-primary/60 after:transition-all",
        className,
      )}
      data-internal-link="true"
      data-no-modal="true"
    >
      {children}
      <ArrowUpRight className="ml-0.5 h-3 w-3 text-primary/70 inline-flex" />
    </a>
  )
}

