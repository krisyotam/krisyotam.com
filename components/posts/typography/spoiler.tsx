// components/Spoiler.tsx
import React, { ReactNode } from "react";
import "./spoiler.css";

interface SpoilerProps {
  children: ReactNode;
}

export function Spoiler({ children }: SpoilerProps) {
  return <span className="spoiler">{children}</span>;
}
