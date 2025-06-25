import { NextResponse } from 'next/server';
import docsData from '@/data/docs/docs.json';

export async function GET() {
  try {
    return NextResponse.json({ docs: docsData });
  } catch (error) {
    console.error('Error fetching docs:', error);
    return NextResponse.json({ error: 'Failed to fetch docs' }, { status: 500 });
  }
}
