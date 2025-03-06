import Link from "next/link"
import { memo } from "react"

interface BlogPostProps {
  slug: string
  title: string
  date: string
  excerpt: string
}

export const BlogPost = memo(function BlogPost({ title, date, excerpt, slug }: BlogPostProps) {
  return (
    <article className="group pl-8 max-w-2xl">
      <Link href={`/post/${slug}`} className="block">
        <h2 className="text-xl font-condensed font-normal mb-2 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200 lowercase">
          {title}
        </h2>
        <time className="text-sm font-light text-gray-500 dark:text-gray-400 mb-2 block">{date}</time>
        <p className="text-base font-light text-gray-700 dark:text-gray-300 line-clamp-2 max-w-[calc(100%-8rem)]">
          {excerpt}
        </p>
      </Link>
    </article>
  )
})

