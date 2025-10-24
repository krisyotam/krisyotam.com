"use client"

interface NewsletterYearFilterProps {
  years: string[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export default function NewsletterYearFilter({ years, selectedYear, onYearChange }: NewsletterYearFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onYearChange("all")}
        className={`px-3 py-1 text-xs rounded-md transition-colors ${
          selectedYear === "all"
            ? "bg-black text-white dark:bg-white dark:text-[#121212]"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        }`}
      >
        All Years
      </button>
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            selectedYear === year
              ? "bg-black text-white dark:bg-white dark:text-[#121212]"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  )
}

