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
            <div className="aspect-square bg-gray-100 relative mb-2">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            </div>
            <h3 className="text-sm text-gray-900 font-normal truncate">{product.name}</h3>
          </a>
        </Link>
      ))}
    </div>
  )
}
