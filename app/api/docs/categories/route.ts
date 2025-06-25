import { NextResponse } from 'next/server';
import categoriesData from '@/data/docs/categories.json';

export async function GET() {
  try {
    return NextResponse.json({ categories: categoriesData });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
