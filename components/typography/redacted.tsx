import React from "react";

interface RedactedProps {
  children: React.ReactNode;
}

export default function Redacted({ children }: RedactedProps) {
  return (
    <span className="inline-block bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-md px-2 py-1 text-xs font-mono text-red-800 dark:text-red-200 select-none">
      [REDACTED]
    </span>
  );
}