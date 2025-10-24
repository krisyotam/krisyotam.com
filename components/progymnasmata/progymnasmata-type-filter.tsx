"use client"

import { useRouter } from "next/navigation"

interface ProgymnasmataTypeFilterProps {
  types: string[]
  selectedType: string
  onTypeChange: (type: string) => void
}

export function ProgymnasmataTypeFilter({ types, selectedType, onTypeChange }: ProgymnasmataTypeFilterProps) {
  const router = useRouter()

  const handleTypeChange = (type: string) => {
    onTypeChange(type)

    const slug = type.toLowerCase().replace(/\s+/g, "-") // optional: slugify nicely
    router.push(`?type=${slug}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => handleTypeChange(type)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selectedType === type
              ? "bg-[#F5F5F0] text-[#222] dark:bg-zinc-700 dark:text-[#111]"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1A1A1A] dark:text-gray-300 dark:hover:bg-neutral-700"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  )
}
