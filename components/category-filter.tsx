"use client"

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onCategorySelect: (category: string) => void
}

export function CategoryFilter({ categories, activeCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`px-4 py-2 text-sm transition-colors ${
            category === activeCategory
              ? "bg-foreground text-background dark:bg-background dark:text-foreground font-semibold"
              : "bg-muted hover:bg-muted/80 text-foreground dark:text-background"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

