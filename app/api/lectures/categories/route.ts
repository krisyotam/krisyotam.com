import { NextResponse } from 'next/server';
import categoriesData from '@/data/lectures/categories.json';

export async function GET() {
  return NextResponse.json(categoriesData);
}
