"use client";

import React from 'react';
import Image from "next/image";
import { Box } from '@/components/posts/typography/box';

interface ArtProps {
  imageUrl: string;
  dimension: string;
}

export function Art({ imageUrl, dimension }: ArtProps) {
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
        <Image
          src={imageUrl || "/placeholder.svg?height=600&width=600"}
          alt="Artwork"
          fill
          className="object-contain rounded-none"
          sizes="(max-width: 768px) 100vw, 672px"
          unoptimized={true}
        />
      </div>
    </Box>
  );
}
