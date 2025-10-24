import React from "react";
import { CVClient } from "./cv-client";

interface CVProps {
  isActive: boolean;
}

export function CV({ isActive }: CVProps) {
  return <CVClient timelineData={timelineData} isActive={isActive} />;
}

const imageClass =
  "h-32 w-full object-cover shadow-sm"; // Keeping original square corners

const imageGridClass = "grid grid-cols-2 gap-4 w-full max-w-full";

const timelineData = [
  {
    title: "2024",
    company: "Adobe Inc.",
    role: "Plugin Development Partner",
    description: "Collaborated with Adobe to develop plugins for Creative Cloud applications.",
    content: (
      <div>
        <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Built and launched custom plugins for Adobe's Creative Cloud suite
        </p>
        <div className={imageGridClass}>
          {["startup-1.webp", "startup-2.webp", "startup-3.webp", "startup-4.webp"].map((file, idx) => (
            <img
              key={idx}
              src={`https://assets.aceternity.com/templates/${file}`}
              alt={`startup ${idx + 1}`}
              className={imageClass}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "2023",
    company: "Grammarly Inc.",
    role: "Product Development Consultant",
    description: "Served as a product development consultant, helping define and implement new features.",
    content: (
      <div>
        <p className="mb-3 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Consulted on product development initiatives for Grammarly's writing assistant platform
        </p>
        <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Designed and implemented key UX improvements that increased user engagement and satisfaction
        </p>
        <div className={imageGridClass}>
          {["pro/hero-sections.png", "features-section.png", "pro/bento-grids.png", "cards.png"].map(
            (file, idx) => (
              <img
                key={idx}
                src={`https://assets.aceternity.com/${file}`}
                alt={`design ${idx + 1}`}
                className={imageClass}
              />
            )
          )}
        </div>
      </div>
    ),
  },
  {
    title: "2022",
    company: "Your Company",
    role: "Product Designer",
    description: "Looking for a product designer who ships? I blend empathy, design craft, and technical understanding to deliver user-centered solutions.",
    content: (
      <div>
        <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
          Designed and implemented user-centered solutions for multiple client projects
        </p>
        <div className={imageGridClass}>
          {["startup-3.webp", "startup-4.webp", "startup-1.webp", "startup-2.webp"].map((file, idx) => (
            <img
              key={idx}
              src={`https://assets.aceternity.com/templates/${file}`}
              alt={`project ${idx + 1}`}
              className={imageClass}
            />
          ))}
        </div>
      </div>
    ),
  },
];
