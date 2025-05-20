import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Primary utility function for class name merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a file size in bytes to a human-readable format (KB, MB, etc.)
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
