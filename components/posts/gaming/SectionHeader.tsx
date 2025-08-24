interface SectionHeaderProps {
  title: string
  count?: number
}

export function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {count !== undefined && (
        <span className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-3 py-1 rounded-full text-sm">
          {count}
        </span>
      )}
    </div>
  )
}
