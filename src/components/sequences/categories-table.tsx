"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Category {
  name: string
  count: number
  slug: string
}

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left pb-4 text-lg font-medium">
              <span className="sr-only">Category</span>
            </th>
            <th className="text-right pb-4 text-lg font-medium">
              <span className="sr-only">Articles</span>
            </th>
            <th className="pb-4"></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.slug} className="group">
              <td className="py-4 pr-4">
                <Link
                  href={`/category/${category.slug}`}
                  className="text-xl font-normal group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200"
                >
                  {category.name}
                </Link>
              </td>
              <td className="py-4 text-right">
                <span className="text-gray-500 dark:text-gray-400 font-light">{category.count}</span>
              </td>
              <td className="py-4 pl-4">
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-block transform transition-transform duration-200 group-hover:translate-x-1"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

