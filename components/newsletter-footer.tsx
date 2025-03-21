import Link from "next/link"

export default function NewsletterFooter() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center text-center space-y-2">
        <Link
          href="https://krisyotam.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
        >
          Subscribe to Newsletter
        </Link>
        <p className="text-xs text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} Kris Yotam</p>
      </div>
    </div>
  )
}

