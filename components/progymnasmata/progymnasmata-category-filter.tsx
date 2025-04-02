"use client"

interface ProgymnasmataTypeFilterProps {
  types: string[]
  selectedType: string
  onTypeChange: (type: string) => void
}

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
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selectedCategory === null
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1A1A1A] dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
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

