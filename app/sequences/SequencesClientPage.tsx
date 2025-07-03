"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { PageDescription } from "@/components/posts/typography/page-description";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";

/* default page-level metadata for the header */
const defaultSequencesPageData = {
  title: "Sequences",
  subtitle: "Structured Learning Paths",
  date: new Date().toISOString(),
  preview: "Curated collections of posts organized into coherent learning sequences covering philosophy, science, and rationality.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
};

interface SequencePost {
  slug: string;
  order: number;
}

interface Sequence {
  slug: string;
  title: string;
  preview: string;
  date: string;
  "cover-url": string;
  "show-status": string;
  status: string;
  confidence: string;
  importance: number;
  posts: SequencePost[];
}

interface SequencesClientPageProps {
  initialCategory?: string;
}

async function fetchSequences(): Promise<Sequence[]> {
  try {
    const response = await fetch('/api/sequences');
    if (!response.ok) throw new Error('Failed to fetch sequences');
    const data = await response.json();
    return Array.isArray(data.sequences) ? data.sequences : [];
  } catch (error) {
    console.error('Error fetching sequences:', error);
    return [];
  }
}

async function fetchCategories(): Promise<any[]> {
  try {
    const response = await fetch('/api/sequences/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return Array.isArray(data.categories) ? data.categories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function fetchTags(): Promise<any[]> {
  try {
    const response = await fetch('/api/sequences/tags');
    if (!response.ok) throw new Error('Failed to fetch tags');
    const data = await response.json();
    return Array.isArray(data.tags) ? data.tags : [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export default function SequencesClientPage({ initialCategory = "all" }: SequencesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSequence, setActiveSequence] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Update activeSequence when initialCategory changes
  useEffect(() => {
    setActiveSequence(initialCategory);
  }, [initialCategory]);

  // Get the current sequence if we're on a specific sequence page
  const currentSequence = sequences.find(seq => seq.slug === activeSequence);

  // Get header data - use sequence data if viewing a specific sequence
  const getHeaderData = () => {
    if (currentSequence) {
      return {
        title: currentSequence.title,
        subtitle: "Sequence",
        date: currentSequence.date,
        preview: currentSequence.preview,
        status: currentSequence.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished" | "Planned",
        confidence: currentSequence.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: currentSequence.importance
      };
    }
    
    return defaultSequencesPageData;
  };

  const headerData = getHeaderData();
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [sequencesData, categoriesData, tagsData] = await Promise.all([
          fetchSequences(),
          fetchCategories(),
          fetchTags()
        ]);
        
        setSequences(sequencesData);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Create sequence options for dropdown
  const sequenceOptions: SelectOption[] = [
    { value: "all", label: "All Sequences" },
    ...sequences.map(sequence => ({
      value: sequence.slug,
      label: sequence.title
    }))
  ];

  // Filter sequences based on search query and active sequence
  const filteredSequences = sequences.filter((sequence) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      sequence.title.toLowerCase().includes(q) ||
      sequence.preview.toLowerCase().includes(q);

    const matchesSequence = activeSequence === "all" || sequence.slug === activeSequence;
    return matchesSearch && matchesSequence;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function handleSequenceChange(selectedValue: string) {
    if (selectedValue === "all") {
      router.push("/sequences");
    } else {
      router.push(`/sequences/${selectedValue}`);
    }
  }

  // Component to show posts within a sequence
  const PostsListView = () => {
    if (!currentSequence) return null;
    
    const sortedPosts = [...currentSequence.posts].sort((a, b) => a.order - b.order);

    return (
      <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-foreground">
            <th className="py-2 text-left font-medium px-3">Order</th>
            <th className="py-2 text-left font-medium px-3">Post</th>
          </tr>
        </thead>
        <tbody>
          {sortedPosts.map((post, index) => (
            <tr
              key={post.slug}
              className={`border-b border-border hover:bg-secondary/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
            >
              <td className="py-2 px-3 font-medium">{post.order}</td>
              <td className="py-2 px-3">{post.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredSequences.map((sequence) => (
        <div
          key={sequence.slug}
          className="border border-border bg-card hover:bg-secondary/50 transition-colors"
        >
          {/* Cover Image Area */}
          <div className="aspect-[16/9] bg-muted/30 border-b border-border flex items-center justify-center">
            {sequence["cover-url"] ? (
              <img 
                src={sequence["cover-url"]} 
                alt={sequence.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-sm text-center p-4">
                {sequence.title}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="p-4">
            <h3 className="font-medium text-sm mb-2 line-clamp-2">{sequence.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{sequence.preview}</p>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{sequence.posts.length} posts</span>
              <span>{new Date(sequence.date).getFullYear()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <table className="w-full text-sm border border-border overflow-hidden shadow-sm">
      <thead>
        <tr className="border-b border-border bg-muted/50 text-foreground">
          <th className="py-2 text-left font-medium px-3">Title</th>
          <th className="py-2 text-left font-medium px-3">Posts</th>
          <th className="py-2 text-left font-medium px-3">Year</th>
        </tr>
      </thead>
      <tbody>
        {filteredSequences.map((sequence, index) => (
          <tr
            key={sequence.slug}
            className={`border-b border-border hover:bg-secondary/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
          >
            <td className="py-2 px-3 font-medium">{sequence.title}</td>
            <td className="py-2 px-3">{sequence.posts.length}</td>
            <td className="py-2 px-3">{new Date(sequence.date).getFullYear()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) {
    return (
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <div className="flex justify-center items-center py-24">
          <svg className="animate-spin h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .sequences-container {
          font-family: 'Geist', sans-serif;
        }
      `}</style>

      <div className="sequences-container container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader {...headerData} />

        {/* Search bar - only show if viewing all sequences */}
        {activeSequence === "all" && (
          <div className="mb-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search sequences..." 
                className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Filters and View Toggle */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <label htmlFor="sequence-filter" className="text-sm text-muted-foreground">Filter by sequence:</label>
              <CustomSelect
                value={activeSequence}
                onValueChange={handleSequenceChange}
                options={sequenceOptions}
                className="text-sm min-w-[140px]"
              />
            </div>
          </div>

          {/* View Mode Toggle - only show when viewing all sequences */}
          {activeSequence === "all" && (
            <div className="flex items-center gap-1 border border-border rounded-none overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 text-xs transition-colors ${
                  viewMode === "grid" 
                    ? "bg-foreground text-background" 
                    : "bg-background text-foreground hover:bg-secondary/50"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 text-xs transition-colors ${
                  viewMode === "list" 
                    ? "bg-foreground text-background" 
                    : "bg-background text-foreground hover:bg-secondary/50"
                }`}
              >
                List
              </button>
            </div>
          )}
        </div>

        {/* Content based on view mode and active sequence */}
        {activeSequence === "all" ? (
          // Show sequences grid/list view
          viewMode === "grid" ? <GridView /> : <ListView />
        ) : (
          // Show posts in the selected sequence
          <PostsListView />
        )}

        {activeSequence === "all" && filteredSequences.length === 0 && !loading && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No sequences found matching your criteria.</div>
        )}

        {activeSequence !== "all" && currentSequence && currentSequence.posts.length === 0 && !loading && (
          <div className="text-muted-foreground text-sm mt-6 text-center">No posts found in this sequence.</div>
        )}

        {/* PageDescription component */}
        <PageDescription
          title={activeSequence === "all" ? "About Sequences" : `About ${currentSequence?.title || "This Sequence"}`}
          description={
            activeSequence === "all" 
              ? "Sequences are structured collections of posts designed to build understanding progressively. Each sequence covers a specific topic in depth, with posts ordered to maximize learning. Browse by grid or list view to find sequences that interest you."
              : currentSequence?.preview || "This sequence contains a curated collection of posts on a specific topic."
          }
        />
      </div>
    </>
  );
}
