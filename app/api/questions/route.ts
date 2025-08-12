import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const questionsPath = path.join(process.cwd(), 'data', 'questions', 'questions.json');
    const questionsData = fs.readFileSync(questionsPath, 'utf8');
    const questions = JSON.parse(questionsData);

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error reading questions data:', error);
    return NextResponse.json(
      { error: 'Failed to load questions data' },
      { status: 500 }
    );
  }
}
