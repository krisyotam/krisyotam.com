"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
  darkSrc?: string;
}

interface ImgProps {
  // Enhanced usage
  images?: ImageItem[] | ImageItem;
  // Standard img props (for backwards compatibility with <img> tags)
  src?: string;
  alt?: string;
  caption?: string;
  // Common props
  className?: string;
  type?: "default" | "wrap";
  width?: number;
  height?: number;
  align?: "center" | "left" | "right";
}

export function Img({
  images,
  src,
  alt,
  caption,
  className = "",
  type = "default",
  width = 300,
  height = 200,
  align = "center",
}: ImgProps) {
  const { resolvedTheme } = useTheme();

  // Support both enhanced and standard img props
  const resolvedImages: ImageItem[] = images
    ? (Array.isArray(images) ? images : [images])
    : src
      ? [{ src, alt: alt || "", caption }]
      : [];

  const imagesArray = resolvedImages;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = imagesArray.length > 1;

  // Guard for empty images
  if (imagesArray.length === 0) {
    return null;
  }

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesArray.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagesArray.length) % imagesArray.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const getCurrentSrc = (item: ImageItem) => {
    if (resolvedTheme === "dark" && item.darkSrc) return item.darkSrc;
    return item.src;
  };

  const isWrap = type === "wrap";

  // Alignment classes
  let alignClass = "";
  if (align === "center") alignClass = "mx-auto flex justify-center";
  else if (align === "left") alignClass = "mr-auto";
  else if (align === "right") alignClass = "ml-auto";

  return (
    <>
      <div
        className={`${className} ${alignClass} ${
          isWrap ? `float-right ml-6 mb-0 w-[${width}px] max-w-full` : "mb-0"
        }`}
        data-enhanced-container
      >
        <div>
          <div className="relative group cursor-pointer" onClick={() => openModal(currentImageIndex)}>
            <div className={isWrap ? "relative w-full h-auto" : "relative aspect-[16/9]"}>
              <Image
                src={getCurrentSrc(imagesArray[currentImageIndex]) || "/placeholder.svg"}
                alt={imagesArray[currentImageIndex].alt}
                width={width}
                height={height}
                className={isWrap ? "object-contain w-full h-auto !m-0" : "object-cover !m-0"}
                data-enhanced
                unoptimized={getCurrentSrc(imagesArray[currentImageIndex])?.includes('krisyotam.com')}
              />
            </div>
            {/* Always show overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <div className="bg-black/70 text-white px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 flex items-center transition-opacity duration-300">
                <ZoomIn className="w-4 h-4 mr-2" />
                <span className="text-sm">Click to enlarge</span>
              </div>
            </div>
          </div>
          {/* Dots navigation for multiple images */}
          {hasMultipleImages && (
            <div className="flex justify-center gap-1.5 mt-2">
              {imagesArray.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-foreground"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
          {/* Caption is always forced below the image, outside overlay/group */}
          {imagesArray[currentImageIndex].caption && (
            <div
              className="mt-2 text-center text-xs text-muted-foreground w-full flex justify-center"
              style={{ width: isWrap ? '100%' : `${width}px`, wordBreak: 'break-word' }}
            >
              <span className="inline-block w-full">{imagesArray[currentImageIndex].caption}</span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 overflow-y-auto p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-screen max-w-5xl h-auto max-h-[90vh] mx-auto flex flex-col items-center">
              <Image
                src={getCurrentSrc(imagesArray[currentImageIndex]) || "/placeholder.svg"}
                alt={imagesArray[currentImageIndex].alt}
                width={width * 3.5}
                height={height * 3.5}
                className="object-contain max-h-[80vh] !m-0"
                data-enhanced
                priority
                unoptimized={getCurrentSrc(imagesArray[currentImageIndex])?.includes('krisyotam.com')}
              />
            </div>

            {/* New cleaner caption, OUTSIDE image */}
            {imagesArray[currentImageIndex].caption && (
              <div className="mt-4 text-center text-sm text-gray-300 max-w-2xl mx-auto">
                {imagesArray[currentImageIndex].caption}
              </div>
            )}
          </div>

          {/* Navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Dots navigation in modal */}
          {hasMultipleImages && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {imagesArray.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
