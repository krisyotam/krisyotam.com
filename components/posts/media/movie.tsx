import Image from "next/image";
import "./movie.css";

export interface MovieProps {
  /** URL of the movie poster image */
  poster: string;
  /** Title of the movie */
  title: string;
  /** Director of the movie */
  director: string;
  /** Link to the movie (IMDB, etc.) */
  link: string;
  /** Year the movie was released */
  year?: number;
}

export default function Movie({ poster, title, director, link, year }: MovieProps) {
  return (
    <main className="movie-component p-6 rounded-none my-6 bg-muted/50 dark:bg-[hsl(var(--popover))] text-sm flex flex-col items-center">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="movie-link flex flex-col items-center p-4 text-center no-underline hover:no-underline"
      >
        <span className="movie-image-container w-40 h-60 bg-center bg-cover mb-2 relative">
          <Image
            src={poster}
            alt={title}
            fill
            style={{ objectFit: "contain" }}
            className="movie-image"
            unoptimized={poster?.includes('krisyotam.com')}
          />
        </span>
        <span className="movie-title inline-block font-medium">{title}</span>
        <span className="movie-director text-muted-foreground text-xs mt-1">
          {director} {year && `(${year})`}
        </span>
      </a>
    </main>
  );
}
