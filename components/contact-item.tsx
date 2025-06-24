import type { ReactNode } from "react"

interface ContactItemProps {
  icon: ReactNode
  text: string
  href?: string
}

export function ContactItem({ icon, text, href }: ContactItemProps) {
  const content = (
    <div className="flex items-center gap-1.5">
      {icon}
      <span>{text}</span>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className="inline-flex items-center hover:text-foreground"
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    )
  }

  return content
}

