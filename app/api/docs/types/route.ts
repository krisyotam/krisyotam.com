import { NextResponse } from 'next/server';
import typesData from '@/data/docs/types.json';

export async function GET() {
  try {
    return NextResponse.json({ types: typesData.types });
  } catch (error) {
    console.error('Error fetching types:', error);
    return NextResponse.json({ error: 'Failed to fetch types' }, { status: 500 });
  }
}
