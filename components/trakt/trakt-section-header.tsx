interface TraktSectionHeaderProps {
  title: string
  count?: number
}

export function TraktSectionHeader({ title, count }: TraktSectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
      <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
      {count !== undefined && (
        <span className="bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 px-2 py-1 rounded-full text-sm">
          {count}
        </span>
      )}
    </div>
  )
}

