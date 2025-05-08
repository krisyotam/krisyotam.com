import Link from "next/link"

export default function ReferenceNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Reference Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The reference you are looking for could not be found or may have been removed.
      </p>
      <Link href="/references">
        <span className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          ← Back to References
        </span>
      </Link>
    </div>
  )
} 