"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

// Card component with square corners and hover title
export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        card.isAlbum
          ? "rounded-none relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full aspect-square transition-all duration-300 ease-out p-0 m-0"
          : "rounded-none relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-52 md:h-80 w-full transition-all duration-300 ease-out p-0 m-0",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      <img
        src={card.cover || card.albumCover}
        alt={card.title}
        className={
          card.isAlbum
            ? "object-cover w-full h-full aspect-square"
            : "object-cover w-full h-full aspect-[2/3]"
        }
        style={card.isAlbum ? { width: '100%', height: '100%', aspectRatio: '1/1' } : { width: '100%', height: '100%', aspectRatio: '960/1440' }}
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-2 px-2 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-sm md:text-base font-normal bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 m-0 p-0 tracking-tight">
          {card.title}
        </div>
      </div>
    </div>
  )
);

Card.displayName = "Card";

type CardType = {
  title: string;
  cover: string;
  link: string;
};

const FAVORITES_SECTIONS = [
  "film",
  "books",
  "ballet",
  "plays",
  "music",
  "anime",
  "manga",
  "meals",
];

export function Favorites() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const section = FAVORITES_SECTIONS[sectionIndex];
  const [cards, setCards] = useState<CardType[]>([]);

  React.useEffect(() => {
    fetch(`/api/data?type=favorites&section=${section}`)
      .then((res) => res.json())
      .then((data: CardType[]) => {
        if (section === "music") {
          setCards(
            data.slice(0, 8).map((entry: CardType) => ({ ...entry, isAlbum: true }))
          );
        } else {
          setCards(
            data.slice(0, 4).map((entry: CardType) => ({ ...entry, isAlbum: false }))
          );
        }
      });
  }, [section]);

  return (
    <div>
      {section === "music" ? (
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, index) => (
            <div key={card.title}>
              <Card card={card} index={index} hovered={hovered} setHovered={setHovered} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1">
          {cards.map((card, index) => (
            <div key={card.title}>
              <Card card={card} index={index} hovered={hovered} setHovered={setHovered} />
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-2 gap-1">
        <button
          className="px-2 py-1 bg-gray-200 dark:bg-neutral-800 text-sm font-medium transition-colors"
          onClick={() => setSectionIndex((sectionIndex - 1 + FAVORITES_SECTIONS.length) % FAVORITES_SECTIONS.length)}
          aria-label="Previous section"
        >
          &#8592;
        </button>
        <span className="px-2 py-1 text-sm font-medium text-muted-foreground">
          {FAVORITES_SECTIONS[sectionIndex].charAt(0).toUpperCase() + FAVORITES_SECTIONS[sectionIndex].slice(1)}
        </span>
        <button
          className="px-2 py-1 bg-gray-200 dark:bg-neutral-800 text-sm font-medium transition-colors"
          onClick={() => setSectionIndex((sectionIndex + 1) % FAVORITES_SECTIONS.length)}
          aria-label="Next section"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}

export default Favorites;
