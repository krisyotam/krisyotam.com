export interface ContentTypeConfig {
  label: string             // Display title (e.g. "Blog Posts")
  singular: string          // Singular (e.g. "Blog Post")
  gridAspect: string        // "16/9" or "3/4"
  gridCols: 2 | 3           // Grid columns at lg
  defaultView: "list" | "grid"
  showViewToggle: boolean
  formatCategoryNames: boolean
  description: string       // For PageDescription modal
  contentDir: string        // Maps to src/content/<dir> for MDX imports
}

export const CONTENT_TYPES: Record<string, ContentTypeConfig> = {
  blog: { label: "Blog Posts", singular: "Blog Post", gridAspect: "16/9", gridCols: 2, defaultView: "list", showViewToggle: true, formatCategoryNames: true, description: "Informal ramblings, thought experiments, and idea play across topics and characters.", contentDir: "blog" },
  essays: { label: "Essays", singular: "Essay", gridAspect: "16/9", gridCols: 2, defaultView: "list", showViewToggle: true, formatCategoryNames: true, description: "Long-form reflections and thinking on various subjects.", contentDir: "essays" },
  notes: { label: "Notes", singular: "Note", gridAspect: "16/9", gridCols: 2, defaultView: "list", showViewToggle: true, formatCategoryNames: true, description: "Quick thoughts, observations, and working notes.", contentDir: "notes" },
  papers: { label: "Papers", singular: "Paper", gridAspect: "16/9", gridCols: 2, defaultView: "list", showViewToggle: true, formatCategoryNames: true, description: "Research papers and formal studies.", contentDir: "papers" },
  reviews: { label: "Reviews", singular: "Review", gridAspect: "3/4", gridCols: 3, defaultView: "list", showViewToggle: true, formatCategoryNames: false, description: "In-depth reviews of books, films, anime, and other media.", contentDir: "reviews" },
  fiction: { label: "Fiction", singular: "Fiction", gridAspect: "3/4", gridCols: 3, defaultView: "list", showViewToggle: true, formatCategoryNames: false, description: "Short stories, novellas, and fiction writing.", contentDir: "fiction" },
  diary: { label: "Diary", singular: "Diary Entry", gridAspect: "16/9", gridCols: 2, defaultView: "list", showViewToggle: true, formatCategoryNames: true, description: "Personal diary entries and reflections.", contentDir: "diary" },
  progymnasmata: { label: "Progymnasmata", singular: "Progymnasmata", gridAspect: "16/9", gridCols: 2, defaultView: "list", showViewToggle: true, formatCategoryNames: false, description: "Classical rhetorical exercises in the ancient tradition.", contentDir: "progymnasmata" },
  news: { label: "News", singular: "News Article", gridAspect: "16/9", gridCols: 2, defaultView: "list", showViewToggle: false, formatCategoryNames: false, description: "News articles and current commentary.", contentDir: "news" },
  ocs: { label: "Original Characters", singular: "Character", gridAspect: "3/4", gridCols: 3, defaultView: "list", showViewToggle: true, formatCategoryNames: false, description: "Original character profiles and lore.", contentDir: "ocs" },
}

export const VALID_TYPES = Object.keys(CONTENT_TYPES)
