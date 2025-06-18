import ProofClientPage from "../ProofClientPage";
import proofsData from "@/data/proofs/proofs.json";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  // Get all unique categories from proofs data
  const categories = Array.from(new Set(proofsData.proofs.map(proof => proof.category)));
  
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, "-")
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Convert slug back to category name
  const categorySlug = params.category;
  const originalCategory = proofsData.proofs.find(proof => 
    proof.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    return {
      title: "Category Not Found | Proofs",
    };
  }

  return {
    title: `${originalCategory} Proofs | Kris Yotam`,
    description: `Proofs in the ${originalCategory} category`,
  };
}

export default function ProofCategoryPage({ params }: PageProps) {
  const categorySlug = params.category;
  
  // Find the original category name
  const originalCategory = proofsData.proofs.find(proof => 
    proof.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
  )?.category;

  if (!originalCategory) {
    notFound();
  }

  // Sort proofs by date (newest first)
  const proofs = [...proofsData.proofs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="proofs-container">
      <ProofClientPage proofs={proofs} initialCategory={originalCategory} />
    </div>
  );
}
