import { NextResponse } from 'next/server';
import projectsData from '@/data/portfolio/projects.json';

export async function GET() {
  return NextResponse.json(projectsData);
}
