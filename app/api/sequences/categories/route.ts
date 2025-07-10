import { NextResponse } from 'next/server';
import sequencesData from '@/data/sequences/sequences.json';

export async function GET() {
  try {
    // Extract unique categories from sequences
    const categories = new Set<string>();
    sequencesData.sequences.forEach(sequence => {
      if (sequence.category) {
        categories.add(sequence.category);
      }
    });
    
    // Convert to array and format
    const formattedCategories = Array.from(categories).map(category => ({
      slug: category.toLowerCase().replace(/\s+/g, "-"),
      title: category,
      count: sequencesData.sequences.filter(seq => seq.category === category).length
    }));
    
    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Error fetching sequences categories:', error);
    return NextResponse.json({ error: 'Failed to fetch sequences categories' }, { status: 500 });
  }
}
