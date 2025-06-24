interface FilmGenresSectionProps {
  genres: Array<{ genre: string; count: number }>
}

export function FilmGenresSection({ genres }: FilmGenresSectionProps) {
  if (!genres || genres.length === 0) {
    return (
      <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full">
        <p className="text-gray-600 dark:text-zinc-400 text-center">No genre data available.</p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] w-full">
      <div className="flex flex-wrap gap-3">
        {genres.slice(0, 12).map((genre) => (
          <div
            key={genre.genre}
            className="rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] text-gray-800 dark:text-zinc-200 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-zinc-700"
          >
            {genre.genre} ({genre.count})
          </div>
        ))}
      </div>
    </div>
  )
}
