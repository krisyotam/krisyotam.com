"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CustomSelect } from "@/components/ui/custom-select"

const RECOMMENDED_BLOGS_DATA = {
  blogs: [
    {
      title: "Terrance Tao",
      tags: ["Expository Papers", "Research Mathematics", "Open Problems"],
      url: "https://terrytao.wordpress.com/",
      description: "Terrance Tao's blog covers a wide range of mathematical topics, from expository papers to cutting-edge research and open problems in mathematics.",
      category: "Mathematics",
      author: {
        name: "Terrance Tao",
        position: "Professor of Mathematics at UCLA",
        achievements: ["Fields Medal (2006)", "Breakthrough Prize in Mathematics (2014)", "MacArthur Fellowship (2006)"],
        researchAreas: ["Harmonic Analysis", "Partial Differential Equations", "Combinatorics", "Number Theory"]
      },
      blogHighlights: ["In-depth discussions on mathematical proofs", "Explanations of complex mathematical concepts", "Updates on recent developments in mathematics"],
      readerLevel: "Advanced undergraduate to professional mathematicians"
    },
    {
      title: "Matt Might",
      tags: ["Computer Science", "Machine Learning", "Biomedical Sciences"],
      url: "https://matt.might.net/#blog",
      description: "Matt Might's blog explores various aspects of computer science, machine learning, and their applications in biomedical sciences.",
      category: "Computer Science",
      author: {
        name: "Matt Might",
        position: "Professor of Internal Medicine and Computer Science at the University of Alabama at Birmingham",
        achievements: ["CAREER Award from the National Science Foundation", "Young Faculty Award from DARPA"],
        researchAreas: ["Programming Languages", "Static Analysis", "Precision Medicine", "Rare Disease"]
      },
      blogHighlights: ["Practical advice for graduate students and researchers", "Insights into the intersection of computer science and medicine", "Explanations of complex computer science concepts"],
      readerLevel: "Computer science students, researchers, and professionals"
    },
    {
      title: "Christopher Perrin",
      tags: ["Classical Education", "Technology", "Society"],
      url: "https://christopherperrin.substack.com/",
      description: "Christopher Perrin's blog focuses on renewing classical education principles and their intersection with modern technology and society.",
      category: "Education",
      author: {
        name: "Christopher Perrin",
        position: "Publisher and CEO of Classical Academic Press",
        achievements: ["Author of multiple books on classical education", "Consultant and speaker on classical education"],
        expertise: ["Classical Education Philosophy", "Curriculum Development", "School Leadership"]
      },
      blogHighlights: ["Analysis of classical education principles in modern context", "Discussions on the role of technology in classical education", "Insights into societal impacts on education"],
      readerLevel: "Educators, school leaders, and parents interested in classical education"
    },
    {
      title: "Maria Tatar",
      tags: ["Folklore", "Fairy Tales", "Mythology"],
      url: "https://example.com/maria-tatar-blog",
      description: "Maria Tatar explores the rich world of folklore, fairy tales, and mythology, offering insights into their cultural significance and enduring appeal.",
      category: "Literature",
      author: {
        name: "Maria Tatar",
        position: "Professor of Folklore and Mythology at Harvard University",
        achievements: ["Distinguished research on fairy tales and folklore", "Author of numerous books on folklore and children's literature"],
        researchAreas: ["Fairy Tales", "Folklore", "Children's Literature", "Cultural Studies"]
      },
      blogHighlights: ["Analysis of classic and contemporary fairy tales", "Exploration of folklore's role in modern society", "Discussions on the psychological aspects of myths and legends"],
      readerLevel: "Literature enthusiasts, folklorists, and students of cultural studies"
    },
    {
      title: "Sara Taglialagamba",
      tags: ["Art History", "Renaissance", "Leonardo da Vinci"],
      url: "https://example.com/sara-taglialagamba-blog",
      description: "Sara Taglialagamba delves into the life, works, and legacy of Leonardo da Vinci, offering expert insights into Renaissance art and science.",
      category: "Art History",
      author: {
        name: "Sara Taglialagamba",
        position: "Scholar at the Leonardo da Vinci Museum in Florence, Italy",
        achievements: ["Expert on Leonardo da Vinci", "Curator of numerous exhibitions on Renaissance art"],
        researchAreas: ["Renaissance Art", "Leonardo da Vinci", "Art and Science in the Renaissance"]
      },
      blogHighlights: ["In-depth analysis of da Vinci's artworks and inventions", "Exploration of Renaissance art techniques and innovations", "Discussions on the intersection of art and science in da Vinci's work"],
      readerLevel: "Art history enthusiasts, Renaissance scholars, and students of interdisciplinary studies"
    },
    {
      title: "Irving Finkel",
      tags: ["Assyriology", "Ancient Languages", "Archaeology"],
      url: "https://example.com/irving-finkel-blog",
      description: "Irving Finkel unravels the mysteries of ancient Mesopotamian languages and artifacts, offering fascinating insights into one of the world's oldest civilizations.",
      category: "Ancient History",
      author: {
        name: "Irving Finkel",
        position: "Curator at the British Museum",
        achievements: ["Expert in ancient Mesopotamian languages", "Author of books on cuneiform and Mesopotamian culture"],
        researchAreas: ["Assyriology", "Cuneiform", "Ancient Near Eastern History"]
      },
      blogHighlights: ["Decipherment of ancient texts and inscriptions", "Exploration of Mesopotamian myths and legends", "Insights into the daily life of ancient Mesopotamians"],
      readerLevel: "History enthusiasts, archaeologists, and students of ancient civilizations"
    },
    {
      title: "Jim Al-Khalili",
      tags: ["Physics", "Quantum Mechanics", "Science Communication"],
      url: "https://example.com/jim-al-khalili-blog",
      description: "Jim Al-Khalili explores the fascinating world of theoretical physics, quantum mechanics, and the latest developments in scientific research.",
      category: "Physics",
      author: {
        name: "Jim Al-Khalili",
        position: "Distinguished Emeritus Professor of Physics at the University of Surrey",
        achievements: ["Renowned physicist and science communicator", "Author of popular science books", "Presenter of science documentaries"],
        researchAreas: ["Nuclear Physics", "Quantum Mechanics", "Science Communication"]
      },
      blogHighlights: ["Explanations of complex physics concepts for a general audience", "Updates on cutting-edge research in quantum physics", "Reflections on the role of science in society"],
      readerLevel: "Science enthusiasts, students, and anyone interested in modern physics"
    },
    {
      title: "Laura Ashe",
      tags: ["Medieval Literature", "History", "Culture"],
      url: "https://example.com/laura-ashe-blog",
      description: "Laura Ashe offers insightful perspectives on medieval literature, history, and culture, focusing on England and its neighbors from the 10th to the 17th century.",
      category: "Medieval Studies",
      author: {
        name: "Laura Ashe",
        position: "Professor of English Literature at the University of Oxford",
        achievements: ["Expert in medieval literature and history", "Author of books on medieval English culture"],
        researchAreas: ["Medieval Literature", "Medieval History", "Cultural Studies"]
      },
      blogHighlights: ["Analysis of medieval texts and their historical context", "Explorations of medieval society and culture", "Discussions on the relevance of medieval studies today"],
      readerLevel: "Literature students, historians, and medieval enthusiasts"
    }
  ]
}

export default function InterestingPeople() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedBlog, setSelectedBlog] = useState<any>(null)
  const [page, setPage] = useState<number>(1)
  const pageSize = 7

  // Get categories from the data
  const categories = ["All", ...Array.from(new Set(RECOMMENDED_BLOGS_DATA.blogs.map((blog) => blog.category)))].sort()

  // Filter blogs based on selected category and search query
  const filteredBlogs = RECOMMENDED_BLOGS_DATA.blogs
    .filter((blog) => selectedCategory === "All" || blog.category === selectedCategory)
    .filter(
      (blog) =>
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.author?.name && blog.author.name.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Reset to page 1 when filters change
  
    
  // Function to download the JSON data
  const handleDownloadJSON = () => {
    const jsonBlob = new Blob([JSON.stringify(RECOMMENDED_BLOGS_DATA, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'interesting-people.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Boxed header section with centered content - square corners */}
      <div className="border border-border mb-6 overflow-hidden">
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
                {RECOMMENDED_BLOGS_DATA.blogs.length} People
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
          <CustomSelect
            id="category-filter"
            value={selectedCategory}
            onValueChange={(val) => setSelectedCategory(val)}
            options={categories.map((c) => ({ value: c, label: c }))}
            className="text-sm min-w-[160px]"
          />
        </div>
        
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by name, tag, or keyword..." 
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
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
            {paginatedBlogs.map((blog, index) => (
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
        {/* Pagination */}
        {filteredBlogs.length > pageSize && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              className="h-9 px-3 border border-border bg-background text-sm rounded-none hover:bg-secondary/50 disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`h-9 w-9 border border-border text-sm rounded-none ${p === currentPage ? 'bg-secondary/50' : 'bg-background hover:bg-secondary/50'}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="h-9 px-3 border border-border bg-background text-sm rounded-none hover:bg-secondary/50 disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
        {filteredBlogs.length === 0 && (
          <div className="text-muted-foreground text-sm mt-6 text-center py-8">
            No matching people found. Try adjusting your search or filter.
          </div>
        )}
      </div>
    </div>
  )
}