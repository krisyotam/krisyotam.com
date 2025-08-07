/**
 * Format a date string into a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  // Handle null, undefined, or empty strings
  if (!dateString || typeof dateString !== 'string') {
    return 'Invalid date'
  }
  
  // Parse the date parts from the string to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10))
  
  // Create date with explicit year, month (0-indexed), and day
  const date = new Date(year, month - 1, day)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  // Format as Month Day, Year (e.g., "April 30, 2025")
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC' // Use UTC to preserve the exact date
  })
}

/**
 * Format a date string into a compact format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Apr 30, 2025")
 */
export function formatDateCompact(dateString: string): string {
  // Parse the date parts from the string to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10))
  
  // Create date with explicit year, month (0-indexed), and day
  const date = new Date(year, month - 1, day)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC' // Use UTC to preserve the exact date
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