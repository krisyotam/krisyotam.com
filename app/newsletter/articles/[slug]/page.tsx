import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import newsletters from "@/data/newsletters.json"
import type { Metadata } from "next"
import { remark } from "remark"
import html from "remark-html"

interface NewsletterPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: NewsletterPageProps): Promise<Metadata> {
  const newsletter = newsletters.find((n) => n.id === params.slug)

  if (!newsletter) {
    return {
      title: "Newsletter Not Found",
    }
  }

  return {
    title: newsletter.title,
    description: newsletter.description,
  }
}

export async function generateStaticParams() {
  return newsletters.map((newsletter) => ({
    slug: newsletter.id,
  }))
}

// Process markdown to HTML
async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

export default async function NewsletterArticlePage({ params }: NewsletterPageProps) {
  const { slug } = params
  const newsletter = newsletters.find((n) => n.id === slug)

  if (!newsletter) {
    notFound()
  }

  // Format date from MM-DD-YY to Month DD, YYYY
  const formatDate = (dateStr: string) => {
    const [month, day, year] = dateStr.split("-")
    const date = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  // Read markdown content
  let contentHtml = ""
  try {
    const filePath = path.join(process.cwd(), "app/newsletter/articles", `${slug}.md`)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8")
      // Remove frontmatter if exists
      const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, "")
      contentHtml = await markdownToHtml(contentWithoutFrontmatter)
    }
  } catch (error) {
    console.error(`Error reading markdown file for ${slug}:`, error)
  }

  // If no content, use a placeholder with image
  if (!contentHtml) {
    contentHtml = `
      <p>${newsletter.description}</p>
      <img src="/placeholder.svg?height=400&width=800" alt="Newsletter image placeholder" class="my-8 rounded-lg" />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <h2>Key Takeaways</h2>
      <ul>
        <li>First important point from the newsletter</li>
        <li>Second important concept to remember</li>
        <li>Final thought to consider</li>
      </ul>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <img src="/placeholder.svg?height=300&width=600" alt="Second newsletter image placeholder" class="my-8 rounded-lg" />
    `
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/newsletter"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to newsletters
            </Link>
          </div>

          <article className="prose prose-sm dark:prose-invert max-w-none">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{newsletter.title}</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">{formatDate(newsletter.date)}</div>

            <div className="mb-8">
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

              {!contentHtml && (
                <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full content is available on Substack.</p>
                  <Link
                    href={newsletter.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    Read on Substack
                  </Link>
                </div>
              )}
            </div>
          </article>

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/newsletter"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to newsletters
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

