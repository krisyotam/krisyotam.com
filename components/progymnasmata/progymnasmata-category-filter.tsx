"use client"

import { useRouter } from "next/navigation"

interface ProgymCategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function ProgymnasmataCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: ProgymCategoryFilterProps) {
  const router = useRouter()

  const handleCategoryChange = (category: string | null) => {
    onSelectCategory(category)

    if (category) {
      const slug = category.toLowerCase().replace(/\s+/g, "-")
      router.push(`?category=${slug}`)
    } else {
      router.push("/") // back to home if "All" is clicked
    }
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selectedCategory === null
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1A1A1A] dark:text-gray-300 dark:hover:bg-zinc-900"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedCategory === category
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1A1A1A] dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
