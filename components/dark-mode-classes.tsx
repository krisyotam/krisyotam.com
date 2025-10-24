'use client';

// This component ensures critical dark mode classes are included in the final CSS bundle
// by explicitly rendering them (but hidden from view)
export function DarkModeClasses() {
  // We'll create a hidden div that has all the dark mode classes
  // This ensures Tailwind doesn't purge these classes in production
  return (
    <div className="hidden">
      {/* Text colors */}
      <span className="dark:text-white dark:text-f5f5f5 dark:text-e5e5e5 dark:text-e0e0e0 dark:text-d4d4d4 dark:text-bbb dark:text-a3a3a3 dark:text-60a5fa dark:text-93c5fd dark:text-3b82f6"></span>
      
      {/* Background colors */}
      <div className="dark:bg-white dark:bg-opacity-5 dark:bg-neutral-900 dark:bg-black"></div>
      
      {/* Border colors */}
      <div className="dark:border-white dark:border-opacity-20 dark:border-opacity-25 dark:border-opacity-30 dark:border-neutral-600 dark:border-neutral-400 dark:border-60a5fa dark:border-93c5fd dark:border-opacity-60"></div>
      
      {/* Border styles */}
      <div className="dark:border-dotted dark:border-b"></div>
      
      {/* Prose classes */}
      <div className="dark:prose-invert"></div>
    </div>
  );
} 