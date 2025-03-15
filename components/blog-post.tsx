import Link from "next/link"
import { memo } from "react"

interface BlogPostProps {
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt: string
  type: "tsx" // Updated to only include "tsx"
}

export const BlogPost = memo(function BlogPost({ title, subtitle, date, excerpt, slug }: BlogPostProps) {
  // IMPORTANT: Make sure the link has a leading slash
  return (
    <article className="group pl-8 max-w-2xl">
      <Link href={`/${slug}`} className="block">
        <h2 className="text-xl font-condensed font-normal mb-2 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200 lowercase">
          {title}
        </h2>
        <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-2 group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-colors duration-200">
          {subtitle && <p className="text-sm font-light text-gray-600 dark:text-gray-300 mb-1 italic">{subtitle}</p>}
          <time className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2 block">{date}</time>
          <p className="text-base font-light text-gray-700 dark:text-gray-300 line-clamp-2 max-w-[calc(100%-8rem)]">
            {excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
})

