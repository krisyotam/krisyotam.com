"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import recommendedBlogsData from "@/data/recommended-blogs.json"

export default function InterestingPeople() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBlog, setSelectedBlog] = useState<any>(null)

  // Memoize the categories array
  const categories = ["All", ...Array.from(new Set(recommendedBlogsData.blogs.map((blog) => blog.category)))]

  // Memoize the filtered blogs
  const filteredBlogs = recommendedBlogsData.blogs
    .filter((blog) => selectedCategory === "All" || blog.category === selectedCategory)
    .filter(
      (blog) =>
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.author?.name && blog.author.name.toLowerCase().includes(searchQuery.toLowerCase())),
    )

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-foreground">Interesting People</h3>
      <p className="text-sm text-foreground pb-4">
        A curated list of writers, poets, artists, socialites, entrepreneurs, chairmen, politicians, academics,
        scientists, innovators, philosophers, educators, engineers, inventors, historians, activists, and more.
        People you should get to know.
      </p>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by name, tag, or keyword..."
          className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery("")}
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "secondary"}
            className={`transition-colors hover:bg-primary ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {filteredBlogs.map((blog, index) => (
              <tr
                key={index}
                className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                <td className="py-4 pr-4">
                  <Link
                    href={blog.url}
                    target="_blank"
                    data-no-preview="true"
                    rel="noopener noreferrer"
                    className="block hover:text-gray-400 transition-colors"
                  >
                    <span className="text-base font-normal text-foreground">{blog.title}</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {blog.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </td>
                <td className="py-4 pl-4 text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedBlog(blog)}>
                        More Info
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{selectedBlog?.title}</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
                        <div className="space-y-6">
                          <Card>
                            <CardContent className="p-4">
                              <h3 className="text-lg font-semibold mb-2">Description</h3>
                              <p>{selectedBlog?.description}</p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <h3 className="text-lg font-semibold mb-2">Author Details</h3>
                              <p>
                                <strong>Name:</strong> {selectedBlog?.author?.name}
                              </p>
                              <p>
                                <strong>Position:</strong> {selectedBlog?.author?.position}
                              </p>
                              <div className="mt-2">
                                <strong>Achievements:</strong>
                                <ul className="list-disc list-inside">
                                  {selectedBlog?.author?.achievements?.map(
                                    (achievement: any, index: number) => (
                                      <li key={index}>{achievement}</li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <h3 className="text-lg font-semibold mb-2">Blog Highlights</h3>
                              <ul className="list-disc list-inside">
                                {selectedBlog?.blogHighlights?.map(
                                  (highlight: any, index: number) => (
                                    <li key={index}>{highlight}</li>
                                  ),
                                )}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <h3 className="text-lg font-semibold mb-2">Reader Level</h3>
                              <p>{selectedBlog?.readerLevel}</p>
                            </CardContent>
                          </Card>

                          <div className="flex justify-center">
                            <Button asChild>
                              <Link href={selectedBlog?.url || "#"} target="_blank" rel="noopener noreferrer">
                                Visit Blog
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 