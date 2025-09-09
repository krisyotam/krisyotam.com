"use client";

import { useEffect } from "react";
import { ProjectsClient } from "./projects-client";

import projectsData from "@/data/portfolio/projects.json"; 
import categoriesData from "@/data/portfolio/categories.json";

interface ProjectsProps {
  isActive: boolean;
}

export function Projects({ isActive }: ProjectsProps) {
  const projects = projectsData.projects || [];
  const categories = categoriesData.categories || [];

  useEffect(() => {
    if (isActive) {
      console.log("Projects component data:", projects);
      console.log("Categories component data:", categories);
      console.log("isActive prop:", isActive);
    }
  }, [isActive, projects, categories]);

  return isActive ? (
    <ProjectsClient 
      projects={projects} 
      categories={categories} 
      isActive={true} 
    />
  ) : null;
}
