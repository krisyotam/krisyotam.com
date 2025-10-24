"use client";

import { useState, useEffect } from "react";
import { QuestionCard } from "@/components/questions/question-card";
import { CategoryHeader } from "@/components/category-header";
import { PageHeader } from "@/components/page-header";
import { CustomSelect } from "@/components/ui/custom-select";
import type { SelectOption } from "@/components/ui/custom-select";
import { useRouter } from "next/navigation";

/* default page-level metadata for the header */
const defaultQuestionsPageData = {
  title: "Questions",
  subtitle: "",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "Important open questions and problems that fascinate me, organized by category and tracked for progress.",
  status: "In Progress" as const,
  confidence: "likely" as const,
  importance: 8,
};

interface Question {
  id: number;
  question: string;
  category: string;
  tags: string[];
  source: string;
  date_added: string;
  status: "open" | "solved";
  state: "active" | "hidden";
  notes: string;
}

interface Category {
  slug: string;
  title: string;
  preview: string;
  date: string;
  status: string;
  confidence: string;
  importance: number;
}

interface QuestionsClientPageProps {
  showPageHeader?: boolean;
  initialCategory?: string;
}

export function QuestionsClientPage({ 
  showPageHeader = true, 
  initialCategory = "All" 
}: QuestionsClientPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch questions
        const questionsResponse = await fetch("/api/questions");
        const questionsData = await questionsResponse.json();
        // Only show questions with state "active", filter out "hidden" questions
        const activeQuestions = questionsData.questions.filter((q: Question) => q.state === "active");
        setQuestions(activeQuestions);
        setFilteredQuestions(activeQuestions);

        // Fetch categories
        const categoriesResponse = await fetch("/api/questions/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.types);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Update activeCategory when initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    let result = questions;

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((q) => q.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter((q) => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredQuestions(result);
  }, [activeCategory, searchTerm, questions]);

  const handleCategorySelect = (category: string) => {
    if (category === "All") {
      router.push("/questions");
    } else {
      router.push(`/questions/${category}`);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Get unique categories from questions
  const questionCategories = Array.from(new Set(questions.map(q => q.category)));
  
  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = ["All", ...questionCategories].map(category => ({
    value: category,
    label: category === "All" ? "All Categories" : 
           categories.find(c => c.slug === category)?.title || category
  }));

  // Get category data for header when filtering
  const selectedCategoryData = categories.find(c => c.slug === activeCategory);

  // Determine which header data to use
  const getHeaderData = () => {
    if (initialCategory === "All" || !initialCategory) {
      return defaultQuestionsPageData;
    }
    
    // Find category data from categories.json
    const categoryData = categories.find(cat => cat.slug === initialCategory);
    
    if (categoryData) {
      return {
        title: categoryData.title,
        subtitle: "",
        start_date: (categoryData as any).start_date || categoryData.date || new Date().toISOString().split('T')[0],
        end_date: (categoryData as any).end_date,
        preview: categoryData.preview,
        status: categoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished",
        confidence: categoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain",
        importance: categoryData.importance
      };
    }
    
    // Fallback to default if category not found
    return defaultQuestionsPageData;
  };

  const headerData = getHeaderData();

  return (
    <div className="space-y-6">
      {/* Show page header for main page, category header for category pages */}
      {showPageHeader ? (
        <PageHeader
          title={headerData.title}
          preview={headerData.preview}
          start_date={headerData.start_date}
          end_date={headerData.end_date}
          status={headerData.status}
          confidence={headerData.confidence}
          importance={headerData.importance}
        />
      ) : initialCategory !== "All" && selectedCategoryData ? (
        <CategoryHeader
          title={selectedCategoryData.title}
          date={selectedCategoryData.date}
          preview={selectedCategoryData.preview}
          status={selectedCategoryData.status as "Abandoned" | "Notes" | "Draft" | "In Progress" | "Finished"}
          confidence={selectedCategoryData.confidence as "impossible" | "remote" | "highly unlikely" | "unlikely" | "possible" | "likely" | "highly likely" | "certain"}
          importance={selectedCategoryData.importance}
          backText="Questions"
          backHref="/questions"
          className="mb-8"
        />
      ) : null}

      {/* Filter row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">Filter by category:</label>
          <CustomSelect
            value={activeCategory}
            onValueChange={handleCategorySelect}
            options={categoryOptions}
            className="text-sm min-w-[140px]"
          />
        </div>
        
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search questions..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Questions grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              question={question.question}
              category={question.category}
              tags={question.tags}
              source={question.source}
              dateAdded={question.date_added}
              status={question.status}
              state={question.state}
              notes={question.notes}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
