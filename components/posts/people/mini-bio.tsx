"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface MiniBioProps {
  ghibliImage: string;
  realImage: string;
  name: string;
  description: string;
  className?: string;
}

export default function MiniBio({
  ghibliImage,
  realImage,
  name,
  description,
  className,
}: MiniBioProps) {
  const [showReal, setShowReal] = useState(false);
  const imgSrc = showReal ? realImage : ghibliImage;

  return (
    <div
      className={cn(
        "w-64 flex-shrink-0 bg-card border border-border shadow-sm font-sans antialiased overflow-hidden rounded-sm",
        className
      )}
    >
      <div className="flex flex-col items-center">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-muted">
          <Image
            src={imgSrc || "/placeholder.svg?height=256&width=256"}
            alt={name}
            width={256}
            height={256}
            className="object-cover w-full h-full block"
          />
        </div>

        {/* two-dot indicator with click handlers */}
        <div className="flex space-x-2 mt-2">
          {/* Ghibli dot */}
          <span
            onClick={() => setShowReal(false)}
            className={cn(
              "rounded-full w-2 h-2 cursor-pointer",
              !showReal ? "bg-foreground" : "bg-muted-foreground"
            )}
          />
          {/* Realistic dot */}
          <span
            onClick={() => setShowReal(true)}
            className={cn(
              "rounded-full w-2 h-2 cursor-pointer",
              showReal ? "bg-foreground" : "bg-muted-foreground"
            )}
          />
        </div>

        {/* name & tagline */}
        <div className="p-4 space-y-1 w-full">
          <h2 className="text-base font-medium text-foreground text-center">
            {name}
          </h2>
          <p
            className="text-sm text-muted-foreground text-center break-words"
            title={description}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
