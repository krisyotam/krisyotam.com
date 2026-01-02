"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Box } from '@/components/posts/typography/box';
import { getPhotoUrl } from "@/lib/flickr";

interface ArtProps {
  imageUrl: string;
  dimension: string;
}

export function Art({ imageUrl, dimension }: ArtProps) {
  const [loadedImage, setLoadedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      
      // If the imageUrl starts with "/art/", it's a local path using Flickr ID
      if (imageUrl.startsWith("/art/")) {
        const id = imageUrl.split("/").pop()?.replace(/\.\w+$/, "") || "";
        try {
          const url = await getPhotoUrl(id);
          setLoadedImage(url);
        } catch (error) {
          console.error("Error loading image:", error);
          setLoadedImage(imageUrl); // Fallback to original URL
        }
      } else {
        // Use direct URL
        setLoadedImage(imageUrl);
      }
      
      setIsLoading(false);
    };

    loadImage();
  }, [imageUrl]);

  // Set aspect ratio based on dimension
  let aspectRatio = "aspect-square"; // Default 1:1
  if (dimension === "7x4") {
    aspectRatio = "aspect-[7/4]";
  } else if (dimension === "4x7") {
    aspectRatio = "aspect-[4/7]";
  }

  return (
    <Box className="p-0 overflow-hidden">
      <div className={`w-full ${aspectRatio} relative`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Image
            src={loadedImage || "/placeholder.svg?height=600&width=600"}
            alt="Artwork"
            fill
            className="object-contain rounded-none"
            sizes="(max-width: 768px) 100vw, 672px"
            unoptimized={true}
          />
        )}
      </div>
    </Box>
  );
}
