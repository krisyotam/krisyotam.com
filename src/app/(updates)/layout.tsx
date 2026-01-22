import { PageHeader } from "@/components/core";
import "./updates.css";

export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        <main className="container max-w-[672px] mx-auto px-4">
          <div className="content">{children}</div>
        </main>
      </div>
    </div>
  );
}
