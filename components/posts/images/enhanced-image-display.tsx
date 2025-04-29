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

interface EnhancedImageDisplayProps {
  images: ImageItem[] | ImageItem;
  className?: string;
  type?: "default" | "wrap";
}

export function EnhancedImageDisplay({
  images,
  className = "",
  type = "default",
}: EnhancedImageDisplayProps) {
  const { resolvedTheme } = useTheme();
  const imagesArray = Array.isArray(images) ? images : [images];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = imagesArray.length > 1;

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

  return (
    <>
      <div
        className={`${className} ${
          isWrap ? "float-right ml-6 mb-4 w-[300px] max-w-full" : "mb-8"
        }`}
      >
        <div className="relative group cursor-pointer" onClick={() => openModal(currentImageIndex)}>
          <div className={isWrap ? "relative w-full h-auto" : "relative aspect-[16/9]"}>
            {isWrap ? (
              <Image
                src={getCurrentSrc(imagesArray[currentImageIndex]) || "/placeholder.svg"}
                alt={imagesArray[currentImageIndex].alt}
                width={300}
                height={200}
                className="object-contain w-full h-auto"
              />
            ) : (
              <Image
                src={getCurrentSrc(imagesArray[currentImageIndex]) || "/placeholder.svg"}
                alt={imagesArray[currentImageIndex].alt}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Always show overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-black/70 text-white px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 flex items-center transition-opacity duration-300">
              <ZoomIn className="w-4 h-4 mr-2" />
              <span className="text-sm">Click to enlarge</span>
            </div>
          </div>
        </div>

        {imagesArray[currentImageIndex].caption && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {imagesArray[currentImageIndex].caption}
          </div>
        )}
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
                width={1200}
                height={675}
                className="object-contain max-h-[80vh]"
                priority
              />
            </div>

            {/* New cleaner caption, OUTSIDE image */}
            {imagesArray[currentImageIndex].caption && (
              <div className="mt-4 text-center text-sm text-gray-300 max-w-2xl mx-auto">
                {imagesArray[currentImageIndex].caption}
              </div>
            )}
          </div>

          {/* Buttons stay same */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
