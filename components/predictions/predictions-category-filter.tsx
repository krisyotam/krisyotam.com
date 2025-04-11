"use client"

interface PredictionsCategoryFilterProps {
  categories?: string[]
  activeCategory?: string
  onCategorySelect?: (category: string) => void
}

export function PredictionsCategoryFilter({
  categories = ["Technology", "Politics", "Economics", "Science", "Health"],
  activeCategory = "All",
  onCategorySelect = () => {},
}: PredictionsCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onCategorySelect("All")}
        className={`px-4 py-2 text-sm transition-colors ${
          "All" === activeCategory
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`px-4 py-2 text-sm transition-colors ${
            category === activeCategory
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
