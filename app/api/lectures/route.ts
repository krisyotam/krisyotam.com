import { NextResponse } from 'next/server';
import lecturesData from '@/data/lectures/lectures.json';

export async function GET() {
  return NextResponse.json(lecturesData);
}
