import { cn } from "@/lib/utils"

interface AProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  title?: string
  children: React.ReactNode
}

export function A({ href, title, children, className, ...props }: AProps) {
  return (
    <a
      href={href}
      title={title}
      className={cn("text-primary hover:underline", className)}
      {...props}
    >
      {children}
    </a>
  )
} 