import sizeOf from "image-size";
import { join } from "path";
import { readFile } from "fs/promises";
import { Caption } from "./caption";
import NextImage from "next/image";

export async function Image({
  src,
  alt: originalAlt,
  width = null,
  height = null,
}: {
  src: string;
  alt?: string;
  width?: number | null;
  height?: number | null;
}) {
  if (!src) {
    return null;
  }

  const isDataImage = src.startsWith("data:");
  if (isDataImage) {
    /* eslint-disable @next/next/no-img-element */
    return <img src={src} alt={originalAlt ?? ""} />;
  }

  // For external images, use regular img tag
  if (src.startsWith("http")) {
    let alt: string | null = null;
    if (typeof originalAlt === "string") {
      const match = originalAlt.match(/(.*?) ?(\[(\d+)%\])?$/);
      if (match != null) {
        alt = match[1] || null;
      }
    }

    return (
      <span className="my-5 block text-center">
        {/* eslint-disable @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} className="max-w-full h-auto inline-block" />
        {alt && <Caption>{alt}</Caption>}
      </span>
    );
  }

  // For local images, calculate dimensions
  if (width === null || height === null) {
    try {
      const imagePath = join(process.cwd(), "public", src);
      const imageBuffer = await readFile(imagePath);
      const computedSize = sizeOf(imageBuffer);

      if (computedSize.width && computedSize.height) {
        width = computedSize.width;
        height = computedSize.height;
      }
    } catch (e) {
      // If we can't read the file, fall back to regular img
      let alt: string | null = null;
      if (typeof originalAlt === "string") {
        const match = originalAlt.match(/(.*?) ?(\[(\d+)%\])?$/);
        if (match != null) {
          alt = match[1] || null;
        }
      }

      return (
        <span className="my-5 block text-center">
          {/* eslint-disable @next/next/no-img-element */}
          <img src={src} alt={alt ?? ""} className="max-w-full h-auto inline-block" />
          {alt && <Caption>{alt}</Caption>}
        </span>
      );
    }
  }

  let alt: string | null = null;
  let dividedBy = 100;

  if (typeof originalAlt === "string") {
    const match = originalAlt.match(/(.*?) ?(\[(\d+)%\])?$/);
    if (match != null) {
      alt = match[1] || null;
      dividedBy = match[3] ? parseInt(match[3]) : 100;
    }
  } else {
    alt = originalAlt ?? null;
  }

  const factor = dividedBy / 100;

  return (
    <span className="my-5 block text-center">
      <NextImage
        width={(width ?? 800) * factor}
        height={(height ?? 600) * factor}
        alt={alt ?? ""}
        src={src}
        unoptimized={src.endsWith(".gif")}
        className="inline-block"
      />
      {alt && <Caption>{alt}</Caption>}
    </span>
  );
}
