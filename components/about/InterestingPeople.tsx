"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import recommendedBlogsData from "@/data/recommended-blogs.json"

export default function InterestingPeople() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBlog, setSelectedBlog] = useState<any>(null)

  // Get categories from the data
  const categories = ["All", ...Array.from(new Set(recommendedBlogsData.blogs.map((blog) => blog.category)))].sort()

  // Filter blogs based on selected category and search query
  const filteredBlogs = recommendedBlogsData.blogs
    .filter((blog) => selectedCategory === "All" || blog.category === selectedCategory)
    .filter(
      (blog) =>
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.author?.name && blog.author.name.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    
  // Function to download the JSON data
  const handleDownloadJSON = () => {
    // Create a JSON blob with the data
    const jsonBlob = new Blob([JSON.stringify(recommendedBlogsData, null, 2)], { type: 'application/json' });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(jsonBlob);
    
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'interesting-people.json';
    
    // Add the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the temporary URL
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Boxed header section with centered content */}
      <div className="border border-border rounded-md mb-6 overflow-hidden">
        <div className="text-center py-5 px-4">
          <h3 className="text-lg font-semibold text-foreground">Interesting People</h3>
          <p className="text-sm text-muted-foreground mt-1 mx-auto max-w-2xl">
            A curated list of writers, poets, artists, socialites, entrepreneurs, chairmen, politicians, academics,
            scientists, innovators, philosophers, educators, engineers, inventors, historians, activists, and more.
          </p>
          
          {/* Buttons row with matching sizes */}
          <div className="flex justify-center gap-4 mt-4">
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-9 px-4 text-sm"
            >
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {recommendedBlogsData.blogs.length} People
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadJSON}
              className="h-9 px-4 text-sm"
            >
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Download List
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
          <select
            id="category-filter"
            className="border rounded px-2 py-1 text-sm bg-background"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by name, tag, or keyword..." 
            className="w-full px-3 py-1 border rounded text-sm bg-background"
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 text-left font-medium px-3">Name</th>
              <th className="py-2 text-left font-medium px-3">Category</th>
              <th className="py-2 text-left font-medium px-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog, index) => (
              <tr
                key={index}
                className={`border-b border-border hover:bg-secondary/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
              >
                <td className="py-3 px-3">
                  <Link
                    href={blog.url}
                    target="_blank"
                    data-no-preview="true"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {blog.title}
                  </Link>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3">{blog.category}</td>
                <td className="py-3 px-3 text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBlog(blog)}>
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
                      <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30">
                        <DialogTitle className="text-2xl font-serif">{selectedBlog?.title}</DialogTitle>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {selectedBlog?.tags?.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="font-normal text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </DialogHeader>
                      <ScrollArea className="max-h-[70vh] overflow-y-auto p-6">
                        <div className="space-y-5">
                          {/* Description */}
                          <Card className="border-0 shadow-sm overflow-hidden">
                            <CardHeader className="bg-background py-3 px-4 border-b">
                              <CardTitle className="text-base font-medium">About</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 text-sm">
                              <p className="leading-relaxed">{selectedBlog?.description}</p>
                            </CardContent>
                          </Card>

                          {/* Author */}
                          <Card className="border-0 shadow-sm overflow-hidden">
                            <CardHeader className="bg-background py-3 px-4 border-b">
                              <CardTitle className="text-base font-medium">Author</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3 text-sm">
                              <div className="flex items-baseline">
                                <span className="text-muted-foreground w-24">Name:</span>
                                <span className="font-medium">{selectedBlog?.author?.name}</span>
                              </div>
                              <div className="flex items-baseline">
                                <span className="text-muted-foreground w-24">Position:</span>
                                <span>{selectedBlog?.author?.position}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block mb-1.5">Achievements:</span>
                                <ul className="list-disc list-inside pl-1 space-y-1">
                                  {selectedBlog?.author?.achievements?.map(
                                    (achievement: any, index: number) => (
                                      <li key={index} className="leading-tight">{achievement}</li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Highlights */}
                          <Card className="border-0 shadow-sm overflow-hidden">
                            <CardHeader className="bg-background py-3 px-4 border-b">
                              <CardTitle className="text-base font-medium">Highlights</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 text-sm">
                              <ul className="list-disc list-inside pl-1 space-y-1.5">
                                {selectedBlog?.blogHighlights?.map(
                                  (highlight: any, index: number) => (
                                    <li key={index} className="leading-tight">{highlight}</li>
                                  ),
                                )}
                              </ul>
                            </CardContent>
                          </Card>

                          {/* Reader Level */}
                          <Card className="border-0 shadow-sm overflow-hidden">
                            <CardHeader className="bg-background py-3 px-4 border-b">
                              <CardTitle className="text-base font-medium">Reader Level</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 text-sm">
                              <p className="leading-relaxed">{selectedBlog?.readerLevel}</p>
                            </CardContent>
                          </Card>

                          <div className="flex justify-center pt-2 pb-4">
                            <Button asChild>
                              <Link 
                                href={selectedBlog?.url || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2"
                              >
                                <span>Visit Website</span>
                                <svg 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 16 16" 
                                  fill="none" 
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="opacity-80"
                                >
                                  <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M10 2H14V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M6.66669 9.33333L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
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
        {filteredBlogs.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center py-8">
            No matching people found. Try adjusting your search or filter.
          </div>
        )}
      </div>
    </div>
  )
} 