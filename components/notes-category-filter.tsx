"use client"

interface NotesCategoryFilterProps {
  categories: string[]
  activeCategory: string
  onCategorySelect: (category: string) => void
}

export function NotesCategoryFilter({ categories, activeCategory, onCategorySelect }: NotesCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`px-3 py-1 text-sm transition-colors ${
            category === activeCategory
              ? "bg-foreground text-background dark:bg-white dark:text-black font-medium"
              : "bg-background border border-border hover:bg-muted text-foreground dark:text-white"
          }`}
        >
          {category === "all" ? "all categories" : category}
        </button>
      ))}
    </div>
  )
}

