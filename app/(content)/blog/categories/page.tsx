import BlogCategoriesClientPage from "./BlogCategoriesClientPage";
import categoriesData from "@/data/blog/categories.json";
import blogData from "@/data/blog/blog.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Categories",
  description: "Browse all blog categories and their descriptions",
};

export default function BlogCategoriesPage() {
  // Get all unique categories that actually exist in blog posts
  const existingCategories = Array.from(new Set(blogData.map(post => post.category)));
  
  // Filter categories.json to only include categories that exist in blog posts
  const categories = categoriesData.categories
    .filter(category => {
      // Check if this category exists in the blog posts
      return existingCategories.includes(category.title) || 
             existingCategories.includes(category.slug) ||
             existingCategories.some(cat => cat.toLowerCase().replace(/\s+/g, "-") === category.slug);
    })
    .sort((a, b) => b.importance - a.importance);

  return (
    <div className="blog-container">
      <BlogCategoriesClientPage categories={categories} />
    </div>
  );
}
