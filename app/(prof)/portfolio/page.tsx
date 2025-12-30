"use client";

import { useState, useEffect } from "react";
import { PageDescription } from "@/components/core";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Posts } from "@/components/portfolio/posts";
import { Projects } from "@/components/portfolio/projects";
import { CV } from "@/components/portfolio/cv";
import projectsData from "@/data/portfolio/projects.json";
import categoriesData from "@/data/portfolio/categories.json";

const portfolioPageData = {
  title: "Portfolio",
  subtitle: "A showcase of selected works, projects, and creative endeavors.",
  start_date: "2025-01-01",
  end_date: new Date().toISOString().split('T')[0],
  preview: "Explore a curated collection of my professional, technical, and artistic projects.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 8,
  description: "This portfolio highlights a range of work across disciplines—design, development, writing, and more. Each project reflects my skills, interests, and creative process."
};

export default function PortfolioPage() {
  // Temporarily set default to "projects" for testing
  const [activeTab, setActiveTab] = useState("projects");

  const handleTabChange = (tab: string) => {
    console.log("Tab changed to:", tab);
    setActiveTab(tab);
  };

  // Add effect to log active tab for debugging
  useEffect(() => {
    console.log("Active tab in portfolio page:", activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Hero activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Tab Content */}
        <div className="my-2">
          {activeTab === "posts" && <Posts isActive={true} />}
          {activeTab === "projects" && <Projects isActive={true} />}
          {activeTab === "cv" && <CV isActive={true} />}
          {activeTab === "about" && <About isActive={true} />}
        </div>

        {/* removed marquee and features demo per request */}
        
        {/* page description removed as requested */}
      </main>
    </div>
  );
}
