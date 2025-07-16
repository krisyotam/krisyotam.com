import { NextResponse } from 'next/server';
import sequencesData from '@/data/sequences/sequences.json';
import { Sequence, SequencesData } from '@/types/sequences';

export async function GET() {
  try {
    const data = sequencesData as SequencesData;
    return NextResponse.json({ sequences: data.sequences });
  } catch (error) {
    console.error('Error fetching sequences:', error);
    return NextResponse.json({ error: 'Failed to fetch sequences' }, { status: 500 });
  }
}
