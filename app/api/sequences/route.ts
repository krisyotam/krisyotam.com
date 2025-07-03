import { NextResponse } from 'next/server';
import sequencesData from '@/data/sequences/sequences.json';

export async function GET() {
  try {
    return NextResponse.json({ sequences: sequencesData.sequences });
  } catch (error) {
    console.error('Error fetching sequences:', error);
    return NextResponse.json({ error: 'Failed to fetch sequences' }, { status: 500 });
  }
}
