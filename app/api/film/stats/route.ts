import { NextResponse } from 'next/server';
import { getWatchedStats } from '@/lib/film-utils';

export async function GET() {
  try {
    const stats = await getWatchedStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching film stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch film stats' },
      { status: 500 }
    );
  }
} 