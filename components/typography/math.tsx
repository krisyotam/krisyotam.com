// components/Math.tsx
import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export type MathType = "inline" | "block";

interface MathProps {
  /** Renders as either inline (`<span>`) or block (`<div>`) math */
  type?: MathType;
  /** LaTeX string, e.g. "\int_a^b f(x)\,dx" */
  children: React.ReactNode;
}

export default function Math({ type = "block", children }: MathProps) {
  // 1) Gather all children into one string
  let mathText = React.Children.toArray(children).join("").trim();

  // 2) Strip surrounding quotes if MDX wrapped it
  if (
    (mathText.startsWith('"') && mathText.endsWith('"')) ||
    (mathText.startsWith("'") && mathText.endsWith("'"))
  ) {
    mathText = mathText.slice(1, -1);
  }

  // 3) For block mode, automatically add \displaystyle if not present
  if (type === "block" && !mathText.startsWith("\\displaystyle")) {
    mathText = `\\displaystyle ${mathText}`;
  }

  // 4) Render once (at build/SSR time)
  const html = katex.renderToString(mathText, {
    displayMode: type === "block",
    throwOnError: false,
    trust: true,
  });

  // 5) Choose wrapper tag & optional class for styling
  const Tag = type === "inline" ? "span" : "div";
  const className = type === "inline" ? "math-inline" : "math-block";

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
