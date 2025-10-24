// components/post-notice.tsx
import { Card } from "@/components/ui/card";

export function PostNotice() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="p-4 bg-card text-card-foreground border-border rounded-none">
        <p className="text-sm italic">
          If you discern any misinformation, typographical error, or nuance that diminishes
          the integrity of the status, certainty, or importance above, kindly notify me at{' '}
          <a href="mailto:krisyotam@protonmail.com" className="underline">
            krisyotam@protonmail.com
          </a>
          . I shall promptly queue and review your suggested amendments.
        </p>
      </Card>
    </div>
  );
}