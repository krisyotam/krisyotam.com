import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import testimonials from "@/data/testimonials.json";

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

export function formatDate(date: string | Date): string {
  if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Parse the date parts from the string to avoid timezone issues
    const [year, month, day] = date.split("-").map((num) => parseInt(num, 10));
    date = new Date(year, month - 1, day);
  } else if (typeof date === "string") {
    date = new Date(date);
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC", // Use UTC to preserve the exact date
  });
}

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const testimonialsData = testimonials as Testimonial[];
