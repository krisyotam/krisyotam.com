"use client"

interface GenreFilterProps {
  genres: string[]
  selectedGenre: string | null
  onSelectGenre: (genre: string | null) => void
}

export default function GenreFilter({ genres, selectedGenre, onSelectGenre }: GenreFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectGenre(null)}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            selectedGenre === null
              ? "bg-gray-900 text-white dark:bg-[#f2f2f2] dark:text-[#121212]"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#1f1f1f] dark:text-[#f2f2f2] dark:hover:bg-[#333333]"
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              selectedGenre === genre
                ? "bg-gray-900 text-white dark:bg-[#f2f2f2] dark:text-[#121212]"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#1f1f1f] dark:text-[#f2f2f2] dark:hover:bg-[#333333]"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

