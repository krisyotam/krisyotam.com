import { formatDate } from "@/utils/date-formatter"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PostHeaderProps {
  title: string
  date: string
  tags?: string[]
  category?: string
}

export function PostHeader({ title, date, tags, category }: PostHeaderProps) {
  return (
    <header className="mb-16 relative">
      {/* Back to home link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to home
      </Link>

      {/* Decorative element */}
      <div className="absolute left-0 top-12 w-1 h-[calc(100%-3rem)] bg-gradient-to-b from-primary/80 to-primary/20 rounded-full"></div>

      <div className="pl-6">
        {/* Category badge */}
        {category && (
          <Link
            href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-block mb-4 text-xs uppercase tracking-wider font-medium bg-secondary/80 text-secondary-foreground px-3 py-1 rounded-full hover:bg-secondary transition-colors"
          >
            {category}
          </Link>
        )}

        {/* Title with gradient underline */}
        <h1 className="text-4xl font-semibold tracking-tight mb-4 text-foreground relative inline-block">
          {title}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-transparent"></span>
        </h1>

        {/* Date and tags */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-6">
          <time dateTime={typeof date === "string" ? date : undefined} className="font-light flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-primary/20 mr-2"></span>
            {typeof date === "string" ? formatDate(new Date(date)) : date}
          </time>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-muted-foreground/50">•</span>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary/50 text-secondary-foreground px-2 py-1 text-xs rounded-md hover:bg-secondary transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="mt-4 h-px w-full bg-gradient-to-r from-border to-transparent"></div>
    </header>
  )
}

