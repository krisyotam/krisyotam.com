"use client"

interface ProgymnasmataTypeFilterProps {
  types: string[]
  selectedType: string
  onTypeChange: (type: string) => void
}

export function ProgymnasmataTypeFilter({ types, selectedType, onTypeChange }: ProgymnasmataTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selectedType === type
              ? "bg-[#F5F5F0] text-[#222] dark:bg-[#EDEDE8] dark:text-[#111]"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1A1A1A] dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  )
}

