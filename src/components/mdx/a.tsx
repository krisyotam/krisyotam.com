import { cn } from "@/lib/utils"
import LinkIcon from "@/components/link-icon"

interface AProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  title?: string
  children: React.ReactNode
}

export function A({ href, title, children, className, ...props }: AProps) {
  // Consider links starting with "/" as internal and skip the icon.
  const isInternal = href && (href.startsWith("/") || href.startsWith("#"));

  return (
    <a
      href={href}
      title={title}
      className={cn("text-primary hover:underline", className)}
      {...props}
    >
      {children}
      {!isInternal && <LinkIcon href={href} />}
    </a>
  )
}