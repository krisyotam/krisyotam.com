"use client";

import "../../app/(prof)/portfolio/portfolio.css";
import AboutMDX from "../../app/(prof)/portfolio/content/about.mdx";

interface AboutProps {
  isActive: boolean;
}

export function About({ isActive }: AboutProps) {
  if (!isActive) return null;

  return (
    <div className="portfolio-content">
      <AboutMDX />
    </div>
  );
}
