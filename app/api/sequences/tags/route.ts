import { NextResponse } from 'next/server';
import tagsData from '@/data/sequences/tags.json';

export async function GET() {
  try {
    return NextResponse.json({ tags: tagsData });
  } catch (error) {
    console.error('Error fetching sequences tags:', error);
    return NextResponse.json({ error: 'Failed to fetch sequences tags' }, { status: 500 });
  }
}
