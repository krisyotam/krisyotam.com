// components/Spoiler.tsx
import React, { ReactNode } from "react";
import "./Spoiler.css";

interface SpoilerProps {
  children: ReactNode;
}

export function Spoiler({ children }: SpoilerProps) {
  return <span className="spoiler">{children}</span>;
}
