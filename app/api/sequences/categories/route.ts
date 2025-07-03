import { NextResponse } from 'next/server';
import categoriesData from '@/data/sequences/categories.json';

export async function GET() {
  try {
    return NextResponse.json({ categories: categoriesData });
  } catch (error) {
    console.error('Error fetching sequences categories:', error);
    return NextResponse.json({ error: 'Failed to fetch sequences categories' }, { status: 500 });
  }
}
