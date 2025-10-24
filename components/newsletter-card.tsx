import Link from "next/link"
import Image from "next/image"

interface NewsletterCardProps {
  newsletter: {
    id: string
    title: string
    date: string
    year: string
    description: string
    tags: string[]
    link: string
    image: string
  }
  view: "grid" | "list"
}

export default function NewsletterCard({ newsletter, view }: NewsletterCardProps) {
  const { id, title, date, description, link, image } = newsletter

  // Format date from MM-DD-YY to Month DD, YYYY
  const formatDate = (dateStr: string) => {
    const [month, day, year] = dateStr.split("-")
    const date = new Date(parseInt(`20${year}`), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  if (view === "list") {
    return (
      <div className="w-full border-b border-gray-200 dark:border-gray-800 py-4 first:pt-0 last:border-0">
        <div className="flex flex-col space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</div>
          <h2 className="text-base font-medium tracking-tight hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <Link href={`/newsletter/articles/${id}`}>{title}</Link>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>
          <div className="flex space-x-3 pt-1">
            <Link href={`/newsletter/articles/${id}`} className="text-xs font-medium hover:underline">
              Read Here
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link href={link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:underline">
              Read on Substack
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 h-full">
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
        <Image src={image || "/placeholder.svg?height=160&width=320"} alt={title} fill className="object-cover" />
      </div>
      <div className="flex flex-col flex-1 p-3 space-y-1">
        <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(date)}</div>
        <h2 className="text-base font-medium tracking-tight hover:text-gray-700 dark:hover:text-gray-300 transition-colors line-clamp-2">
          <Link href={`/newsletter/articles/${id}`}>{title}</Link>
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 flex-1 line-clamp-2">{description}</p>
        <div className="flex space-x-3 pt-1">
          <Link href={`/newsletter/articles/${id}`} className="text-xs font-medium hover:underline">
            Read Here
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link href={link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:underline">
            Read on Substack
          </Link>
        </div>
      </div>
    </div>
  )
}

