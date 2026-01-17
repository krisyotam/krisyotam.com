// components/typography/paper.tsx
import "./paper.css";

export interface PaperProps {
  /** Direct or internal URL to the PDF file */
  pdfLink: string;
  /** Title of the paper */
  title: string;
  /** Author(s) of the paper */
  author: string[];
  /** Publication date */
  date: string;
}

export default function Paper({ pdfLink, title, author, date }: PaperProps) {
  return (
    <main className="paper-component p-6 rounded-none my-6 bg-muted/50 dark:bg-[hsl(var(--popover))] text-sm flex flex-col items-center">
      <a
        href={pdfLink}
        target="_blank"
        rel="noopener noreferrer"
        className="paper-link flex flex-col items-center p-4 text-center no-underline hover:no-underline"
      >
        <span className="paper-iframe-container w-40 h-60 mb-2 relative">
          <iframe
            src={pdfLink}
            title={title}
            className="paper-iframe"
            frameBorder="0"
          />
        </span>
      </a>

      <span className="paper-title inline-block font-medium">{title}</span>      <span className="paper-author text-muted-foreground text-xs mt-1">
        {author.join(", ")}
      </span>
      <span className="paper-date text-muted-foreground text-xs">
        {date}
      </span>
    </main>
  );
}
