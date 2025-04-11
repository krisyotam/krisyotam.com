"use client";

import { useState, useEffect } from "react";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { PredictionsCategoryFilter } from "@/components/predictions/predictions-category-filter";
import { PredictionsSearch } from "@/components/predictions/predictions-search";

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

  return (
    <div className="bg-background">
      <div className="mb-8">
        <div className="w-full mb-6">
          <PredictionsSearch onSearch={handleSearch} />
        </div>
        <div className="w-full">
          <PredictionsCategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>

      <div className="space-y-4 mt-8">
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
          <div className="text-center py-8 text-muted-foreground">No predictions found matching your criteria.</div>
        )}
      </div>
    </div>
  );
}