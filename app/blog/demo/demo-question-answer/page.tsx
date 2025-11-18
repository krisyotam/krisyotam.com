import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Demo Answer — Questions",
  description: "Demo answer page for a sample question",
};

export default function DemoAnswerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 pt-16 pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Demo: What is the simplest demonstrable question with an answer?</h1>
          <p className="text-sm text-muted-foreground mb-4">A tiny demo page that shows an "Answered" badge and an aesthetic answer box.</p>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-500">Answered</Badge>
            <Link href="/questions" className="text-sm text-muted-foreground underline">Back to Questions</Link>
          </div>
        </header>

        <article className="prose dark:prose-invert max-w-none">
          <h2>Answer</h2>
          <div className="mt-4">
            {/* Make the answer box visually identical to the "Answered" badge above by using the Badge styles (full-width, left-aligned) */}
            <Badge variant="outline" className="w-full text-left bg-green-500/10 text-green-500 p-6 rounded-md border-green-200 dark:border-green-800">
              <div>
                <p className="text-green-900 dark:text-green-200">
                  This is a demo answer. Replace this content with your real answer post. The answer box intentionally uses the same green-toned styling as the "Answered" badge above so they match exactly.
                </p>

                <div className="mt-4">
                  <strong>Reference / link:</strong>{' '}
                  <a href="https://example.com" className="text-green-600 dark:text-green-300 underline" target="_blank" rel="noopener noreferrer">Example reference</a>
                </div>
              </div>
            </Badge>
          </div>
        </article>
      </div>
    </div>
  );
}
