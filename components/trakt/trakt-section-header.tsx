interface TraktSectionHeaderProps {
  title: string
  count?: number
}

export function TraktSectionHeader({ title, count }: TraktSectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
      <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
    </div>
  )
}

