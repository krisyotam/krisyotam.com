import "../../(content)/notes/notes.css";

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-8">
      <div className="container max-w-[672px] mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
