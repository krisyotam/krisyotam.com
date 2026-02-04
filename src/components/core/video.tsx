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

interface VideoProps {
  // Enhanced usage
  videos?: VideoItem[] | VideoItem;
  // Standard video props (for backwards compatibility)
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

export function Video({
  videos,
  src,
  alt,
  caption,
  className = "",
  type = "default",
  width = 300,
  height = 200,
  align = "center",
}: VideoProps) {
  const { resolvedTheme } = useTheme();

  // Support both enhanced and standard video props
  const resolvedVideos: VideoItem[] = videos
    ? (Array.isArray(videos) ? videos : [videos])
    : src
      ? [{ src, alt: alt || "", caption }]
      : [];

  const videosArray = resolvedVideos;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const hasMultipleVideos = videosArray.length > 1;

  // Guard for empty videos
  if (videosArray.length === 0) {
    return null;
  }

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
        data-video-container
      >
        <div>
          <div className="relative group cursor-pointer" onClick={() => openModal(currentVideoIndex)}>
            <div className={isWrap ? "relative w-full h-auto" : "relative aspect-[16/9]"}>
              <video
                src={getCurrentSrc(videosArray[currentVideoIndex])}
                width={width}
                height={height}
                className={isWrap ? "object-contain w-full h-auto !m-0" : "object-cover !m-0"}
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
          {/* Dots navigation for multiple videos */}
          {hasMultipleVideos && (
            <div className="flex justify-center gap-1.5 mt-2">
              {videosArray.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentVideoIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentVideoIndex
                      ? "bg-foreground"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to video ${index + 1}`}
                />
              ))}
            </div>
          )}
          {/* Caption is always forced below the video */}
          {videosArray[currentVideoIndex].caption && (
            <div
              className="mt-2 text-center text-xs text-muted-foreground w-full flex justify-center"
              style={{ width: isWrap ? '100%' : `${width}px`, wordBreak: 'break-word' }}
            >
              <span className="inline-block w-full">{videosArray[currentVideoIndex].caption}</span>
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
              <video
                src={getCurrentSrc(videosArray[currentVideoIndex])}
                controls
                autoPlay
                className="max-h-[80vh] !m-0"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>

            {/* Caption in modal */}
            {videosArray[currentVideoIndex].caption && (
              <div className="mt-4 text-center text-sm text-gray-300 max-w-2xl mx-auto">
                {videosArray[currentVideoIndex].caption}
              </div>
            )}
          </div>

          {/* Navigation arrows */}
          {hasMultipleVideos && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevVideo(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextVideo(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Dots navigation in modal */}
          {hasMultipleVideos && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {videosArray.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentVideoIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentVideoIndex
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to video ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
