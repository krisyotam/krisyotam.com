import Image from "next/image";
import { Box } from "@/components/typography/box";

export interface VideoProps {
  /** URL of the video thumbnail image */
  image: string;
  /** Title of the video */
  title: string;
  /** Episode slug for routing */
  episode: string;
  /** Direct link to the video file */
  video: string;
  /** Category of the video */
  category?: string;
  /** Video subtitle/description */
  subtitle?: string;
}

export default function Video({ 
  image, 
  title, 
  episode, 
  video, 
  category, 
  subtitle 
}: VideoProps) {
  return (
    <Box className="text-sm flex flex-col items-center text-center my-0">
      {/* Video thumbnail */}
      <div className="relative w-full h-32 mb-2 bg-center bg-cover">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-none"
          unoptimized={image?.includes('krisyotam.com')}
        />
      </div>

      {/* Video title */}
      <a
        href={`/videos/${episode}`}
        className="block font-medium mb-1 hover:underline text-foreground"
      >
        {title}
      </a>

      {/* Category and subtitle */}
      {(category || subtitle) && (
        <div className="text-xs text-muted-foreground mb-2">
          {category && <span className="font-medium">{category}</span>}
          {category && subtitle && <span> • </span>}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}

      {/* Action links */}
      <div className="text-xs text-muted-foreground">
        [{" "}
        <a
          href={video}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Video
        </a>{" "}
        ] [{" "}
        <a
          href={`/videos/${episode}`}
          className="text-primary hover:underline"
        >
          Episode
        </a>{" "}
        ] [{" "}
        <a
          href={`/videos/${episode}/transcript`}
          className="text-primary hover:underline"
        >
          Transcript
        </a>{" "}
        ]
      </div>
    </Box>
  );
}
