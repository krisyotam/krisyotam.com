"use client";

import "../../app/portfolio/portfolio.css";
import AboutMDX from "../../app/portfolio/content/about.mdx";

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
