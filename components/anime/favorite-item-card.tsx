interface FavoriteItemProps {
  name: string
  photolink: string
  link: string
  aspectRatio?: "portrait" | "square"
}

export function FavoriteItemCard({ name, photolink, link, aspectRatio = "portrait" }: FavoriteItemProps) {
  // Set padding based on aspect ratio
  const paddingClass = aspectRatio === "square" ? "pb-[100%]" : "pb-[140%]"

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      <div className="h-full flex flex-col">
        <div
          className={`relative ${paddingClass} overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}
        >
          <img
            src={photolink || "/placeholder.svg"}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{name}</p>
        </div>
      </div>
    </a>
  )
}

