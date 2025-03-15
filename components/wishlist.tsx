import Image from "next/image"
import Link from "next/link"

interface ProductGridProps {
  items: Array<{
    name: string
    imageUrl: string
    link: string
    category: string
    tags: string[]
  }>
}

export default function ProductGrid({ items }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
      {items.map((product, index) => (
        <Link key={index} href={product.link} passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className="group block">
            <div className="aspect-square bg-gray-100 dark:bg-[#1a1a1a] relative mb-2 rounded-md overflow-hidden transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-[#252525] border border-gray-200 dark:border-gray-800">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            <h3 className="text-sm text-gray-900 dark:text-gray-300 font-normal truncate group-hover:text-gray-700 dark:group-hover:text-gray-100">
              {product.name}
            </h3>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{product.category}</div>
          </a>
        </Link>
      ))}
    </div>
  )
}

