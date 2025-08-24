import { Caption } from "./caption";
import NextImage from "next/image";

export function Image({
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
  const isDataImage = src.startsWith("data:");

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

  if (isDataImage) {
    /* eslint-disable @next/next/no-img-element */
    return (
      <span className="my-5 flex flex-col items-center">
        <img
          src={src}
          alt={alt ?? ""}
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {alt && <Caption>{alt}</Caption>}
      </span>
    );
  }

  return (
    <span className="my-5 flex flex-col items-center">
      {scaledWidth && scaledHeight ? (
        <NextImage
          src={src}
          alt={alt ?? ""}
          width={scaledWidth}
          height={scaledHeight}
        />
      ) : (
        <NextImage
          src={src}
          alt={alt ?? ""}
          width={800} // Provide a safe default
          height={600}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      {alt && <Caption>{alt}</Caption>}
    </span>
  );
}
