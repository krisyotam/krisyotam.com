/**
 * Format a date string into a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  // Format as Month Day, Year (e.g., "April 30, 2025")
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Format a date string into a compact format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Apr 30, 2025")
 */
export function formatDateCompact(dateString: string): string {
  const date = new Date(dateString)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

export function formatDateWithValidation(date: unknown): string {
if (!(date instanceof Date) || isNaN(date.getTime())) {
  return "Invalid Date";
}
return date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
}