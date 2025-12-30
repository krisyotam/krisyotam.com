"use client";

import { useState, useEffect } from "react";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { CustomSelect } from "@/components/ui/custom-select";
import type { SelectOption } from "@/components/ui/custom-select";

interface Prediction {
  statement: string;
  confidence: number;
  date: string;
  category: string;
  status: "active" | "hidden" | "dropped" | "succeeded" | "failed";
  expiryDate: string;
}

export function PredictionsClientPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const response = await fetch("/api/predictions");
        const data = await response.json();
        setPredictions(data.predictions);
        setFilteredPredictions(data.predictions);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.predictions.map((p: Prediction) => p.category))
        ) as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    }

    fetchPredictions();
  }, []);

  useEffect(() => {
    let result = predictions;

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter((p) => p.statement.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredPredictions(result);
  }, [activeCategory, searchTerm, predictions]);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Convert categories to SelectOption format
  const categoryOptions: SelectOption[] = ["All", ...categories].map(category => ({
    value: category,
    label: category === "All" ? "All Categories" : category
  }));

  return (
    <div className="space-y-6">
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
            placeholder="Search predictions..."
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Predictions grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPredictions.length > 0 ? (
          filteredPredictions.map((prediction, index) => (
            <PredictionCard
              key={index}
              statement={prediction.statement}
              confidence={prediction.confidence}
              date={prediction.date}
              category={prediction.category}
              status={prediction.status}
              expiryDate={prediction.expiryDate}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No predictions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}