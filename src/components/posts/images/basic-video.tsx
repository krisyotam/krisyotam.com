import { Caption } from "./caption";

export function Video({
  src,
  alt: originalAlt,
  width,
  height,
}: {
  src: string;
  alt?: string;
  width?: number | null;
  height?: number | null;
}) {
  const isDataVideo = src.startsWith("data:");

  let alt: string | null = null;
  let dividedBy = 100;

  if (typeof originalAlt === "string") {
    const match = originalAlt.match(/(.*) (\[(\d+)%\])?$/);
    if (match != null) {
      alt = match[1];
      dividedBy = match[3] ? parseInt(match[3]) : 100;
    } else {
      alt = originalAlt;
    }
  } else {
    alt = originalAlt ?? null;
  }

  const factor = dividedBy / 100;

  const scaledWidth = width ? width * factor : undefined;
  const scaledHeight = height ? height * factor : undefined;

  if (isDataVideo) {
    return (
      <span className="my-5 flex flex-col items-center">
        <video
          src={src}
          controls
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {alt && <Caption>{alt}</Caption>}
      </span>
    );
  }

  return (
    <span className="my-5 flex flex-col items-center">
      {scaledWidth && scaledHeight ? (
        <video
          src={src}
          controls
          width={scaledWidth}
          height={scaledHeight}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      ) : (
        <video
          src={src}
          controls
          width={800}
          height={600}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      {alt && <Caption>{alt}</Caption>}
    </span>
  );
} 