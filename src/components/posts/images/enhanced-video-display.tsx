"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useTheme } from "next-themes";

interface VideoItem {
  src: string;
  alt: string;
  caption?: string;
  darkSrc?: string;
}

interface EnhancedVideoDisplayProps {
  videos: VideoItem[] | VideoItem;
  className?: string;
  type?: "default" | "wrap";
}

export function EnhancedVideoDisplay({
  videos,
  className = "",
  type = "default",
}: EnhancedVideoDisplayProps) {
  const { resolvedTheme } = useTheme();
  const videosArray = Array.isArray(videos) ? videos : [videos];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const hasMultipleVideos = videosArray.length > 1;

  const openModal = (index: number) => {
    setCurrentVideoIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videosArray.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videosArray.length) % videosArray.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "ArrowRight") nextVideo();
      if (e.key === "ArrowLeft") prevVideo();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const getCurrentSrc = (item: VideoItem) => {
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
        <div className="relative group cursor-pointer" onClick={() => openModal(currentVideoIndex)}>
          <div className={isWrap ? "relative w-full h-auto" : "relative aspect-[16/9]"}>
            <video
              src={getCurrentSrc(videosArray[currentVideoIndex])}
              className="w-full h-full object-cover"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          {/* Always show overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-black/70 text-white px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 flex items-center transition-opacity duration-300">
              <Play className="w-4 h-4 mr-2" />
              <span className="text-sm">Click to play</span>
            </div>
          </div>
        </div>

        {videosArray[currentVideoIndex].caption && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {videosArray[currentVideoIndex].caption}
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
              <video
                src={getCurrentSrc(videosArray[currentVideoIndex])}
                controls
                className="max-h-[80vh]"
                style={{ maxWidth: "100%", height: "auto" }}
                autoPlay
              />
            </div>

            {videosArray[currentVideoIndex].caption && (
              <div className="mt-4 text-center text-sm text-gray-300 max-w-2xl mx-auto">
                {videosArray[currentVideoIndex].caption}
              </div>
            )}
          </div>

          {hasMultipleVideos && (
            <>
              <button
                onClick={prevVideo}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextVideo}
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