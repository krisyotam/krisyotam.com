import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import testimonials from "@/data/about/testimonials.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a file size in bytes to a human-readable string (e.g., '2.5 MB')
 * @param bytes The size in bytes
 * @returns A formatted string representing the file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const testimonialsData = testimonials as Testimonial[];
