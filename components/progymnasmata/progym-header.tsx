"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ProgymHeaderProps {
  title?: string
  category?: string
  date?: string
}

export function ProgymHeader({ title, category, date }: ProgymHeaderProps) {
  const pathname = usePathname()
  const isWorkPage = pathname.includes("/works/")

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 mb-8">
      <div className="py-6">
        {isWorkPage && title ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                href="/progymnasmata"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                ← Back to Progymnasmata
              </Link>
              {date && (
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
            {category && (
              <div className="inline-block px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                {category}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  )
}

