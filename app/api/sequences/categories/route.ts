import { NextResponse } from 'next/server';
import sequencesData from '@/data/sequences/sequences.json';
import { SequencesData } from '@/types/content';

export async function GET() {
  try {
    const data = sequencesData as SequencesData;
    
    // Extract unique categories from sequences
    const categories = new Set<string>();
    data.sequences.forEach(sequence => {
      if (sequence.category) {
        categories.add(sequence.category);
      }
    });
    
    // Convert to array and format
    const formattedCategories = Array.from(categories).map(category => ({
      slug: category.toLowerCase().replace(/\s+/g, "-"),
      title: category,
      count: data.sequences.filter(seq => seq.category === category).length
    }));
    
    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Error fetching sequences categories:', error);
    return NextResponse.json({ error: 'Failed to fetch sequences categories' }, { status: 500 });
  }
}
